// ========================================
// SHOP DATABASE
// Defines all purchasable packs and items
// Content creators can add new packs here
// ========================================

const SHOP_DATA = {
    // ========== CREATURE PACKS ==========
    packs: [
        {
            id: "basic_pack",
            name: "Basic Creature Pack",
            description: "3 random creatures from unlocked locations",
            emoji: "📦",
            cost: { gold: 200 },
            contents: {
                creatures: 3,
                rarityWeights: {
                    common: 70,
                    uncommon: 25,
                    rare: 5,
                    epic: 0,
                    legendary: 0
                }
            },
            available: true
        },
        {
            id: "standard_pack",
            name: "Standard Creature Pack",
            description: "4 random creatures with better odds",
            emoji: "📦",
            cost: { gold: 500 },
            contents: {
                creatures: 4,
                rarityWeights: {
                    common: 50,
                    uncommon: 35,
                    rare: 12,
                    epic: 3,
                    legendary: 0
                }
            },
            available: true
        },
        {
            id: "premium_pack",
            name: "Premium Creature Pack",
            description: "5 creatures with guaranteed rare or better",
            emoji: "🎁",
            cost: { gems: 50 },
            contents: {
                creatures: 5,
                rarityWeights: {
                    common: 30,
                    uncommon: 40,
                    rare: 20,
                    epic: 8,
                    legendary: 2
                },
                guaranteedRarity: "rare"
            },
            available: true
        },
        {
            id: "elite_pack",
            name: "Elite Creature Pack",
            description: "5 creatures with guaranteed epic or legendary",
            emoji: "💎",
            cost: { gems: 150 },
            contents: {
                creatures: 5,
                rarityWeights: {
                    common: 0,
                    uncommon: 20,
                    rare: 40,
                    epic: 30,
                    legendary: 10
                },
                guaranteedRarity: "epic"
            },
            available: true
        }
    ],

    // ========== LOCATION-THEMED PACKS ==========
    locationPacks: [
        {
            id: "forest_pack",
            name: "Forest Bundle",
            description: "5 creatures from Whispering Forest",
            emoji: "🌲",
            location: "forest",
            cost: { gold: 400 },
            contents: {
                creatures: 5,
                location: "forest",
                rarityWeights: {
                    common: 40,
                    uncommon: 40,
                    rare: 15,
                    epic: 5,
                    legendary: 0
                }
            },
            unlockRequirement: { location: "forest" }
        },
        {
            id: "volcano_pack",
            name: "Volcano Bundle",
            description: "5 creatures from Ember Volcano",
            emoji: "🌋",
            location: "volcano",
            cost: { gold: 600 },
            contents: {
                creatures: 5,
                location: "volcano",
                rarityWeights: {
                    common: 30,
                    uncommon: 40,
                    rare: 20,
                    epic: 8,
                    legendary: 2
                }
            },
            unlockRequirement: { location: "volcano" }
        },
        {
            id: "ocean_pack",
            name: "Ocean Bundle",
            description: "5 creatures from Abyssal Ocean",
            emoji: "🌊",
            location: "ocean",
            cost: { gold: 800 },
            contents: {
                creatures: 5,
                location: "ocean",
                rarityWeights: {
                    common: 25,
                    uncommon: 40,
                    rare: 25,
                    epic: 8,
                    legendary: 2
                }
            },
            unlockRequirement: { location: "ocean" }
        },
        {
            id: "desert_pack",
            name: "Desert Bundle",
            description: "5 creatures from Sunscorched Desert",
            emoji: "🏜️",
            location: "desert",
            cost: { gold: 1000 },
            contents: {
                creatures: 5,
                location: "desert",
                rarityWeights: {
                    common: 20,
                    uncommon: 40,
                    rare: 25,
                    epic: 12,
                    legendary: 3
                }
            },
            unlockRequirement: { location: "desert" }
        },
        {
            id: "shadow_pack",
            name: "Shadow Bundle",
            description: "5 creatures from Shadow Realm",
            emoji: "🌑",
            location: "shadow",
            cost: { gems: 100 },
            contents: {
                creatures: 5,
                location: "shadow",
                rarityWeights: {
                    common: 15,
                    uncommon: 35,
                    rare: 30,
                    epic: 15,
                    legendary: 5
                }
            },
            unlockRequirement: { location: "shadow" }
        }
    ],

    // ========== RESOURCE BUNDLES ==========
    resources: [
        {
            id: "small_gold",
            name: "Small Gold Pouch",
            description: "500 Gold",
            emoji: "💰",
            cost: { gems: 10 },
            contents: { gold: 500 }
        },
        {
            id: "medium_gold",
            name: "Medium Gold Chest",
            description: "1500 Gold",
            emoji: "💰",
            cost: { gems: 25 },
            contents: { gold: 1500 }
        },
        {
            id: "large_gold",
            name: "Large Gold Vault",
            description: "5000 Gold",
            emoji: "💰",
            cost: { gems: 75 },
            contents: { gold: 5000 }
        },
        {
            id: "small_dust",
            name: "Small Dust Vial",
            description: "100 Dust",
            emoji: "✨",
            cost: { gems: 15 },
            contents: { dust: 100 }
        },
        {
            id: "medium_dust",
            name: "Medium Dust Container",
            description: "300 Dust",
            emoji: "✨",
            cost: { gems: 40 },
            contents: { dust: 300 }
        },
        {
            id: "large_dust",
            name: "Large Dust Reservoir",
            description: "1000 Dust",
            emoji: "✨",
            cost: { gems: 100 },
            contents: { dust: 1000 }
        }
    ],

    // ========== DAILY DEALS ==========
    dailyDeals: {
        freeDaily: {
            name: "Daily Free Pack",
            description: "One free basic pack every 24 hours",
            emoji: "🎁",
            cost: { gold: 0, gems: 0 },
            cooldown: 86400000, // 24 hours in ms
            contents: {
                creatures: 2,
                rarityWeights: {
                    common: 80,
                    uncommon: 18,
                    rare: 2,
                    epic: 0,
                    legendary: 0
                }
            }
        },
        generateRandomDeal: () => {
            // Generate a random daily deal (50% off a random pack)
            const allPacks = [...SHOP_DATA.packs, ...SHOP_DATA.locationPacks];
            const randomPack = allPacks[Math.floor(Math.random() * allPacks.length)];
            
            return {
                ...randomPack,
                name: `Daily Deal: ${randomPack.name}`,
                cost: {
                    gold: randomPack.cost.gold ? Math.floor(randomPack.cost.gold * 0.5) : undefined,
                    gems: randomPack.cost.gems ? Math.floor(randomPack.cost.gems * 0.5) : undefined
                },
                isDaily: true,
                expiresIn: 86400000 // 24 hours
            };
        }
    },

    // ========== SPECIAL OFFERS ==========
    specialOffers: [
        {
            id: "starter_bundle",
            name: "Starter Bundle",
            description: "Perfect for new players! 10 creatures + 1000 gold + 200 dust",
            emoji: "🎯",
            cost: { gems: 100 },
            contents: {
                creatures: 10,
                gold: 1000,
                dust: 200,
                rarityWeights: {
                    common: 40,
                    uncommon: 40,
                    rare: 15,
                    epic: 5,
                    legendary: 0
                },
                guaranteedRarity: "rare"
            },
            oneTimeOnly: true,
            available: true
        },
        {
            id: "mega_bundle",
            name: "Mega Champion Bundle",
            description: "20 creatures + 5000 gold + 1000 dust + guaranteed legendary",
            emoji: "👑",
            cost: { gems: 500 },
            contents: {
                creatures: 20,
                gold: 5000,
                dust: 1000,
                rarityWeights: {
                    common: 20,
                    uncommon: 30,
                    rare: 30,
                    epic: 15,
                    legendary: 5
                },
                guaranteedRarity: "legendary",
                guaranteedCount: 2
            },
            oneTimeOnly: false,
            available: true
        }
    ]
};

