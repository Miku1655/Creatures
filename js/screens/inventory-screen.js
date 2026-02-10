// ========================================
// INVENTORY SCREEN
// Manage your owned creatures - upgrade and sell
// ========================================

function loadInventoryScreen() {
    const container = document.getElementById('screen-container');
    
    const collection = gameState.state.collection;
    const resources = gameState.state.resources;
    const limit = gameState.state.collectionLimit;
    
    let html = '<div class="screen inventory-screen">';
    html += '<h2>Inventory</h2>';
    html += `<p class="screen-subtitle">Manage your creatures (${collection.length} / ${limit})</p>`;
    
    // Collection limit progress
    const percentage = (collection.length / limit) * 100;
    html += `
        <div style="background: var(--accent-bg); padding: 12px; border-radius: var(--radius-md); margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Collection Space:</span>
                <span style="font-weight: bold;">${collection.length} / ${limit}</span>
            </div>
            <div style="background: var(--primary-bg); height: 20px; border-radius: var(--radius-sm); overflow: hidden;">
                <div style="background: ${percentage >= 90 ? 'var(--highlight)' : 'var(--uncommon)'}; height: 100%; width: ${percentage}%;"></div>
            </div>
            ${percentage >= 90 ? '<p style="color: var(--highlight); margin-top: 8px; font-size: 0.9rem;">⚠️ Collection almost full! Sell creatures to make space.</p>' : ''}
        </div>
    `;
    
    // Filter and sort
    html += `
        <div style="margin-bottom: 16px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
            <span style="opacity: 0.8;">Filter:</span>
            <button class="btn btn-secondary" onclick="InventoryScreen.filterBy('all')">All</button>
            <button class="btn btn-secondary" onclick="InventoryScreen.filterBy('common')">Common</button>
            <button class="btn btn-secondary" onclick="InventoryScreen.filterBy('uncommon')">Uncommon</button>
            <button class="btn btn-secondary" onclick="InventoryScreen.filterBy('rare')">Rare</button>
            <button class="btn btn-secondary" onclick="InventoryScreen.filterBy('epic')">Epic</button>
            <button class="btn btn-secondary" onclick="InventoryScreen.filterBy('legendary')">Legendary</button>
            <span style="margin-left: 16px; opacity: 0.8;">Sort:</span>
            <button class="btn btn-secondary" onclick="InventoryScreen.sortBy('rarity')">Rarity</button>
            <button class="btn btn-secondary" onclick="InventoryScreen.sortBy('level')">Level</button>
            <button class="btn btn-secondary" onclick="InventoryScreen.sortBy('name')">Name</button>
        </div>
    `;
    
    if (collection.length > 0) {
        html += '<div class="card-grid" id="inventory-grid">';
        
        collection.forEach(creature => {
            const upgradeAvailable = creature.level < 3;
            const upgradeCost = [50, 150, 400][creature.level];
            const canUpgrade = upgradeAvailable && resources.dust >= upgradeCost;
            const sellPrice = InventoryScreen.getSellPrice(creature);
            const isInTeam = gameState.state.team.includes(creature.id);
            
            // Create a safe ID for the onclick handlers
            const safeId = creature.id.replace(/'/g, "\\'");
            
            html += `
                <div class="creature-card ${creature.rarity}" data-rarity="${creature.rarity}" data-level="${creature.level}" data-name="${creature.name}" data-creature-id="${creature.id}">
                    <div class="creature-header">
                        <span class="creature-name">${creature.name}</span>
                        <span class="creature-level">Lv ${creature.level}</span>
                    </div>
                    <div style="font-size: 0.7rem; opacity: 0.5; text-align: center; margin-bottom: 4px;">ID: ${creature.id.slice(-8)}</div>
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
                    ${isInTeam ? '<div style="text-align: center; background: var(--highlight); padding: 4px; border-radius: 4px; margin: 8px 0; font-size: 0.85rem;">⚔️ IN TEAM</div>' : ''}
                    <div style="display: flex; gap: 8px; margin-top: 8px;">
                        ${upgradeAvailable ? `
                            <button class="btn ${canUpgrade ? 'btn-success' : ''}" style="flex: 1; font-size: 0.85rem;" onclick="InventoryScreen.upgradeCreature('${safeId}')" ${!canUpgrade ? 'disabled' : ''}>
                                ⬆️ ${upgradeCost}✨
                            </button>
                        ` : `
                            <button class="btn" style="flex: 1; font-size: 0.85rem;" disabled>MAX</button>
                        `}
                        <button class="btn btn-secondary" style="flex: 1; font-size: 0.85rem;" onclick="InventoryScreen.sellCreature('${safeId}')" ${isInTeam ? 'disabled' : ''}>
                            💰 ${sellPrice}
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    } else {
        html += '<p style="text-align: center; opacity: 0.6; margin-top: 48px;">No creatures in inventory. Visit the Shop!</p>';
    }
    
    // Quick Actions
    html += '<div class="section" style="margin-top: 32px; padding-top: 24px; border-top: 2px solid var(--border-color);">';
    html += '<h3>⚙️ Game Data</h3>';
    html += '<div style="display: flex; gap: 12px; flex-wrap: wrap;">';
    html += '<button class="btn btn-secondary" onclick="InventoryScreen.exportSave()">📤 Export Save</button>';
    html += '<button class="btn btn-secondary" onclick="InventoryScreen.importSave()">📥 Import Save</button>';
    html += '<button class="btn" style="background: #f44336;" onclick="InventoryScreen.resetGame()">🔄 Reset Game</button>';
    html += '</div></div>';
    
    html += '</div>';
    container.innerHTML = html;
}

const InventoryScreen = {
    currentFilter: 'all',
    currentSort: 'rarity',
    
    getSellPrice(creature) {
        const basePrice = {
            common: 10,
            uncommon: 30,
            rare: 80,
            epic: 200,
            legendary: 500
        };
        
        const levelMultiplier = [1, 1.5, 2.5, 4][creature.level];
        return Math.floor(basePrice[creature.rarity] * levelMultiplier);
    },
    
    sellCreature(creatureId) {
        const creature = gameState.state.collection.find(c => c.id === creatureId);
        if (!creature) {
            UIManager.showNotification('Creature not found!', 'error');
            return;
        }
        
        if (gameState.state.team.includes(creatureId)) {
            UIManager.showNotification('Cannot sell creature in team!', 'error');
            return;
        }
        
        const sellPrice = this.getSellPrice(creature);
        const shortId = creature.id.slice(-8);
        
        if (confirm(`Sell this ${creature.name} (Lv${creature.level}, ID: ${shortId}) for ${sellPrice} gold?\n\nThis will permanently remove this specific creature.`)) {
            const success = gameState.removeCreature(creatureId);
            
            if (success) {
                gameState.addResource('gold', sellPrice);
                UIManager.showNotification(`Sold for ${sellPrice} gold!`, 'success');
                updateResourceDisplay();
                loadInventoryScreen();
            } else {
                UIManager.showNotification('Failed to sell creature!', 'error');
            }
        }
    },
    
    upgradeCreature(creatureId) {
        if (gameState.upgradeCreature(creatureId)) {
            UIManager.showNotification('Creature upgraded!', 'success');
            updateResourceDisplay();
            loadInventoryScreen();
        } else {
            UIManager.showNotification('Cannot upgrade!', 'error');
        }
    },
    
    filterBy(rarity) {
        this.currentFilter = rarity;
        this.applyFiltersAndSort();
    },
    
    sortBy(criteria) {
        this.currentSort = criteria;
        this.applyFiltersAndSort();
    },
    
    applyFiltersAndSort() {
        const cards = Array.from(document.querySelectorAll('#inventory-grid .creature-card'));
        
        // Filter
        cards.forEach(card => {
            if (this.currentFilter === 'all') {
                card.style.display = '';
            } else {
                card.style.display = card.dataset.rarity === this.currentFilter ? '' : 'none';
            }
        });
        
        // Sort visible cards
        const visibleCards = cards.filter(c => c.style.display !== 'none');
        const grid = document.getElementById('inventory-grid');
        
        const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
        
        visibleCards.sort((a, b) => {
            if (this.currentSort === 'rarity') {
                return rarityOrder[b.dataset.rarity] - rarityOrder[a.dataset.rarity];
            } else if (this.currentSort === 'level') {
                return parseInt(b.dataset.level) - parseInt(a.dataset.level);
            } else if (this.currentSort === 'name') {
                return a.dataset.name.localeCompare(b.dataset.name);
            }
            return 0;
        });
        
        // Reorder DOM
        visibleCards.forEach(card => grid.appendChild(card));
    },
    
    exportSave() {
        const saveString = gameState.exportSave();
        
        const content = `
            <div style="text-align: center;">
                <p style="margin-bottom: 12px;">Copy this save code:</p>
                <textarea readonly style="width: 100%; height: 150px; padding: 8px; border-radius: 4px; background: var(--primary-bg); color: var(--text-primary); border: 2px solid var(--border-color); font-family: monospace; font-size: 0.85rem;">${saveString}</textarea>
                <button class="btn btn-success" style="margin-top: 12px; width: 100%;" onclick="navigator.clipboard.writeText('${saveString}'); UIManager.showNotification('Copied!', 'success')">
                    📋 Copy to Clipboard
                </button>
            </div>
        `;
        
        UIManager.showModal('Export Save', content, [
            { text: 'Close', class: 'btn-secondary', onclick: 'UIManager.hideModal()' }
        ]);
    },
    
    importSave() {
        const content = `
            <div style="text-align: center;">
                <p style="margin-bottom: 12px;">Paste your save code:</p>
                <textarea id="import-save-input" style="width: 100%; height: 150px; padding: 8px; border-radius: 4px; background: var(--primary-bg); color: var(--text-primary); border: 2px solid var(--border-color); font-family: monospace; font-size: 0.85rem;" placeholder="Paste save code..."></textarea>
                <button class="btn btn-success" style="margin-top: 12px; width: 100%;" onclick="InventoryScreen.doImport()">
                    Import
                </button>
                <p style="margin-top: 12px; font-size: 0.9rem; color: var(--highlight);">⚠️ This will overwrite your current save!</p>
            </div>
        `;
        
        UIManager.showModal('Import Save', content, [
            { text: 'Cancel', class: 'btn-secondary', onclick: 'UIManager.hideModal()' }
        ]);
    },
    
    doImport() {
        const input = document.getElementById('import-save-input');
        const saveString = input.value.trim();
        
        if (!saveString) {
            UIManager.showNotification('Paste a save code!', 'error');
            return;
        }
        
        if (gameState.importSave(saveString)) {
            UIManager.showNotification('Save imported!', 'success');
            UIManager.hideModal();
            updateResourceDisplay();
            loadScreen('team');
        } else {
            UIManager.showNotification('Invalid save code!', 'error');
        }
    },
    
    resetGame() {
        if (gameState.reset()) {
            UIManager.showNotification('Game reset!', 'info');
            updateResourceDisplay();
            loadScreen('team');
        }
    }
};
