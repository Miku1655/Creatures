// ========================================
// COLLECTION SCREEN
// View all collected creatures (bestiary)
// ========================================

function loadCollectionScreen() {
    const container = document.getElementById('screen-container');
    
    const collection = gameState.state.collection;
    
    let html = '<div class="screen collection-screen">';
    html += '<h2>Collection</h2>';
    html += `<p class="screen-subtitle">You have collected ${collection.length} creatures</p>`;
    
    // Filter buttons
    html += `
        <div style="margin-bottom: 16px; display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="CollectionScreen.filterBy('all')">All</button>
            <button class="btn btn-secondary" onclick="CollectionScreen.filterBy('common')">Common</button>
            <button class="btn btn-secondary" onclick="CollectionScreen.filterBy('uncommon')">Uncommon</button>
            <button class="btn btn-secondary" onclick="CollectionScreen.filterBy('rare')">Rare</button>
            <button class="btn btn-secondary" onclick="CollectionScreen.filterBy('epic')">Epic</button>
            <button class="btn btn-secondary" onclick="CollectionScreen.filterBy('legendary')">Legendary</button>
        </div>
    `;
    
    if (collection.length > 0) {
        html += '<div class="card-grid">';
        
        collection.forEach(creature => {
            const upgradeAvailable = creature.level < 3;
            const upgradeCost = [50, 150, 400][creature.level];
            const canUpgrade = upgradeAvailable && gameState.state.resources.dust >= upgradeCost;
            
            const creatureJson = JSON.stringify(creature).replace(/"/g, '&quot;');
            
            html += `
                <div class="creature-card ${creature.rarity}" data-rarity="${creature.rarity}">
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
                    <div style="display: flex; gap: 8px; margin-top: 12px;">
                        ${upgradeAvailable ? `
                            <button class="btn ${canUpgrade ? 'btn-success' : ''}" style="flex: 1;" onclick="CollectionScreen.upgradeCreature('${creature.id}')" ${!canUpgrade ? 'disabled' : ''}>
                                Upgrade (${upgradeCost}✨)
                            </button>
                        ` : `
                            <button class="btn" style="flex: 1;" disabled>MAX LEVEL</button>
                        `}
                        <button class="btn btn-secondary" style="flex: 1;" onclick='CreatureManager.openCreatureDetails(${creatureJson})'>
                            Details
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    } else {
        html += '<p style="text-align: center; opacity: 0.6; margin-top: 48px;">No creatures collected yet. Visit the Shop to get started!</p>';
    }
    
    html += '</div>';
    container.innerHTML = html;
}

const CollectionScreen = {
    currentFilter: 'all',
    
    filterBy(rarity) {
        this.currentFilter = rarity;
        
        const cards = document.querySelectorAll('.creature-card');
        cards.forEach(card => {
            if (rarity === 'all') {
                card.style.display = '';
            } else {
                card.style.display = card.dataset.rarity === rarity ? '' : 'none';
            }
        });
    },
    
    upgradeCreature(creatureId) {
        if (gameState.upgradeCreature(creatureId)) {
            UIManager.showNotification('Creature upgraded!', 'success');
            updateResourceDisplay();
            loadCollectionScreen();
        } else {
            UIManager.showNotification('Cannot upgrade (insufficient resources or max level)', 'error');
        }
    }
};
