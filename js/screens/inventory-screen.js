// ========================================
// INVENTORY SCREEN
// Manage duplicates and resources
// ========================================

function loadInventoryScreen() {
    const container = document.getElementById('screen-container');
    
    const collection = gameState.state.collection;
    const resources = gameState.state.resources;
    
    let html = '<div class="screen inventory-screen">';
    html += '<h2>Inventory</h2>';
    html += '<p class="screen-subtitle">Manage your creatures and resources</p>';
    
    // Resources Summary
    html += '<div class="section">';
    html += '<h3>💰 Resources</h3>';
    html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">';
    
    html += `
        <div style="background: var(--accent-bg); padding: 16px; border-radius: var(--radius-md); text-align: center; border: 2px solid var(--gold);">
            <div style="font-size: 2rem;">💰</div>
            <div style="font-size: 0.9rem; opacity: 0.8;">Gold</div>
            <div style="font-size: 1.5rem; font-weight: bold; color: var(--gold);">${resources.gold}</div>
        </div>
        <div style="background: var(--accent-bg); padding: 16px; border-radius: var(--radius-md); text-align: center; border: 2px solid var(--gems);">
            <div style="font-size: 2rem;">💎</div>
            <div style="font-size: 0.9rem; opacity: 0.8;">Gems</div>
            <div style="font-size: 1.5rem; font-weight: bold; color: var(--gems);">${resources.gems}</div>
        </div>
        <div style="background: var(--accent-bg); padding: 16px; border-radius: var(--radius-md); text-align: center; border: 2px solid var(--dust);">
            <div style="font-size: 2rem;">✨</div>
            <div style="font-size: 0.9rem; opacity: 0.8;">Dust</div>
            <div style="font-size: 1.5rem; font-weight: bold; color: var(--dust);">${resources.dust}</div>
        </div>
    `;
    
    html += '</div></div>';
    
    // Creature Count by Rarity
    html += '<div class="section" style="margin-top: 24px;">';
    html += '<h3>📊 Collection Statistics</h3>';
    
    const rarityCounts = {
        common: collection.filter(c => c.rarity === 'common').length,
        uncommon: collection.filter(c => c.rarity === 'uncommon').length,
        rare: collection.filter(c => c.rarity === 'rare').length,
        epic: collection.filter(c => c.rarity === 'epic').length,
        legendary: collection.filter(c => c.rarity === 'legendary').length
    };
    
    html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">';
    
    Object.entries(rarityCounts).forEach(([rarity, count]) => {
        html += `
            <div style="background: var(--accent-bg); padding: 12px; border-radius: var(--radius-md); text-align: center; border: 2px solid var(--${rarity});">
                <div style="font-size: 0.9rem; opacity: 0.8; text-transform: capitalize;">${rarity}</div>
                <div style="font-size: 1.3rem; font-weight: bold;">${count}</div>
            </div>
        `;
    });
    
    html += '</div></div>';
    
    // Duplicate Creatures (for selling)
    html += '<div class="section" style="margin-top: 24px;">';
    html += '<h3>🔄 Manage Duplicates</h3>';
    html += '<p style="opacity: 0.8; margin-bottom: 12px;">Sell duplicate creatures for gold</p>';
    
    // Find duplicates
    const creaturesByBase = {};
    collection.forEach(creature => {
        if (!creaturesByBase[creature.baseId]) {
            creaturesByBase[creature.baseId] = [];
        }
        creaturesByBase[creature.baseId].push(creature);
    });
    
    const duplicates = Object.values(creaturesByBase).filter(group => group.length > 1);
    
    if (duplicates.length > 0) {
        html += '<div class="list-container">';
        
        duplicates.forEach(group => {
            const baseCreature = group[0];
            html += `
                <div style="background: var(--accent-bg); padding: 16px; border-radius: var(--radius-md); border: 2px solid var(--${baseCreature.rarity});">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="font-size: 2rem;">${baseCreature.emoji}</div>
                            <div>
                                <div style="font-weight: bold;">${baseCreature.name}</div>
                                <div style="font-size: 0.9rem; opacity: 0.8;">${group.length} owned</div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 0.9rem; opacity: 0.8;">Sell for:</div>
                            <div style="font-weight: bold; color: var(--gold);">${InventoryScreen.getSellPrice(baseCreature)} Gold each</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap;">
            `;
            
            group.forEach(creature => {
                const isInTeam = gameState.state.team.includes(creature.id);
                html += `
                    <button class="btn btn-secondary" style="flex: 1; min-width: 120px;" onclick="InventoryScreen.sellCreature('${creature.id}')" ${isInTeam ? 'disabled' : ''}>
                        ${isInTeam ? 'In Team' : `Sell Lv${creature.level}`}
                    </button>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    } else {
        html += '<p style="opacity: 0.6; text-align: center; margin-top: 24px;">No duplicate creatures found.</p>';
    }
    
    html += '</div>';
    
    // Quick Actions
    html += '<div class="section" style="margin-top: 24px;">';
    html += '<h3>⚙️ Quick Actions</h3>';
    html += '<div style="display: flex; gap: 12px; flex-wrap: wrap;">';
    html += '<button class="btn btn-secondary" onclick="InventoryScreen.exportSave()">Export Save</button>';
    html += '<button class="btn btn-secondary" onclick="InventoryScreen.importSave()">Import Save</button>';
    html += '<button class="btn" style="background: #f44336;" onclick="InventoryScreen.resetGame()">Reset Game</button>';
    html += '</div></div>';
    
    html += '</div>';
    container.innerHTML = html;
}

const InventoryScreen = {
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
        if (!creature) return;
        
        const sellPrice = this.getSellPrice(creature);
        
        if (confirm(`Sell ${creature.name} (Lv${creature.level}) for ${sellPrice} gold?`)) {
            gameState.removeCreature(creatureId);
            gameState.addResource('gold', sellPrice);
            
            UIManager.showNotification(`Sold for ${sellPrice} gold!`, 'success');
            updateResourceDisplay();
            loadInventoryScreen();
        }
    },
    
    exportSave() {
        const saveString = gameState.exportSave();
        
        const content = `
            <div style="text-align: center;">
                <p style="margin-bottom: 12px;">Copy this save code and keep it safe:</p>
                <textarea readonly style="width: 100%; height: 150px; padding: 8px; border-radius: 4px; background: var(--primary-bg); color: var(--text-primary); border: 2px solid var(--border-color);">${saveString}</textarea>
                <button class="btn btn-success" style="margin-top: 12px; width: 100%;" onclick="navigator.clipboard.writeText('${saveString}'); UIManager.showNotification('Copied to clipboard!', 'success')">
                    Copy to Clipboard
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
                <p style="margin-bottom: 12px;">Paste your save code below:</p>
                <textarea id="import-save-input" style="width: 100%; height: 150px; padding: 8px; border-radius: 4px; background: var(--primary-bg); color: var(--text-primary); border: 2px solid var(--border-color);" placeholder="Paste save code here..."></textarea>
                <button class="btn btn-success" style="margin-top: 12px; width: 100%;" onclick="InventoryScreen.doImport()">
                    Import Save
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
            UIManager.showNotification('Please paste a save code!', 'error');
            return;
        }
        
        if (gameState.importSave(saveString)) {
            UIManager.showNotification('Save imported successfully!', 'success');
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
