// ========================================
// BATTLE ENGINE
// Handles all combat mechanics
// ========================================

class BattleEngine {
    constructor() {
        this.battleState = null;
        this.isRunning = false;
        this.autoMode = true;
        this.battleLog = [];
        this.callbacks = {
            onUpdate: null,
            onEnd: null
        };
    }

    // Initialize a new battle
    startBattle(playerTeam, enemyTeam, mode = 'auto') {
        this.autoMode = mode === 'auto';
        this.battleLog = [];
        
        // Randomize initial positions
        const shuffledPlayer = this.shuffleArray([...playerTeam]).slice(0, 8);
        const shuffledEnemy = this.shuffleArray([...enemyTeam]).slice(0, 8);
        
        this.battleState = {
            turn: 0,
            phase: 'player', // 'player' or 'enemy'
            
            player: {
                field: shuffledPlayer.slice(0, 4).map(c => this.createBattleCreature(c)),
                reserves: shuffledPlayer.slice(4).map(c => this.createBattleCreature(c))
            },
            
            enemy: {
                field: shuffledEnemy.slice(0, 4).map(c => this.createBattleCreature(c)),
                reserves: shuffledEnemy.slice(4).map(c => this.createBattleCreature(c))
            },
            
            effects: [], // Global effects (buffs, debuffs, etc.)
            ended: false,
            winner: null
        };
        
        this.isRunning = true;
        this.log('Battle started!');
        this.updateCallback();
        
        if (this.autoMode) {
            this.runAutoTurn();
        }
    }

    // Create battle-ready creature with combat stats
    createBattleCreature(creatureData) {
        const stats = { ...creatureData.baseStats };
        
        // Apply level bonuses
        if (creatureData.level && creatureData.upgrades) {
            const upgrade = creatureData.upgrades[`level${creatureData.level}`];
            if (upgrade) {
                stats.hp = upgrade.hp;
                stats.dmg = upgrade.dmg;
                if (upgrade.shield) stats.shield = upgrade.shield;
            }
        }
        
        return {
            ...creatureData,
            currentHp: stats.hp,
            maxHp: stats.hp,
            currentDmg: stats.dmg,
            currentShield: stats.shield || 0,
            cooldowns: { active: 0 },
            effects: [],
            hasRevived: false,
            alive: true
        };
    }

    // Shuffle array helper
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Execute one full turn (player + enemy phases)
    async runAutoTurn() {
        if (!this.isRunning || this.battleState.ended) return;
        
        this.battleState.turn++;
        this.log(`--- Turn ${this.battleState.turn} ---`);
        
        // Player phase
        await this.executePhase('player');
        
        if (this.checkBattleEnd()) return;
        
        // Enemy phase
        await this.executePhase('enemy');
        
        if (this.checkBattleEnd()) return;
        
        // Continue to next turn
        if (this.autoMode) {
            setTimeout(() => this.runAutoTurn(), 1000);
        }
    }

    // Execute one phase (all creatures act)
    async executePhase(side) {
        this.battleState.phase = side;
        const team = this.battleState[side];
        const enemyTeam = this.battleState[side === 'player' ? 'enemy' : 'player'];
        
        // Process each creature in order
        for (let i = 0; i < team.field.length; i++) {
            const creature = team.field[i];
            if (!creature || !creature.alive) continue;
            
            // Check stun
            if (this.hasEffect(creature, 'stun')) {
                this.log(`${creature.name} is stunned!`);
                continue;
            }
            
            // Use active ability if available
            if (creature.active && creature.cooldowns.active === 0) {
                if (this.autoMode) {
                    await this.useActiveAbility(creature, side);
                }
            }
            
            // Decrease cooldown
            if (creature.cooldowns.active > 0) {
                creature.cooldowns.active--;
            }
            
            // Perform basic attack
            await this.performBasicAttack(creature, i, side);
            
            // Process passive effects
            this.processPassives(creature, side);
            
            await this.delay(300);
        }
        
        // Process end-of-phase effects
        this.processEffects(side);
        this.updateCallback();
    }

