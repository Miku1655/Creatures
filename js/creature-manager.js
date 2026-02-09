// ========================================
// CREATURE MANAGER
// Handles creature operations
// ========================================

class CreatureManager {
    static openCreatureDetails(creature) {
        const upgradeAvailable = creature.level < 3;
        const upgradeCost = [50, 150, 400][creature.level];
        
        let content = `
            <div class="creature-details">
                <div class="creature-image-large">${creature.emoji}</div>
                <h3>${creature.name}</h3>
                <div class="rarity-badge ${creature.rarity}">${creature.rarity.toUpperCase()}</div>
                
                <div class="stats-display">
                    <div class="stat"><strong>HP:</strong> ${creature.baseStats.hp}</div>
                    <div class="stat"><strong>DMG:</strong> ${creature.baseStats.dmg}</div>
                    <div class="stat"><strong>Shield:</strong> ${creature.baseStats.shield || 0}</div>
                </div>
                
                <div class="abilities-display">
                    <h4>Passive: ${creature.passive.name}</h4>
                    <p>${creature.passive.description}</p>
                    
                    ${creature.active ? `
                        <h4>Active: ${creature.active.name} (CD: ${creature.active.cooldown})</h4>
                        <p>${creature.active.description}</p>
                    ` : ''}
                </div>
                
                ${upgradeAvailable ? `
                    <div class="upgrade-info">
                        <h4>Next Upgrade (Level ${creature.level + 1})</h4>
                        <p>Cost: ${upgradeCost} Dust ✨</p>
                    </div>
                ` : '<p class="max-level">MAX LEVEL</p>'}
            </div>
        `;
        
        const buttons = [
            {
                text: 'Close',
                class: 'btn-secondary',
                onclick: 'UIManager.hideModal()'
            }
        ];
        
        if (upgradeAvailable && gameState.state.resources.dust >= upgradeCost) {
            buttons.unshift({
                text: `Upgrade (${upgradeCost} ✨)`,
                class: 'btn-success',
                onclick: `CreatureManager.upgradeCreature('${creature.id}')`
            });
        }
        
        UIManager.showModal(creature.name, content, buttons);
    }
    
    static upgradeCreature(creatureId) {
        if (gameState.upgradeCreature(creatureId)) {
            UIManager.showNotification('Creature upgraded!', 'success');
            UIManager.hideModal();
            
            if (window.gameAPI) {
                window.gameAPI.updateResourceDisplay();
                window.gameAPI.loadScreen('collection'); // Refresh
            }
        } else {
            UIManager.showNotification('Upgrade failed!', 'error');
        }
    }
}
