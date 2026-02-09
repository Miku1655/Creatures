// ========================================
// MAIN GAME INITIALIZATION
// ========================================

// Initialize game on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Eternal Arena Battler - Initializing...');
    
    // Try to load saved game
    const loaded = gameState.load();
    if (!loaded) {
        console.log('No save found, starting new game');
        initializeNewPlayer();
    }
    
    // Update UI with current resources
    updateResourceDisplay();
    
    // Set up navigation
    setupNavigation();
    
    // Load initial screen (Team screen)
    loadScreen('team');
    
    // Auto-save every 30 seconds
    setInterval(() => {
        gameState.save();
    }, 30000);
    
    console.log('Game initialized successfully!');
});

// Initialize new player with starter creatures
function initializeNewPlayer() {
    // Give 3 starter creatures from Forest
    const starters = ['forest_wolf', 'forest_wolf', 'forest_bear'];
    
    starters.forEach(creatureId => {
        const creatureData = getCreatureById(creatureId);
        if (creatureData) {
            const creature = gameState.addCreature(creatureData);
            gameState.addToTeam(creature.id);
        }
    });
    
    // Unlock Forest location
    gameState.state.campaign.forest = { completed: [] };
    
    gameState.save();
}

// Update resource display in header
function updateResourceDisplay() {
    const resources = gameState.state.resources;
    
    document.getElementById('gold-amount').textContent = resources.gold;
    document.getElementById('gem-amount').textContent = resources.gems;
    document.getElementById('dust-amount').textContent = resources.dust;
}

// Set up navigation buttons
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const screen = btn.dataset.screen;
            
            // Update active state
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Load screen
            loadScreen(screen);
        });
    });
}

// Load a screen
function loadScreen(screenName) {
    const container = document.getElementById('screen-container');
    
    // Clear current content
    container.innerHTML = '<div class="loading">Loading...</div>';
    
    // Load screen based on name
    switch(screenName) {
        case 'team':
            loadTeamScreen();
            break;
        case 'campaign':
            loadCampaignScreen();
            break;
        case 'arena':
            loadArenaScreen();
            break;
        case 'collection':
            loadCollectionScreen();
            break;
        case 'shop':
            loadShopScreen();
            break;
        case 'inventory':
            loadInventoryScreen();
            break;
        default:
            container.innerHTML = '<div class="error">Screen not found</div>';
    }
}

// Placeholder screen loaders (these would be in separate files)
function loadTeamScreen() {
    const container = document.getElementById('screen-container');
    
    const team = gameState.getTeamCreatures();
    
    let html = '<div class="screen team-screen">';
    html += '<h2>Your Team</h2>';
    html += '<div class="team-slots card-grid">';
    
    // Show team creatures
    for (let i = 0; i < 8; i++) {
        const creature = team[i];
        
        if (creature) {
            html += `
                <div class="creature-card ${creature.rarity}">
                    <div class="creature-header">
                        <span class="creature-name">${creature.name}</span>
                        <span class="creature-level">Lv ${creature.level}</span>
                    </div>
                    <div class="creature-image">${creature.emoji}</div>
                    <div class="creature-stats">
                        <div class="stat">
                            <div class="stat-label">HP</div>
                            <div class="stat-value">${creature.baseStats.hp}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">DMG</div>
                            <div class="stat-value">${creature.baseStats.dmg}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">Shield</div>
                            <div class="stat-value">${creature.baseStats.shield || 0}</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            html += '<div class="creature-card empty"><div class="creature-image">+</div><p>Empty Slot</p></div>';
        }
    }
    
    html += '</div>';
    html += '</div>';
    
    container.innerHTML = html;
}

function loadCampaignScreen() {
    const container = document.getElementById('screen-container');
    container.innerHTML = '<div class="screen"><h2>Campaign</h2><p>Campaign screen coming soon...</p></div>';
}

function loadArenaScreen() {
    const container = document.getElementById('screen-container');
    container.innerHTML = '<div class="screen"><h2>Arena</h2><p>Arena screen coming soon...</p></div>';
}

function loadCollectionScreen() {
    const container = document.getElementById('screen-container');
    
    let html = '<div class="screen collection-screen">';
    html += '<h2>Collection</h2>';
    html += '<div class="card-grid">';
    
    gameState.state.collection.forEach(creature => {
        html += `
            <div class="creature-card ${creature.rarity}">
                <div class="creature-header">
                    <span class="creature-name">${creature.name}</span>
                    <span class="creature-level">Lv ${creature.level}</span>
                </div>
                <div class="creature-image">${creature.emoji}</div>
                <div class="creature-stats">
                    <div class="stat">
                        <div class="stat-label">HP</div>
                        <div class="stat-value">${creature.baseStats.hp}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">DMG</div>
                        <div class="stat-value">${creature.baseStats.dmg}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Shield</div>
                        <div class="stat-value">${creature.baseStats.shield || 0}</div>
                    </div>
                </div>
                <div class="creature-abilities">
                    <div class="ability">
                        <span class="ability-name">${creature.passive.name}:</span>
                        ${creature.passive.description}
                    </div>
                    ${creature.active ? `
                        <div class="ability">
                            <span class="ability-name">${creature.active.name}:</span>
                            ${creature.active.description}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    html += '</div>';
    
    container.innerHTML = html;
}

function loadShopScreen() {
    const container = document.getElementById('screen-container');
    container.innerHTML = '<div class="screen"><h2>Shop</h2><p>Shop screen coming soon...</p></div>';
}

function loadInventoryScreen() {
    const container = document.getElementById('screen-container');
    container.innerHTML = '<div class="screen"><h2>Inventory</h2><p>Inventory screen coming soon...</p></div>';
}

// Expose global functions
window.gameAPI = {
    updateResourceDisplay,
    loadScreen,
    gameState,
    battleEngine
};