    // Perform basic attack
    async performBasicAttack(attacker, position, attackerSide) {
        const defenderSide = attackerSide === 'player' ? 'enemy' : 'player';
        const defenders = this.battleState[defenderSide].field;
        
        // Determine target (opposite position, or pos 0 if empty)
        let target = defenders[position] || defenders[0];
        
        // Check for taunt
        const taunter = defenders.find(d => this.hasEffect(d, 'taunt'));
        if (taunter && taunter.alive) {
            target = taunter;
        }
        
        if (!target || !target.alive) return;
        
        // Check multi-hit passive
        const multiHitCount = this.getPassiveValue(attacker, 'multi_hit', 1);
        
        for (let i = 0; i < multiHitCount; i++) {
            if (!target || !target.alive) break;
            
            let damage = attacker.currentDmg;
            
            // Check execute passive
            const executeMulti = this.checkExecute(attacker, target);
            damage *= executeMulti;
            
            // Check ignore shield passive
            const ignoreShield = this.hasPassive(attacker, 'ignore_shield');
            
            // Apply shield
            if (!ignoreShield && target.currentShield > 0) {
                damage = Math.min(damage, target.currentShield);
            }
            
            // Check evasion
            if (this.checkEvasion(target)) {
                this.log(`${target.name} evaded the attack!`);
                continue;
            }
            
            // Deal damage
            target.currentHp -= damage;
            this.log(`${attacker.name} attacks ${target.name} for ${damage} damage!`);
            
            // Check lifesteal
            if (this.hasPassive(attacker, 'lifesteal')) {
                const heal = Math.floor(damage * 0.2);
                this.healCreature(attacker, heal);
            }
            
            // Check thorns
            if (this.hasPassive(target, 'thorns')) {
                const reflection = Math.floor(damage * 0.15);
                attacker.currentHp -= reflection;
                this.log(`${target.name}'s thorns reflect ${reflection} damage!`);
            }
            
            // Check death
            if (target.currentHp <= 0) {
                await this.handleDeath(target, defenderSide);
                
                // Check cooldown reset on kill
                if (this.hasPassive(attacker, 'cooldown_manip')) {
                    attacker.cooldowns.active = 0;
                    this.log(`${attacker.name}'s cooldowns reset!`);
                }
            }
        }
        
        this.updateCallback();
    }

    // Use active ability
    async useActiveAbility(creature, side) {
        const ability = getAbility('active', creature.active.id);
        if (!ability) return;
        
        const enemySide = side === 'player' ? 'enemy' : 'player';
        const allies = this.battleState[side].field.filter(c => c.alive);
        const enemies = this.battleState[enemySide].field.filter(c => c.alive);
        
        this.log(`${creature.name} uses ${ability.name}!`);
        
        // Execute ability (simplified - would need full implementation)
        const result = ability.execute(creature, enemies, allies);
        
        // Apply ability effects
        if (result.type === 'damage') {
            result.targets.forEach(target => {
                if (target && target.alive) {
                    target.currentHp -= result.amount;
                    this.log(`${target.name} takes ${result.amount} damage!`);
                    if (target.currentHp <= 0) {
                        this.handleDeath(target, enemySide);
                    }
                }
            });
        } else if (result.type === 'heal') {
            result.targets.forEach(target => {
                if (target && target.alive) {
                    this.healCreature(target, result.amount);
                }
            });
        }
        
        // Set cooldown
        creature.cooldowns.active = ability.cooldown;
        this.updateCallback();
    }

    // Process passive abilities
    processPassives(creature, side) {
        // Regen
        if (this.hasPassive(creature, 'regen')) {
            const heal = Math.floor(creature.maxHp * 0.1);
            this.healCreature(creature, heal);
        }
    }

