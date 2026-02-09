// ========================================
// ARENA DATABASE
// Defines arena tier progression and rewards
// Content creators can adjust difficulty scaling
// ========================================

const ARENA_DATA = {
    entryFee: {
        gold: 100,
        gems: 0
    },
    
    // Tier rewards given upon defeat (based on highest tier reached)
    tierRewards: (tier) => {
        const baseGold = 50;
        const baseDust = 10;
        const baseGems = Math.floor(tier / 10);
        
        return {
            gold: baseGold + (tier * 20),
            dust: baseDust + (tier * 5),
            gems: baseGems,
            creatureChance: tier >= 5 ? Math.min(tier * 2, 100) : 0 // % chance to get creature
        };
    },
    
    // Streak bonuses (multipliers for consecutive wins)
    streakBonuses: [
        { wins: 3, multiplier: 1.2, name: "Hot Streak" },
        { wins: 5, multiplier: 1.5, name: "On Fire" },
        { wins: 10, multiplier: 2.0, name: "Unstoppable" },
        { wins: 15, multiplier: 2.5, name: "Legendary" },
        { wins: 20, multiplier: 3.0, name: "Godlike" }
    ],
    
    // Generate enemy team for given tier
    generateEnemyTeam: (tier) => {
        const teamSize = Math.min(4 + Math.floor(tier / 5), 8); // Start with 4, max 8
        const avgLevel = Math.floor(tier / 10); // Level 0-3 based on tier
        
        // Get creatures based on tier
        let availableCreatures = [];
        
        if (tier >= 1) availableCreatures.push(...getCreaturesByLocation("forest"));
        if (tier >= 10) availableCreatures.push(...getCreaturesByLocation("volcano"));
        if (tier >= 20) availableCreatures.push(...getCreaturesByLocation("ocean"));
        if (tier >= 30) availableCreatures.push(...getCreaturesByLocation("desert"));
        if (tier >= 40) availableCreatures.push(...getCreaturesByLocation("shadow"));
        
        // Rarity chances based on tier
        let rarityWeights = {
            common: Math.max(70 - tier, 20),
            uncommon: Math.min(20 + tier * 0.5, 40),
            rare: Math.min(5 + tier * 0.3, 25),
            epic: Math.min(tier * 0.2, 10),
            legendary: Math.min(tier * 0.1, 5)
        };
        
        // Normalize weights
        const totalWeight = Object.values(rarityWeights).reduce((a, b) => a + b, 0);
        Object.keys(rarityWeights).forEach(key => {
            rarityWeights[key] = rarityWeights[key] / totalWeight * 100;
        });
        
        // Generate team
        const team = [];
        for (let i = 0; i < teamSize; i++) {
            const rarity = selectRarity(rarityWeights);
            const raritycreatures = availableCreatures.filter(c => c.rarity === rarity);
            
            if (raritycreatures.length > 0) {
                const creature = raritycreatures[Math.floor(Math.random() * raritycreatures.length)];
                team.push({
                    ...creature,
                    level: Math.min(avgLevel + Math.floor(Math.random() * 2), 3)
                });
            }
        }
        
        return team;
    },
    
    // Special tier milestones with guaranteed rewards
    milestones: [
        {
            tier: 10,
            name: "Initiate Champion",
            rewards: { gold: 500, dust: 200, gems: 10, guaranteedCreature: "rare" }
        },
        {
            tier: 25,
            name: "Seasoned Warrior",
            rewards: { gold: 1000, dust: 500, gems: 25, guaranteedCreature: "epic" }
        },
        {
            tier: 50,
            name: "Arena Master",
            rewards: { gold: 2500, dust: 1000, gems: 50, guaranteedCreature: "legendary" }
        },
        {
            tier: 75,
            name: "Eternal Legend",
            rewards: { gold: 5000, dust: 2000, gems: 100, guaranteedCreature: "legendary" }
        },
        {
            tier: 100,
            name: "Ascended One",
            rewards: { gold: 10000, dust: 5000, gems: 250, guaranteedCreature: "legendary" }
        }
    ],
    
    // Boss tiers - every 10 tiers
    isBossTier: (tier) => {
        return tier % 10 === 0 && tier > 0;
    },
    
    // Generate boss team (stronger, better synergies)
    generateBossTeam: (tier) => {
        const normalTeam = ARENA_DATA.generateEnemyTeam(tier);
        
        // Boost all stats by 25%
        return normalTeam.map(creature => ({
            ...creature,
            baseStats: {
                hp: Math.floor(creature.baseStats.hp * 1.25),
                dmg: Math.floor(creature.baseStats.dmg * 1.25),
                shield: Math.floor(creature.baseStats.shield * 1.25)
            },
            isBoss: true
        }));
    }
};

// Helper function to select rarity based on weights
function selectRarity(weights) {
    const rand = Math.random() * 100;
    let cumulative = 0;
    
    for (const [rarity, weight] of Object.entries(weights)) {
        cumulative += weight;
        if (rand <= cumulative) return rarity;
    }
    
    return "common";
}

// Get milestone for tier
function getMilestone(tier) {
    return ARENA_DATA.milestones.find(m => m.tier === tier);
}

// Calculate total rewards for arena run
function calculateArenaRewards(highestTier, currentStreak) {
    const baseRewards = ARENA_DATA.tierRewards(highestTier);
    
    // Apply streak bonus
    let multiplier = 1;
    for (const bonus of ARENA_DATA.streakBonuses) {
        if (currentStreak >= bonus.wins) {
            multiplier = bonus.multiplier;
        }
    }
    
    return {
        gold: Math.floor(baseRewards.gold * multiplier),
        dust: Math.floor(baseRewards.dust * multiplier),
        gems: baseRewards.gems,
        creatureChance: baseRewards.creatureChance,
        streakBonus: multiplier > 1 ? multiplier : null
    };
}
