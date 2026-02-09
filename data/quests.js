// ========================================
// QUESTS DATABASE
// Defines daily quests and special missions
// Content creators can add new quests here
// ========================================

const QUESTS_DATA = {
    // ========== DAILY QUESTS ==========
    // Generate 3 random daily quests every 24 hours
    dailyQuests: [
        {
            id: "daily_battles_5",
            name: "Battle Practice",
            description: "Complete 5 battles (Campaign or Arena)",
            emoji: "⚔️",
            requirement: { type: "battles", count: 5 },
            rewards: { gold: 150, dust: 30 }
        },
        {
            id: "daily_battles_10",
            name: "Warrior's Dedication",
            description: "Complete 10 battles",
            emoji: "⚔️",
            requirement: { type: "battles", count: 10 },
            rewards: { gold: 300, dust: 60, gems: 5 }
        },
        {
            id: "daily_wins_3",
            name: "Victory Streak",
            description: "Win 3 battles",
            emoji: "🏆",
            requirement: { type: "wins", count: 3 },
            rewards: { gold: 200, dust: 40 }
        },
        {
            id: "daily_campaign",
            name: "Story Progress",
            description: "Complete 3 campaign battles",
            emoji: "📖",
            requirement: { type: "campaign_battles", count: 3 },
            rewards: { gold: 180, dust: 35 }
        },
        {
            id: "daily_arena",
            name: "Arena Challenge",
            description: "Win 2 arena battles",
            emoji: "🏟️",
            requirement: { type: "arena_wins", count: 2 },
            rewards: { gold: 250, dust: 50, gems: 3 }
        },
        {
            id: "daily_upgrade",
            name: "Power Up",
            description: "Upgrade any creature",
            emoji: "⬆️",
            requirement: { type: "upgrades", count: 1 },
            rewards: { gold: 100, dust: 80 }
        },
        {
            id: "daily_collection",
            name: "Collector",
            description: "Acquire 3 new creatures",
            emoji: "🎴",
            requirement: { type: "acquire_creatures", count: 3 },
            rewards: { gold: 200, dust: 40 }
        },
        {
            id: "daily_perfect",
            name: "Flawless Victory",
            description: "Win a battle without losing any creatures",
            emoji: "💯",
            requirement: { type: "perfect_win", count: 1 },
            rewards: { gold: 300, dust: 60, gems: 5 }
        },
        {
            id: "daily_abilities",
            name: "Ability Master",
            description: "Use active abilities 15 times in battles",
            emoji: "✨",
            requirement: { type: "abilities_used", count: 15 },
            rewards: { gold: 180, dust: 45 }
        },
        {
            id: "daily_damage",
            name: "Damage Dealer",
            description: "Deal 1000 total damage in battles",
            emoji: "💥",
            requirement: { type: "damage_dealt", count: 1000 },
            rewards: { gold: 200, dust: 50 }
        }
    ],

    // ========== WEEKLY QUESTS ==========
    weeklyQuests: [
        {
            id: "weekly_battles_30",
            name: "Battle Veteran",
            description: "Complete 30 battles this week",
            emoji: "🎖️",
            requirement: { type: "battles", count: 30 },
            rewards: { gold: 800, dust: 200, gems: 20 }
        },
        {
            id: "weekly_arena_15",
            name: "Arena Domination",
            description: "Win 15 arena battles this week",
            emoji: "🏆",
            requirement: { type: "arena_wins", count: 15 },
            rewards: { gold: 1000, dust: 250, gems: 25 }
        },
        {
            id: "weekly_campaign_chapter",
            name: "Chapter Master",
            description: "Complete an entire campaign chapter",
            emoji: "📚",
            requirement: { type: "chapter_complete", count: 1 },
            rewards: { gold: 1200, dust: 300, gems: 30 }
        },
        {
            id: "weekly_upgrades_5",
            name: "Evolution",
            description: "Upgrade 5 different creatures",
            emoji: "🔼",
            requirement: { type: "upgrades", count: 5 },
            rewards: { gold: 500, dust: 400, gems: 15 }
        },
        {
            id: "weekly_collection_10",
            name: "Grand Collector",
            description: "Acquire 10 new creatures",
            emoji: "🎴",
            requirement: { type: "acquire_creatures", count: 10 },
            rewards: { gold: 700, dust: 180, gems: 20 }
        },
        {
            id: "weekly_perfect_5",
            name: "Perfection",
            description: "Win 5 battles without losing creatures",
            emoji: "💎",
            requirement: { type: "perfect_win", count: 5 },
            rewards: { gold: 1500, dust: 350, gems: 35 }
        }
    ],

    // ========== ACHIEVEMENTS (One-time quests) ==========
    achievements: [
        {
            id: "achievement_first_battle",
            name: "First Blood",
            description: "Complete your first battle",
            emoji: "⚔️",
            requirement: { type: "battles", count: 1 },
            rewards: { gold: 100, dust: 20 },
            oneTime: true
        },
        {
            id: "achievement_first_win",
            name: "First Victory",
            description: "Win your first battle",
            emoji: "🏆",
            requirement: { type: "wins", count: 1 },
            rewards: { gold: 150, dust: 30 },
            oneTime: true
        },
        {
            id: "achievement_10_creatures",
            name: "Growing Collection",
            description: "Collect 10 unique creatures",
            emoji: "📚",
            requirement: { type: "unique_creatures", count: 10 },
            rewards: { gold: 300, dust: 60, gems: 5 },
            oneTime: true
        },
        {
            id: "achievement_50_creatures",
            name: "Master Collector",
            description: "Collect 50 unique creatures",
            emoji: "🎴",
            requirement: { type: "unique_creatures", count: 50 },
            rewards: { gold: 1000, dust: 200, gems: 25 },
            oneTime: true
        },
        {
            id: "achievement_all_locations",
            name: "World Traveler",
            description: "Unlock all locations",
            emoji: "🗺️",
            requirement: { type: "locations_unlocked", count: 7 },
            rewards: { gold: 2000, dust: 500, gems: 50 },
            oneTime: true
        },
        {
            id: "achievement_arena_10",
            name: "Arena Initiate",
            description: "Reach Arena Tier 10",
            emoji: "🏟️",
            requirement: { type: "arena_tier", count: 10 },
            rewards: { gold: 500, dust: 150, gems: 15 },
            oneTime: true
        },
        {
            id: "achievement_arena_50",
            name: "Arena Champion",
            description: "Reach Arena Tier 50",
            emoji: "👑",
            requirement: { type: "arena_tier", count: 50 },
            rewards: { gold: 2500, dust: 750, gems: 75 },
            oneTime: true
        },
        {
            id: "achievement_arena_100",
            name: "Arena Legend",
            description: "Reach Arena Tier 100",
            emoji: "⭐",
            requirement: { type: "arena_tier", count: 100 },
            rewards: { gold: 10000, dust: 2500, gems: 200 },
            oneTime: true
        },
        {
            id: "achievement_max_creature",
            name: "Maximum Power",
            description: "Get a creature to level 3",
            emoji: "💪",
            requirement: { type: "max_level_creature", count: 1 },
            rewards: { gold: 800, dust: 300, gems: 20 },
            oneTime: true
        },
        {
            id: "achievement_legendary",
            name: "Legendary Hunter",
            description: "Obtain your first legendary creature",
            emoji: "🌟",
            requirement: { type: "legendary_obtained", count: 1 },
            rewards: { gold: 1000, dust: 400, gems: 30 },
            oneTime: true
        },
        {
            id: "achievement_100_battles",
            name: "Battle Hardened",
            description: "Complete 100 total battles",
            emoji: "⚔️",
            requirement: { type: "battles", count: 100 },
            rewards: { gold: 1500, dust: 400, gems: 40 },
            oneTime: true
        },
        {
            id: "achievement_500_battles",
            name: "War Veteran",
            description: "Complete 500 total battles",
            emoji: "🎖️",
            requirement: { type: "battles", count: 500 },
            rewards: { gold: 5000, dust: 1500, gems: 100 },
            oneTime: true
        }
    ],

    // Generate 3 random daily quests
    generateDailyQuests: () => {
        const shuffled = [...QUESTS_DATA.dailyQuests].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
    },

    // Generate 2 random weekly quests
    generateWeeklyQuests: () => {
        const shuffled = [...QUESTS_DATA.weeklyQuests].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 2);
    }
};

