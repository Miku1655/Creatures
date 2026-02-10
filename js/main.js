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
    
    // Set up settings button
    document.getElementById('settings-btn').addEventListener('click', () => {
        showSettingsModal();
    });
    
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

// Screen loading functions are defined in js/screens/ files
// This file just handles the routing

// Expose global functions
window.gameAPI = {
    updateResourceDisplay,
    loadScreen,
    gameState,
    battleEngine
};

// Settings modal
function showSettingsModal() {
    const settings = gameState.state.settings;
    
    const content = `
        <div style="text-align: left; max-width: 400px; margin: 0 auto;">
            <h3 style="margin-bottom: 16px;">Game Settings</h3>
            
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px;">
                    <input type="checkbox" id="setting-auto-mode" ${settings.autoMode ? 'checked' : ''}> 
                    Auto Battle Mode by Default
                </label>
            </div>
            
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 4px;">SFX Volume:</label>
                <input type="range" id="setting-sfx" min="0" max="100" value="${settings.sfxVolume * 100}" style="width: 100%;">
                <span id="sfx-value">${Math.round(settings.sfxVolume * 100)}%</span>
            </div>
            
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 4px;">Music Volume:</label>
                <input type="range" id="setting-music" min="0" max="100" value="${settings.musicVolume * 100}" style="width: 100%;">
                <span id="music-value">${Math.round(settings.musicVolume * 100)}%</span>
            </div>
            
            <div style="background: var(--accent-bg); padding: 12px; border-radius: 8px; margin-top: 24px;">
                <div style="font-size: 0.9rem; opacity: 0.8;">Game Version: ${gameState.state.version}</div>
                <div style="font-size: 0.9rem; opacity: 0.8;">Total Battles: ${gameState.state.stats.totalBattles}</div>
                <div style="font-size: 0.9rem; opacity: 0.8;">Win Rate: ${gameState.state.stats.totalBattles > 0 ? Math.round((gameState.state.stats.totalWins / gameState.state.stats.totalBattles) * 100) : 0}%</div>
            </div>
        </div>
    `;
    
    UIManager.showModal('Settings', content, [
        {
            text: 'Save',
            class: 'btn-success',
            onclick: 'saveSettings()'
        },
        {
            text: 'Close',
            class: 'btn-secondary',
            onclick: 'UIManager.hideModal()'
        }
    ]);
    
    // Add event listeners for live updates
    document.getElementById('setting-sfx').addEventListener('input', (e) => {
        document.getElementById('sfx-value').textContent = e.target.value + '%';
    });
    
    document.getElementById('setting-music').addEventListener('input', (e) => {
        document.getElementById('music-value').textContent = e.target.value + '%';
    });
}

function saveSettings() {
    gameState.state.settings.autoMode = document.getElementById('setting-auto-mode').checked;
    gameState.state.settings.sfxVolume = document.getElementById('setting-sfx').value / 100;
    gameState.state.settings.musicVolume = document.getElementById('setting-music').value / 100;
    gameState.save();
    
    UIManager.showNotification('Settings saved!', 'success');
    UIManager.hideModal();
}
