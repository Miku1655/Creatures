// ========================================
// GAME STATE MANAGER
// Handles all game state and save/load
// ========================================

class GameState {
    constructor() {
        this.initializeNewGame();
    }

    initializeNewGame() {
        this.state = {
            // Resources
            resources: {
                gold: 1000,
                gems: 50,
                dust: 200
            },
            
            // Player's creature collection
            collection: [],
            
            // Current team (8 creature IDs)
            team: [],
            
            // Inventory (duplicates, sellable)
            inventory: [],
            
            // Campaign progress
            campaign: {
                // location_id: { chapter: X, battle: Y, completed: [] }
            },
            
            // Arena progress
            arena: {
                currentTier: 0,
                highestTier: 0,
                currentStreak: 0,
                bestStreak: 0,
                paidEntry: false
            },
            
            // Shop state
            shop: {
                lastFreeClaim: 0,
                dailyDeal: null,
                purchasedOneTime: []
            },
            
            // Quests
            quests: {
                daily: [],
                weekly: [],
                dailyResetTime: Date.now(),
                weeklyResetTime: Date.now(),
                completedDaily: [],
                completedWeekly: [],
                completedAchievements: []
            },
            
            // Statistics
            stats: {
                totalBattles: 0,
                totalWins: 0,
                totalLosses: 0,
                campaignBattles: 0,
                arenaWins: 0,
                upgradesPerformed: 0,
                creaturesAcquired: 0,
                perfectWins: 0,
                abilitiesUsed: 0,
                totalDamageDealt: 0,
                chaptersCompleted: 0
            },
            
            // Settings
            settings: {
                sfxVolume: 0.7,
                musicVolume: 0.5,
                autoMode: true
            },
            
            // Meta
            version: "1.0.0",
            lastPlayed: Date.now(),
            playtime: 0
        };
    }

    // Save game to localStorage
    save() {
        try {
            const saveData = JSON.stringify(this.state);
            localStorage.setItem('eternal_arena_save', saveData);
            console.log('Game saved successfully');
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }

    // Load game from localStorage
    load() {
        try {
            const saveData = localStorage.getItem('eternal_arena_save');
            if (saveData) {
                this.state = JSON.parse(saveData);
                this.state.lastPlayed = Date.now();
                console.log('Game loaded successfully');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to load game:', error);
            return false;
        }
    }

    // Reset game (delete save)
    reset() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
            localStorage.removeItem('eternal_arena_save');
            this.initializeNewGame();
            return true;
        }
        return false;
    }

    // Resource management
    addResource(type, amount) {
        if (this.state.resources[type] !== undefined) {
            this.state.resources[type] += amount;
            this.save();
            return true;
        }
        return false;
    }

    removeResource(type, amount) {
        if (this.state.resources[type] !== undefined) {
            if (this.state.resources[type] >= amount) {
                this.state.resources[type] -= amount;
                this.save();
                return true;
            }
        }
        return false;
    }

    canAfford(cost) {
        if (cost.gold && this.state.resources.gold < cost.gold) return false;
        if (cost.gems && this.state.resources.gems < cost.gems) return false;
        if (cost.dust && this.state.resources.dust < cost.dust) return false;
        return true;
    }

    // Creature management
    addCreature(creatureData) {
        const creature = {
            id: `${creatureData.id}_${Date.now()}_${Math.random()}`,
            baseId: creatureData.id,
            ...creatureData,
            level: 0,
            acquiredAt: Date.now()
        };
        
        this.state.collection.push(creature);
        this.state.stats.creaturesAcquired++;
        this.save();
        return creature;
    }

    removeCreature(creatureId) {
        const index = this.state.collection.findIndex(c => c.id === creatureId);
        if (index !== -1) {
            this.state.collection.splice(index, 1);
            // Remove from team if present
            const teamIndex = this.state.team.indexOf(creatureId);
            if (teamIndex !== -1) {
                this.state.team.splice(teamIndex, 1);
            }
            this.save();
            return true;
        }
        return false;
    }