    // Process effects (poisons, buffs, debuffs)
    processEffects(side) {
        const team = this.battleState[side];
        
        team.field.forEach(creature => {
            if (!creature || !creature.alive) return;
            
            creature.effects = creature.effects.filter(effect => {
                if (effect.type === 'poison') {
                    creature.currentHp -= effect.damage;
                    this.log(`${creature.name} takes ${effect.damage} poison damage!`);
                    
                    if (creature.currentHp <= 0) {
                        this.handleDeath(creature, side);
                    }
                }
                
                effect.duration--;
                return effect.duration > 0;
            });
        });
    }

    // Handle creature death
    async handleDeath(creature, side) {
        // Check revive
        if (!creature.hasRevived && this.hasPassive(creature, 'revive')) {
            if (Math.random() < 0.5) {
                creature.currentHp = Math.floor(creature.maxHp * 0.3);
                creature.hasRevived = true;
                this.log(`${creature.name} revived!`);
                return;
            }
        }
        
        creature.alive = false;
        creature.currentHp = 0;
        this.log(`${creature.name} was defeated!`);
        
        // Shift and replace
        const team = this.battleState[side];
        team.field = team.field.filter(c => c.alive);
        
        // Add from reserves
        if (team.reserves.length > 0) {
            const replacement = team.reserves.shift();
            team.field.push(replacement);
            this.log(`${replacement.name} enters the battle!`);
        }
        
        this.updateCallback();
    }

    // Check if battle ended
    checkBattleEnd() {
        const playerAlive = this.battleState.player.field.some(c => c && c.alive) || 
                            this.battleState.player.reserves.length > 0;
        const enemyAlive = this.battleState.enemy.field.some(c => c && c.alive) || 
                           this.battleState.enemy.reserves.length > 0;
        
        if (!playerAlive || !enemyAlive) {
            this.endBattle(!playerAlive ? 'enemy' : 'player');
            return true;
        }
        
        return false;
    }

    // End battle
    endBattle(winner) {
        this.battleState.ended = true;
        this.battleState.winner = winner;
        this.isRunning = false;
        this.log(`Battle ended! ${winner === 'player' ? 'Victory!' : 'Defeat!'}`);
        
        if (this.callbacks.onEnd) {
            this.callbacks.onEnd(winner);
        }
    }

    // Helper functions
    healCreature(creature, amount) {
        const oldHp = creature.currentHp;
        creature.currentHp = Math.min(creature.currentHp + amount, creature.maxHp);
        const actualHeal = creature.currentHp - oldHp;
        if (actualHeal > 0) {
            this.log(`${creature.name} heals for ${actualHeal} HP!`);
        }
    }

    hasPassive(creature, passiveId) {
        return creature.passive && creature.passive.id === passiveId;
    }

    hasEffect(creature, effectType) {
        return creature.effects.some(e => e.type === effectType);
    }

    getPassiveValue(creature, passiveId, defaultValue) {
        if (this.hasPassive(creature, passiveId)) {
            return creature.passive.value || defaultValue;
        }
        return defaultValue;
    }

    checkExecute(attacker, target) {
        if (!this.hasPassive(attacker, 'execute')) return 1;
        const hpPercent = (target.currentHp / target.maxHp) * 100;
        return hpPercent <= 30 ? 2 : 1;
    }

    checkEvasion(creature) {
        if (!this.hasPassive(creature, 'evasion')) return false;
        return Math.random() < 0.3;
    }

    log(message) {
        this.battleLog.push(message);
        console.log(message);
    }

    updateCallback() {
        if (this.callbacks.onUpdate) {
            this.callbacks.onUpdate(this.battleState);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Set callbacks
    setCallbacks(onUpdate, onEnd) {
        this.callbacks.onUpdate = onUpdate;
        this.callbacks.onEnd = onEnd;
    }
}

// Global battle engine instance
const battleEngine = new BattleEngine();
