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

// Screen loading functions are defined in js/screens/ files
// This file just handles the routing

// Expose global functions
window.gameAPI = {
    updateResourceDisplay,
    loadScreen,
    gameState,
    battleEngine
};
