// ========================================
// CREATURES DATABASE
// Content creators can easily add new creatures here!
// ========================================

const CREATURES_DATA = [
    // ========== FOREST CREATURES ==========
    {
        id: "forest_wolf",
        name: "Shadow Wolf",
        emoji: "🐺",
        rarity: "common",
        location: "forest",
        baseStats: {
            hp: 80,
            dmg: 15,
            shield: 0
        },
        passive: {
            id: "multi_hit",
            name: "Double Strike",
            description: "Performs 2 basic attacks per turn"
        },
        active: {
            id: "howl_buff",
            name: "Rallying Howl",
            description: "Increases all allies' DMG by 5 for 2 turns",
            cooldown: 3
        },
        upgrades: {
            level1: { hp: 95, dmg: 18, passiveBonus: "Double Strike damage +2" },
            level2: { hp: 110, dmg: 22, activeBonus: "DMG buff increases to +7" },
            level3: { hp: 130, dmg: 28, specialBonus: "Adds lifesteal 10% to basic attacks" }
        }
    },
    {
        id: "forest_bear",
        name: "Ironbark Bear",
        emoji: "🐻",
        rarity: "uncommon",
        location: "forest",
        baseStats: {
            hp: 150,
            dmg: 12,
            shield: 15
        },
        passive: {
            id: "thorns",
            name: "Thorny Hide",
            description: "Reflects 15% of damage taken"
        },
        active: {
            id: "taunt",
            name: "Roar of Challenge",
            description: "Forces all enemies to target this creature for 1 turn",
            cooldown: 4
        },
        upgrades: {
            level1: { hp: 170, dmg: 14, passiveBonus: "Thorns reflection increases to 20%" },
            level2: { hp: 195, dmg: 16, activeBonus: "Taunt duration increases to 2 turns" },
            level3: { hp: 230, dmg: 20, specialBonus: "Shield increases to 25" }
        }
    },
    {
        id: "forest_sprite",
        name: "Healing Sprite",
        emoji: "🧚",
        rarity: "rare",
        location: "forest",
        baseStats: {
            hp: 60,
            dmg: 8,
            shield: 0
        },
        passive: {
            id: "regen",
            name: "Nature's Blessing",
            description: "Heals 10% HP per turn to self"
        },
        active: {
            id: "aoe_heal",
            name: "Mass Restoration",
            description: "Heals all allies for 20 HP",
            cooldown: 3
        },
        upgrades: {
            level1: { hp: 70, dmg: 10, passiveBonus: "Regen increases to 15%" },
            level2: { hp: 80, dmg: 12, activeBonus: "Mass Restoration heals 30 HP" },
            level3: { hp: 95, dmg: 15, specialBonus: "Passive regen affects adjacent allies at 5%" }
        }
    },

    // ========== VOLCANO CREATURES ==========
    {
        id: "volcano_golem",
        name: "Magma Golem",
        emoji: "🗿",
        rarity: "common",
        location: "volcano",
        baseStats: {
            hp: 120,
            dmg: 18,
            shield: 20
        },
        passive: {
            id: "ignore_shield",
            name: "Armor Piercing",
            description: "Basic attacks bypass enemy shields"
        },
        active: {
            id: "ground_slam",
            name: "Molten Slam",
            description: "Deals 30 damage to opposite enemy",
            cooldown: 2
        },
        upgrades: {
            level1: { hp: 140, dmg: 22, passiveBonus: "No change" },
            level2: { hp: 165, dmg: 26, activeBonus: "Slam deals 40 damage" },
            level3: { hp: 195, dmg: 32, specialBonus: "Shield increases to 30" }
        }
    },
    {
        id: "volcano_phoenix",
        name: "Ember Phoenix",
        emoji: "🔥",
        rarity: "legendary",
        location: "volcano",
        baseStats: {
            hp: 90,
            dmg: 25,
            shield: 0
        },
        passive: {
            id: "revive",
            name: "Rebirth",
            description: "50% chance to revive with 30% HP once per battle"
        },
        active: {
            id: "aoe_damage",
            name: "Inferno Blast",
            description: "Deals 20 damage to all enemies",
            cooldown: 4
        },
        upgrades: {
            level1: { hp: 105, dmg: 30, passiveBonus: "Revive chance increases to 60%" },
            level2: { hp: 120, dmg: 36, activeBonus: "Inferno Blast deals 25 damage" },
            level3: { hp: 140, dmg: 45, specialBonus: "Revive HP increases to 50%" }
        }
    },
    {
        id: "volcano_drake",
        name: "Lava Drake",
        emoji: "🐉",
        rarity: "epic",
        location: "volcano",
        baseStats: {
            hp: 100,
            dmg: 22,
            shield: 10
        },
        passive: {
            id: "lifesteal",
            name: "Vampiric Flames",
            description: "Heals self for 20% of damage dealt"
        },
        active: {
            id: "stat_steal",
            name: "Drain Strength",
            description: "Steal 5 DMG from opposite enemy permanently",
            cooldown: 3
        },
        upgrades: {
            level1: { hp: 115, dmg: 26, passiveBonus: "Lifesteal increases to 25%" },
            level2: { hp: 130, dmg: 31, activeBonus: "Steals 7 DMG" },
            level3: { hp: 150, dmg: 38, specialBonus: "Lifesteal increases to 30%" }
        }
    },

    // ========== OCEAN CREATURES ==========
    {
        id: "ocean_kraken",
        name: "Deep Kraken",
        emoji: "🐙",
        rarity: "rare",
        location: "ocean",
        baseStats: {
            hp: 110,
            dmg: 16,
            shield: 0
        },
        passive: {
            id: "multi_target",
            name: "Tentacle Strike",
            description: "Attacks opposite and adjacent enemies"
        },
        active: {
            id: "low_hp_execute",
            name: "Crushing Grip",
            description: "Deals 50 damage to weakest enemy",
            cooldown: 3
        },
        upgrades: {
            level1: { hp: 125, dmg: 19, passiveBonus: "No change" },
            level2: { hp: 145, dmg: 23, activeBonus: "Execute deals 65 damage" },
            level3: { hp: 170, dmg: 28, specialBonus: "Execute cooldown reduces to 2" }
        }
    },
    {
        id: "ocean_turtle",
        name: "Ancient Turtle",
        emoji: "🐢",
        rarity: "uncommon",
        location: "ocean",
        baseStats: {
            hp: 180,
            dmg: 10,
            shield: 25
        },
        passive: {
            id: "fortify",
            name: "Impenetrable Shell",
            description: "Shield blocks 100% of damage when HP above 50%"
        },
        active: {
            id: "shield_allies",
            name: "Protective Barrier",
            description: "Grant 15 shield to all allies for 2 turns",
            cooldown: 4
        },
        upgrades: {
            level1: { hp: 205, dmg: 12, passiveBonus: "Shield threshold drops to 40% HP" },
            level2: { hp: 235, dmg: 14, activeBonus: "Grants 20 shield" },
            level3: { hp: 270, dmg: 17, specialBonus: "Shield increases to 35" }
        }
    },

    // ========== DESERT CREATURES ==========
    {
        id: "desert_scorpion",
        name: "Sandstorm Scorpion",
        emoji: "🦂",
        rarity: "common",
        location: "desert",
        baseStats: {
            hp: 70,
            dmg: 20,
            shield: 0
        },
        passive: {
            id: "poison",
            name: "Venom Strike",
            description: "Attacks deal 5 additional damage over 2 turns"
        },
        active: {
            id: "stun",
            name: "Paralyzing Sting",
            description: "Prevents opposite enemy from acting next turn",
            cooldown: 3
        },
        upgrades: {
            level1: { hp: 80, dmg: 24, passiveBonus: "Poison damage increases to 7" },
            level2: { hp: 92, dmg: 28, activeBonus: "Stun lasts 2 turns" },
            level3: { hp: 105, dmg: 35, specialBonus: "Poison affects adjacent enemies" }
        }
    },
    {
        id: "desert_sphinx",
        name: "Riddle Sphinx",
        emoji: "🦁",
        rarity: "legendary",
        location: "desert",
        baseStats: {
            hp: 95,
            dmg: 18,
            shield: 12
        },
        passive: {
            id: "cooldown_manip",
            name: "Time Warp",
            description: "Reset own cooldowns on kill"
        },
        active: {
            id: "cd_increase",
            name: "Curse of Delay",
            description: "Adds +2 cooldown to all enemy active abilities",
            cooldown: 5
        },
        upgrades: {
            level1: { hp: 110, dmg: 22, passiveBonus: "Reduces own cooldowns by 1 on kill" },
            level2: { hp: 125, dmg: 27, activeBonus: "Adds +3 cooldown" },
            level3: { hp: 145, dmg: 34, specialBonus: "Passive also heals 20 HP on kill" }
        }
    },

    // ========== SHADOW REALM CREATURES ==========
    {
        id: "shadow_reaper",
        name: "Soul Reaper",
        emoji: "💀",
        rarity: "epic",
        location: "shadow",
        baseStats: {
            hp: 85,
            dmg: 28,
            shield: 0
        },
        passive: {
            id: "execute",
            name: "Death's Touch",
            description: "Deals double damage to enemies below 30% HP"
        },
        active: {
            id: "life_drain",
            name: "Soul Siphon",
            description: "Deals 25 damage and heals self for amount dealt",
            cooldown: 2
        },
        upgrades: {
            level1: { hp: 98, dmg: 33, passiveBonus: "Execute threshold increases to 40% HP" },
            level2: { hp: 112, dmg: 39, activeBonus: "Siphon deals 35 damage" },
            level3: { hp: 130, dmg: 48, specialBonus: "Execute damage triples instead of doubles" }
        }
    },
    {
        id: "shadow_wraith",
        name: "Phase Wraith",
        emoji: "👻",
        rarity: "rare",
        location: "shadow",
        baseStats: {
            hp: 75,
            dmg: 14,
            shield: 0
        },
        passive: {
            id: "evasion",
            name: "Ethereal Form",
            description: "30% chance to completely avoid damage"
        },
        active: {
            id: "summon",
            name: "Call Shadows",
            description: "Summon a temporary shadow minion (40 HP, 10 DMG) for 3 turns",
            cooldown: 4
        },
        upgrades: {
            level1: { hp: 85, dmg: 17, passiveBonus: "Evasion increases to 40%" },
            level2: { hp: 95, dmg: 20, activeBonus: "Minion has 55 HP, 15 DMG" },
            level3: { hp: 110, dmg: 25, specialBonus: "Summons 2 minions" }
        }
    }
];

// Helper function to get creatures by location
function getCreaturesByLocation(location) {
    return CREATURES_DATA.filter(c => c.location === location);
}

// Helper function to get creature by ID
function getCreatureById(id) {
    return CREATURES_DATA.find(c => c.id === id);
}

// Helper function to get creatures by rarity
function getCreaturesByRarity(rarity) {
    return CREATURES_DATA.filter(c => c.rarity === rarity);
}
