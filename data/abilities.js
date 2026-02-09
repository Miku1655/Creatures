// ========================================
// ABILITIES DATABASE
// Defines all passive and active abilities
// Content creators can add new abilities here
// ========================================

const ABILITIES = {
    // ========== PASSIVE ABILITIES ==========
    passive: {
        multi_hit: {
            name: "Multi-Hit",
            description: "Performs multiple basic attacks per turn",
            execute: (attacker, target, battleState, count = 2) => {
                // Handled in battle engine - performs multiple attacks
                return { multiHitCount: count };
            }
        },
        thorns: {
            name: "Thorns",
            description: "Reflects percentage of damage taken",
            execute: (defender, attacker, damage, reflectPercent = 15) => {
                const reflectedDamage = Math.floor(damage * (reflectPercent / 100));
                return { reflectedDamage };
            }
        },
        regen: {
            name: "Regeneration",
            description: "Heals percentage of HP per turn",
            execute: (creature, percent = 10) => {
                const healAmount = Math.floor(creature.maxHp * (percent / 100));
                return { heal: healAmount };
            }
        },
        lifesteal: {
            name: "Lifesteal",
            description: "Heals self for percentage of damage dealt",
            execute: (attacker, damageDealt, percent = 20) => {
                const healAmount = Math.floor(damageDealt * (percent / 100));
                return { heal: healAmount };
            }
        },
        ignore_shield: {
            name: "Armor Piercing",
            description: "Basic attacks bypass enemy shields",
            execute: () => {
                return { ignoreShield: true };
            }
        },
        fortify: {
            name: "Fortify",
            description: "Enhanced shield effectiveness above HP threshold",
            execute: (creature, threshold = 50) => {
                const hpPercent = (creature.currentHp / creature.maxHp) * 100;
                return { shieldMultiplier: hpPercent >= threshold ? 2 : 1 };
            }
        },
        revive: {
            name: "Rebirth",
            description: "Chance to revive once per battle",
            execute: (creature, chance = 50, hpPercent = 30) => {
                if (!creature.hasRevived && Math.random() * 100 < chance) {
                    const reviveHp = Math.floor(creature.maxHp * (hpPercent / 100));
                    return { revive: true, hp: reviveHp };
                }
                return { revive: false };
            }
        },
        multi_target: {
            name: "Multi-Target",
            description: "Attacks multiple enemies",
            execute: () => {
                return { multiTarget: true }; // Hits opposite + adjacent
            }
        },
        poison: {
            name: "Poison",
            description: "Deals damage over time",
            execute: (target, damagePerTurn = 5, duration = 2) => {
                return { 
                    applyEffect: {
                        type: "poison",
                        damage: damagePerTurn,
                        duration: duration
                    }
                };
            }
        },
        evasion: {
            name: "Evasion",
            description: "Chance to completely avoid damage",
            execute: (chance = 30) => {
                return { evade: Math.random() * 100 < chance };
            }
        },
        execute: {
            name: "Execute",
            description: "Bonus damage to low HP enemies",
            execute: (target, damageMultiplier = 2, threshold = 30) => {
                const hpPercent = (target.currentHp / target.maxHp) * 100;
                return { 
                    damageMultiplier: hpPercent <= threshold ? damageMultiplier : 1 
                };
            }
        },
        cooldown_manip: {
            name: "Cooldown Manipulation",
            description: "Resets cooldowns on kill",
            execute: (creature) => {
                return { resetCooldowns: true };
            }
        },
        aura: {
            name: "Aura",
            description: "Buffs adjacent allies",
            execute: (stat, amount) => {
                return { 
                    auraType: stat, // "dmg", "hp", "shield"
                    auraAmount: amount 
                };
            }
        }
    },

    // ========== ACTIVE ABILITIES ==========
    active: {
        howl_buff: {
            name: "Rallying Howl",
            description: "Increases all allies' damage",
            cooldown: 3,
            execute: (caster, allies, amount = 5, duration = 2) => {
                return {
                    type: "buff",
                    targets: allies,
                    stat: "dmg",
                    amount: amount,
                    duration: duration
                };
            }
        },
        taunt: {
            name: "Taunt",
            description: "Forces enemies to target this creature",
            cooldown: 4,
            execute: (caster, enemies, duration = 1) => {
                return {
                    type: "taunt",
                    caster: caster,
                    targets: enemies,
                    duration: duration
                };
            }
        },
        aoe_heal: {
            name: "Area Heal",
            description: "Heals all allies",
            cooldown: 3,
            execute: (caster, allies, amount = 20) => {
                return {
                    type: "heal",
                    targets: allies,
                    amount: amount
                };
            }
        },
        ground_slam: {
            name: "Ground Slam",
            description: "Heavy damage to single target",
            cooldown: 2,
            execute: (caster, target, damage = 30) => {
                return {
                    type: "damage",
                    targets: [target],
                    amount: damage
                };
            }
        },
        aoe_damage: {
            name: "Area Damage",
            description: "Damages all enemies",
            cooldown: 4,
            execute: (caster, enemies, damage = 20) => {
                return {
                    type: "damage",
                    targets: enemies,
                    amount: damage
                };
            }
        },
        stat_steal: {
            name: "Stat Steal",
            description: "Permanently steals stat from enemy",
            cooldown: 3,
            execute: (caster, target, stat = "dmg", amount = 5) => {
                return {
                    type: "statSteal",
                    target: target,
                    stat: stat,
                    amount: amount,
                    permanent: true
                };
            }
        },
        low_hp_execute: {
            name: "Execute",
            description: "High damage to weakest enemy",
            cooldown: 3,
            execute: (caster, enemies, damage = 50) => {
                // Find weakest enemy
                const weakest = enemies.reduce((lowest, current) => 
                    current.currentHp < lowest.currentHp ? current : lowest
                );
                return {
                    type: "damage",
                    targets: [weakest],
                    amount: damage
                };
            }
        },
        shield_allies: {
            name: "Shield Allies",
            description: "Grants temporary shield to allies",
            cooldown: 4,
            execute: (caster, allies, shieldAmount = 15, duration = 2) => {
                return {
                    type: "buff",
                    targets: allies,
                    stat: "shield",
                    amount: shieldAmount,
                    duration: duration
                };
            }
        },
        stun: {
            name: "Stun",
            description: "Prevents enemy from acting",
            cooldown: 3,
            execute: (caster, target, duration = 1) => {
                return {
                    type: "stun",
                    targets: [target],
                    duration: duration
                };
            }
        },
        cd_increase: {
            name: "Cooldown Curse",
            description: "Increases enemy cooldowns",
            cooldown: 5,
            execute: (caster, enemies, amount = 2) => {
                return {
                    type: "cooldownIncrease",
                    targets: enemies,
                    amount: amount
                };
            }
        },
        life_drain: {
            name: "Life Drain",
            description: "Damages and heals",
            cooldown: 2,
            execute: (caster, target, damage = 25) => {
                return {
                    type: "lifeDrain",
                    target: target,
                    damage: damage,
                    healSelf: true
                };
            }
        },
        summon: {
            name: "Summon",
            description: "Calls a temporary ally",
            cooldown: 4,
            execute: (caster, summonStats, duration = 3) => {
                const minion = {
                    id: `summon_${Date.now()}`,
                    name: "Shadow Minion",
                    emoji: "👤",
                    temporary: true,
                    duration: duration,
                    ...summonStats
                };
                return {
                    type: "summon",
                    minion: minion
                };
            }
        }
    }
};

// Helper to get ability by type and ID
function getAbility(type, id) {
    return ABILITIES[type]?.[id];
}