// Helper functions
function getPurchaseablePacks(gameState) {
    const unlocked = getUnlockedLocations(gameState);
    const unlockedLocationIds = unlocked.map(loc => loc.id);
    
    return [
        ...SHOP_DATA.packs,
        ...SHOP_DATA.locationPacks.filter(pack => 
            !pack.unlockRequirement || 
            unlockedLocationIds.includes(pack.unlockRequirement.location)
        )
    ];
}

function getAvailableSpecialOffers(gameState) {
    return SHOP_DATA.specialOffers.filter(offer => {
        if (offer.oneTimeOnly) {
            return !gameState.shop.purchasedOneTime?.includes(offer.id);
        }
        return offer.available;
    });
}

function getDailyDeal(gameState) {
    // Check if daily deal is still valid
    const lastDeal = gameState.shop.dailyDeal;
    const now = Date.now();
    
    if (!lastDeal || now - lastDeal.timestamp > 86400000) {
        // Generate new deal
        return {
            ...SHOP_DATA.dailyDeals.generateRandomDeal(),
            timestamp: now
        };
    }
    
    return lastDeal;
}

function canClaimFreeDaily(gameState) {
    const lastClaim = gameState.shop.lastFreeClaim || 0;
    return Date.now() - lastClaim >= SHOP_DATA.dailyDeals.freeDaily.cooldown;
}
