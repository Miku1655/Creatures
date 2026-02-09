// ========================================
// LOCATIONS DATABASE
// Defines all locations/biomes in the game
// Content creators can add new locations here
// ========================================

const LOCATIONS_DATA = [
    {
        id: "forest",
        name: "Whispering Forest",
        emoji: "🌲",
        description: "Ancient woods filled with mystical creatures. Agile and supportive beings thrive here.",
        theme: {
            primary: "#2d5016",
            secondary: "#4a7c59",
            accent: "#8bc34a"
        },
        unlocked: true, // Starting location
        unlockRequirement: null
    },
    {
        id: "volcano",
        name: "Ember Volcano",
        emoji: "🌋",
        description: "Scorching peaks where fire and earth collide. Home to powerful, tanky creatures.",
        theme: {
            primary: "#bf360c",
            secondary: "#d84315",
            accent: "#ff5722"
        },
        unlocked: false,
        unlockRequirement: {
            type: "campaign",
            chapter: 3,
            message: "Complete Chapter 3 of Whispering Forest"
        }
    },
    {
        id: "ocean",
        name: "Abyssal Ocean",
        emoji: "🌊",
        description: "Mysterious depths hiding ancient sea monsters. Multi-target attackers dominate these waters.",
        theme: {
            primary: "#01579b",
            secondary: "#0277bd",
            accent: "#03a9f4"
        },
        unlocked: false,
        unlockRequirement: {
            type: "campaign",
            chapter: 5,
            message: "Complete Chapter 5 of Ember Volcano"
        }
    },
    {
        id: "desert",
        name: "Sunscorched Desert",
        emoji: "🏜️",
        description: "Endless sands concealing deadly predators. Fast strikers with debuffs await.",
        theme: {
            primary: "#e65100",
            secondary: "#f57c00",
            accent: "#ffb74d"
        },
        unlocked: false,
        unlockRequirement: {
            type: "campaign",
            chapter: 7,
            message: "Complete Chapter 7 of Abyssal Ocean"
        }
    },
    {
        id: "shadow",
        name: "Shadow Realm",
        emoji: "🌑",
        description: "Dark dimension where reality bends. High-risk, high-reward creatures lurk in darkness.",
        theme: {
            primary: "#1a1a1a",
            secondary: "#424242",
            accent: "#9c27b0"
        },
        unlocked: false,
        unlockRequirement: {
            type: "campaign",
            chapter: 10,
            message: "Complete Chapter 10 of Sunscorched Desert"
        }
    },
    {
        id: "celestial",
        name: "Celestial Peaks",
        emoji: "⭐",
        description: "Heavenly realm above the clouds. Divine creatures with unique support abilities.",
        theme: {
            primary: "#311b92",
            secondary: "#512da8",
            accent: "#b39ddb"
        },
        unlocked: false,
        unlockRequirement: {
            type: "arena",
            tier: 20,
            message: "Reach Arena Tier 20"
        }
    },
    {
        id: "void",
        name: "The Void",
        emoji: "🕳️",
        description: "Dimension beyond reality. Only the strongest dare venture here for legendary creatures.",
        theme: {
            primary: "#000000",
            secondary: "#1a1a2e",
            accent: "#e94560"
        },
        unlocked: false,
        unlockRequirement: {
            type: "mixed",
            conditions: [
                { type: "campaign", chapter: 15 },
                { type: "arena", tier: 50 }
            ],
            message: "Complete Chapter 15 of all campaigns AND reach Arena Tier 50"
        }
    }
];

// Helper functions
function getLocationById(id) {
    return LOCATIONS_DATA.find(loc => loc.id === id);
}

function getUnlockedLocations(gameState) {
    return LOCATIONS_DATA.filter(loc => {
        if (loc.unlocked) return true;
        
        if (!loc.unlockRequirement) return false;
        
        const req = loc.unlockRequirement;
        
        if (req.type === "campaign") {
            return gameState.campaign[req.chapter]?.completed || false;
        }
        
        if (req.type === "arena") {
            return gameState.arena.highestTier >= req.tier;
        }
        
        if (req.type === "mixed") {
            return req.conditions.every(condition => {
                if (condition.type === "campaign") {
                    return gameState.campaign[condition.chapter]?.completed || false;
                }
                if (condition.type === "arena") {
                    return gameState.arena.highestTier >= condition.tier;
                }
                return false;
            });
        }
        
        return false;
    });
}

function getNextLockedLocation(gameState) {
    return LOCATIONS_DATA.find(loc => !getUnlockedLocations(gameState).includes(loc));
}
