// ========================================
// CAMPAIGN DATABASE
// Defines all campaign chapters and battles
// Content creators can add new chapters here
// ========================================

const CAMPAIGN_DATA = {
    // ========== WHISPERING FOREST CAMPAIGN ==========
    forest: [
        {
            chapter: 1,
            name: "Forest Awakening",
            description: "Your journey begins in the peaceful outskirts of the Whispering Forest.",
            battles: [
                {
                    id: "forest_1_1",
                    name: "First Encounter",
                    enemyTeam: ["forest_wolf", "forest_wolf"],
                    rewards: { gold: 50, dust: 10, creatures: [] },
                    difficulty: 1
                },
                {
                    id: "forest_1_2",
                    name: "Pack Hunters",
                    enemyTeam: ["forest_wolf", "forest_wolf", "forest_wolf"],
                    rewards: { gold: 75, dust: 15, creatures: ["forest_wolf"] },
                    difficulty: 1
                },
                {
                    id: "forest_1_3",
                    name: "Guardian Bear",
                    enemyTeam: ["forest_bear", "forest_wolf", "forest_wolf"],
                    rewards: { gold: 100, dust: 20, creatures: ["forest_bear"] },
                    difficulty: 2,
                    boss: true
                }
            ]
        },
        {
            chapter: 2,
            name: "Deeper Woods",
            description: "Venture into the heart of the forest where magic flows stronger.",
            battles: [
                {
                    id: "forest_2_1",
                    name: "Enchanted Glade",
                    enemyTeam: ["forest_sprite", "forest_wolf", "forest_wolf"],
                    rewards: { gold: 120, dust: 25, creatures: [] },
                    difficulty: 2
                },
                {
                    id: "forest_2_2",
                    name: "Bear Territory",
                    enemyTeam: ["forest_bear", "forest_bear", "forest_wolf", "forest_wolf"],
                    rewards: { gold: 150, dust: 30, creatures: ["forest_bear"] },
                    difficulty: 3
                },
                {
                    id: "forest_2_3",
                    name: "Ancient Guardian",
                    enemyTeam: ["forest_bear", "forest_bear", "forest_sprite", "forest_sprite"],
                    rewards: { gold: 200, dust: 50, creatures: ["forest_sprite"], gems: 5 },
                    difficulty: 4,
                    boss: true
                }
            ]
        },
        {
            chapter: 3,
            name: "Forest Depths",
            description: "The darkest parts of the forest hide powerful creatures.",
            battles: [
                {
                    id: "forest_3_1",
                    name: "Sprite Circle",
                    enemyTeam: ["forest_sprite", "forest_sprite", "forest_sprite", "forest_wolf"],
                    rewards: { gold: 180, dust: 40, creatures: [] },
                    difficulty: 4
                },
                {
                    id: "forest_3_2",
                    name: "Elite Pack",
                    enemyTeam: ["forest_bear", "forest_wolf", "forest_wolf", "forest_sprite", "forest_sprite"],
                    rewards: { gold: 220, dust: 50, creatures: ["forest_wolf", "forest_sprite"] },
                    difficulty: 5
                },
                {
                    id: "forest_3_3",
                    name: "Forest King",
                    enemyTeam: ["forest_bear", "forest_bear", "forest_bear", "forest_sprite", "forest_sprite", "forest_wolf", "forest_wolf"],
                    rewards: { gold: 300, dust: 100, creatures: ["forest_bear", "forest_sprite"], gems: 10 },
                    difficulty: 6,
                    boss: true,
                    unlocks: "volcano"
                }
            ]
        }
    ],

    // ========== EMBER VOLCANO CAMPAIGN ==========
    volcano: [
        {
            chapter: 4,
            name: "Volcanic Foothills",
            description: "The heat intensifies as you approach the volcano's base.",
            battles: [
                {
                    id: "volcano_1_1",
                    name: "Magma Sentinels",
                    enemyTeam: ["volcano_golem", "volcano_golem"],
                    rewards: { gold: 150, dust: 35, creatures: [] },
                    difficulty: 4
                },
                {
                    id: "volcano_1_2",
                    name: "Drake Nest",
                    enemyTeam: ["volcano_drake", "volcano_golem", "volcano_golem"],
                    rewards: { gold: 180, dust: 45, creatures: ["volcano_golem"] },
                    difficulty: 5
                },
                {
                    id: "volcano_1_3",
                    name: "Ember Guardian",
                    enemyTeam: ["volcano_phoenix", "volcano_drake", "volcano_drake", "volcano_golem"],
                    rewards: { gold: 250, dust: 70, creatures: ["volcano_drake"], gems: 8 },
                    difficulty: 6,
                    boss: true
                }
            ]
        },
        {
            chapter: 5,
            name: "Molten Core",
            description: "The heart of the volcano pulses with ancient power.",
            battles: [
                {
                    id: "volcano_2_1",
                    name: "Phoenix Flight",
                    enemyTeam: ["volcano_phoenix", "volcano_drake", "volcano_drake"],
                    rewards: { gold: 220, dust: 60, creatures: [] },
                    difficulty: 6
                },
                {
                    id: "volcano_2_2",
                    name: "Golem Army",
                    enemyTeam: ["volcano_golem", "volcano_golem", "volcano_golem", "volcano_golem", "volcano_drake"],
                    rewards: { gold: 280, dust: 80, creatures: ["volcano_golem", "volcano_drake"] },
                    difficulty: 7
                },
                {
                    id: "volcano_2_3",
                    name: "Inferno Lord",
                    enemyTeam: ["volcano_phoenix", "volcano_phoenix", "volcano_drake", "volcano_drake", "volcano_golem", "volcano_golem"],
                    rewards: { gold: 400, dust: 150, creatures: ["volcano_phoenix"], gems: 15 },
                    difficulty: 8,
                    boss: true,
                    unlocks: "ocean"
                }
            ]
        }
    ],

    // ========== ABYSSAL OCEAN CAMPAIGN ==========
    ocean: [
        {
            chapter: 6,
            name: "Coastal Waters",
            description: "The ocean depths beckon with mysteries untold.",
            battles: [
                {
                    id: "ocean_1_1",
                    name: "Turtle Guardians",
                    enemyTeam: ["ocean_turtle", "ocean_turtle"],
                    rewards: { gold: 200, dust: 50, creatures: [] },
                    difficulty: 5
                },
                {
                    id: "ocean_1_2",
                    name: "Kraken Rising",
                    enemyTeam: ["ocean_kraken", "ocean_turtle", "ocean_turtle"],
                    rewards: { gold: 250, dust: 70, creatures: ["ocean_turtle"] },
                    difficulty: 6
                },
                {
                    id: "ocean_1_3",
                    name: "Deep Terror",
                    enemyTeam: ["ocean_kraken", "ocean_kraken", "ocean_turtle", "ocean_turtle"],
                    rewards: { gold: 350, dust: 120, creatures: ["ocean_kraken"], gems: 12 },
                    difficulty: 7,
                    boss: true
                }
            ]
        },
        {
            chapter: 7,
            name: "Abyssal Trench",
            description: "Descend to where light cannot reach.",
            battles: [
                {
                    id: "ocean_2_1",
                    name: "Tentacle Ambush",
                    enemyTeam: ["ocean_kraken", "ocean_kraken", "ocean_kraken"],
                    rewards: { gold: 300, dust: 90, creatures: [] },
                    difficulty: 7
                },
                {
                    id: "ocean_2_2",
                    name: "Ancient Shell",
                    enemyTeam: ["ocean_turtle", "ocean_turtle", "ocean_turtle", "ocean_kraken", "ocean_kraken"],
                    rewards: { gold: 380, dust: 110, creatures: ["ocean_turtle", "ocean_kraken"] },
                    difficulty: 8
                },
                {
                    id: "ocean_2_3",
                    name: "Leviathan",
                    enemyTeam: ["ocean_kraken", "ocean_kraken", "ocean_kraken", "ocean_turtle", "ocean_turtle", "ocean_turtle"],
                    rewards: { gold: 500, dust: 200, creatures: ["ocean_kraken", "ocean_turtle"], gems: 20 },
                    difficulty: 9,
                    boss: true,
                    unlocks: "desert"
                }
            ]
        }
    ]
};

// Helper functions
function getCampaignByLocation(locationId) {
    return CAMPAIGN_DATA[locationId] || [];
}

function getChapter(locationId, chapterNumber) {
    const campaign = CAMPAIGN_DATA[locationId];
    if (!campaign) return null;
    return campaign.find(ch => ch.chapter === chapterNumber);
}

function getBattle(locationId, battleId) {
    const campaign = CAMPAIGN_DATA[locationId];
    if (!campaign) return null;
    
    for (const chapter of campaign) {
        const battle = chapter.battles.find(b => b.id === battleId);
        if (battle) return battle;
    }
    return null;
}

function getNextChapter(locationId, currentChapter) {
    const campaign = CAMPAIGN_DATA[locationId];
    if (!campaign) return null;
    return campaign.find(ch => ch.chapter === currentChapter + 1);
}