// Helper functions
function checkQuestProgress(quest, gameState) {
    const stats = gameState.stats;
    const req = quest.requirement;
    
    let current = 0;
    
    switch(req.type) {
        case "battles":
            current = stats.totalBattles || 0;
            break;
        case "wins":
            current = stats.totalWins || 0;
            break;
        case "campaign_battles":
            current = stats.campaignBattles || 0;
            break;
        case "arena_wins":
            current = stats.arenaWins || 0;
            break;
        case "upgrades":
            current = stats.upgradesPerformed || 0;
            break;
        case "acquire_creatures":
            current = stats.creaturesAcquired || 0;
            break;
        case "perfect_win":
            current = stats.perfectWins || 0;
            break;
        case "abilities_used":
            current = stats.abilitiesUsed || 0;
            break;
        case "damage_dealt":
            current = stats.totalDamageDealt || 0;
            break;
        case "unique_creatures":
            current = gameState.collection?.length || 0;
            break;
        case "locations_unlocked":
            current = getUnlockedLocations(gameState).length;
            break;
        case "arena_tier":
            current = gameState.arena?.highestTier || 0;
            break;
        case "chapter_complete":
            current = stats.chaptersCompleted || 0;
            break;
        case "max_level_creature":
            current = gameState.collection?.filter(c => c.level === 3).length || 0;
            break;
        case "legendary_obtained":
            current = gameState.collection?.filter(c => c.rarity === "legendary").length || 0;
            break;
    }
    
    return {
        current,
        target: req.count,
        completed: current >= req.count
    };
}

function getAvailableQuests(gameState) {
    const now = Date.now();
    
    // Daily quests
    let dailies = gameState.quests.daily || [];
    if (!dailies.length || now - gameState.quests.dailyResetTime > 86400000) {
        dailies = QUESTS_DATA.generateDailyQuests();
        gameState.quests.dailyResetTime = now;
    }
    
    // Weekly quests
    let weeklies = gameState.quests.weekly || [];
    if (!weeklies.length || now - gameState.quests.weeklyResetTime > 604800000) {
        weeklies = QUESTS_DATA.generateWeeklyQuests();
        gameState.quests.weeklyResetTime = now;
    }
    
    // Achievements
    const completedAchievements = gameState.quests.completedAchievements || [];
    const availableAchievements = QUESTS_DATA.achievements.filter(
        a => !completedAchievements.includes(a.id)
    );
    
    return {
        daily: dailies,
        weekly: weeklies,
        achievements: availableAchievements
    };
}