    upgradeCreature(creatureId) {
        const creature = this.state.collection.find(c => c.id === creatureId);
        if (!creature) return false;
        
        if (creature.level >= 3) return false; // Max level
        
        // Check cost
        const dustCost = [50, 150, 400][creature.level];
        if (this.state.resources.dust < dustCost) return false;
        
        // Apply upgrade
        this.state.resources.dust -= dustCost;
        creature.level++;
        
        const upgrade = creature.upgrades[`level${creature.level}`];
        if (upgrade) {
            creature.baseStats.hp = upgrade.hp;
            creature.baseStats.dmg = upgrade.dmg;
        }
        
        this.state.stats.upgradesPerformed++;
        this.save();
        return true;
    }

    // Team management
    setTeam(creatureIds) {
        if (creatureIds.length > 8) return false;
        
        // Validate all creatures exist
        const valid = creatureIds.every(id => 
            this.state.collection.find(c => c.id === id)
        );
        
        if (valid) {
            this.state.team = creatureIds;
            this.save();
            return true;
        }
        return false;
    }

    addToTeam(creatureId) {
        if (this.state.team.length >= 8) return false;
        if (!this.state.collection.find(c => c.id === creatureId)) return false;
        if (this.state.team.includes(creatureId)) return false;
        
        this.state.team.push(creatureId);
        this.save();
        return true;
    }

    removeFromTeam(creatureId) {
        const index = this.state.team.indexOf(creatureId);
        if (index !== -1) {
            this.state.team.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    }

    // Campaign progress
    completeCampaignBattle(locationId, battleId, rewards) {
        if (!this.state.campaign[locationId]) {
            this.state.campaign[locationId] = { completed: [] };
        }
        
        if (!this.state.campaign[locationId].completed.includes(battleId)) {
            this.state.campaign[locationId].completed.push(battleId);
            
            // Award rewards
            if (rewards.gold) this.addResource('gold', rewards.gold);
            if (rewards.dust) this.addResource('dust', rewards.dust);
            if (rewards.gems) this.addResource('gems', rewards.gems);
            if (rewards.creatures) {
                rewards.creatures.forEach(creatureId => {
                    const creatureData = getCreatureById(creatureId);
                    if (creatureData) this.addCreature(creatureData);
                });
            }
            
            this.state.stats.campaignBattles++;
            this.save();
            return true;
        }
        return false;
    }

    // Arena progress
    updateArenaTier(newTier) {
        this.state.arena.currentTier = newTier;
        if (newTier > this.state.arena.highestTier) {
            this.state.arena.highestTier = newTier;
        }
        this.save();
    }

    updateArenaStreak(won) {
        if (won) {
            this.state.arena.currentStreak++;
            this.state.arena.arenaWins++;
            if (this.state.arena.currentStreak > this.state.arena.bestStreak) {
                this.state.arena.bestStreak = this.state.arena.currentStreak;
            }
        } else {
            this.state.arena.currentStreak = 0;
        }
        this.save();
    }

    // Statistics
    recordBattleResult(won, stats = {}) {
        this.state.stats.totalBattles++;
        if (won) {
            this.state.stats.totalWins++;
        } else {
            this.state.stats.totalLosses++;
        }
        
        if (stats.perfect) {
            this.state.stats.perfectWins++;
        }
        if (stats.damageDealt) {
            this.state.stats.totalDamageDealt += stats.damageDealt;
        }
        if (stats.abilitiesUsed) {
            this.state.stats.abilitiesUsed += stats.abilitiesUsed;
        }
        
        this.save();
    }

    // Get team creatures
    getTeamCreatures() {
        return this.state.team.map(id => 
            this.state.collection.find(c => c.id === id)
        ).filter(c => c !== undefined);
    }

    // Export/Import save
    exportSave() {
        return btoa(JSON.stringify(this.state));
    }

    importSave(saveString) {
        try {
            const decoded = JSON.parse(atob(saveString));
            this.state = decoded;
            this.save();
            return true;
        } catch (error) {
            console.error('Invalid save string:', error);
            return false;
        }
    }
}

// Global game state instance
const gameState = new GameState();
