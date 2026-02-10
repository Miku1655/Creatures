// ========================================
// CREATURE MANAGER
// Handles creature operations
// ========================================

class CreatureManager {
    static openCreatureDetails(creature) {
        const upgradeAvailable = creature.level < 3;
        const upgradeCost = [50, 150, 400][creature.level];
        
        let content = `
            <div class="creature-details" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; max-width: 800px;">
                <!-- Left Side: Current Stats -->
                <div style="background: var(--accent-bg); padding: 20px; border-radius: var(--radius-lg); border: 3px solid var(--${creature.rarity});">
                    <div style="text-align: center; margin-bottom: 16px;">
                        <div style="font-size: 5rem;">${creature.emoji}</div>
                        <h3 style="margin: 8px 0;">${creature.name}</h3>
                        <div style="background: var(--${creature.rarity}); color: white; padding: 4px 12px; border-radius: 12px; display: inline-block; font-size: 0.9rem; text-transform: uppercase; font-weight: bold;">
                            ${creature.rarity}
                        </div>
                        <div style="margin-top: 8px; font-size: 1.2rem; font-weight: bold;">Level ${creature.level}</div>
                    </div>
                    
                    <div style="background: var(--secondary-bg); padding: 12px; border-radius: 8px; margin-bottom: 16px;">
                        <h4 style="margin-bottom: 8px;">Stats</h4>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                            <div style="text-align: center;">
                                <div style="font-size: 0.8rem; opacity: 0.8;">HP</div>
                                <div style="font-size: 1.3rem; font-weight: bold;">${creature.baseStats.hp}</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 0.8rem; opacity: 0.8;">DMG</div>
                                <div style="font-size: 1.3rem; font-weight: bold;">${creature.baseStats.dmg}</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 0.8rem; opacity: 0.8;">Shield</div>
                                <div style="font-size: 1.3rem; font-weight: bold;">${creature.baseStats.shield || 0}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: var(--secondary-bg); padding: 12px; border-radius: 8px;">
                        <h4 style="margin-bottom: 8px;">Abilities</h4>
                        ${creature.level === 0 ? `
                            <div style="opacity: 0.6; text-align: center; padding: 12px;">
                                <p>No abilities at Level 0</p>
                                <p style="font-size: 0.85rem; margin-top: 4px;">Upgrade to unlock abilities!</p>
                            </div>
                        ` : `
                            ${creature.passive ? `
                                <div style="margin-bottom: 12px;">
                                    <div style="font-weight: bold; color: var(--uncommon); margin-bottom: 4px;">
                                        ⚡ ${creature.passive.name}
                                    </div>
                                    <div style="font-size: 0.9rem; opacity: 0.9;">
                                        ${creature.passive.description}
                                    </div>
                                </div>
                            ` : ''}
                            ${creature.active ? `
                                <div>
                                    <div style="font-weight: bold; color: var(--rare); margin-bottom: 4px;">
                                        🔥 ${creature.active.name} <span style="opacity: 0.7; font-size: 0.85rem;">(CD: ${creature.active.cooldown})</span>
                                    </div>
                                    <div style="font-size: 0.9rem; opacity: 0.9;">
                                        ${creature.active.description}
                                    </div>
                                </div>
                            ` : ''}
                        `}
                    </div>
                </div>
                
                <!-- Right Side: Upgrade Path -->
                <div>
                    <h3 style="margin-bottom: 16px;">Upgrade Path</h3>
                    
                    ${this.renderUpgradeLevel(creature, 0, creature.level >= 0)}
                    ${this.renderUpgradeLevel(creature, 1, creature.level >= 1)}
                    ${this.renderUpgradeLevel(creature, 2, creature.level >= 2)}
                    ${this.renderUpgradeLevel(creature, 3, creature.level >= 3)}
                </div>
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
                text: `⬆️ Upgrade to Level ${creature.level + 1} (${upgradeCost} ✨)`,
                class: 'btn-success',
                onclick: `CreatureManager.upgradeCreature('${creature.id}')`
            });
        } else if (upgradeAvailable) {
            buttons.unshift({
                text: `Need ${upgradeCost} Dust to Upgrade`,
                class: 'btn',
                onclick: ''
            });
        }
        
        UIManager.showModal(creature.name, content, buttons);
    }
    
    static renderUpgradeLevel(creature, level, unlocked) {
        const upgrade = creature.upgrades ? creature.upgrades[`level${level}`] : null;
        const costs = [0, 50, 150, 400];
        const isCurrent = creature.level === level;
        
        return `
            <div style="background: ${unlocked ? 'var(--accent-bg)' : 'var(--primary-bg)'}; padding: 16px; border-radius: 8px; margin-bottom: 12px; opacity: ${unlocked ? '1' : '0.5'}; border: 2px solid ${isCurrent ? 'var(--highlight)' : 'var(--border-color)'};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <h4 style="margin: 0;">Level ${level} ${isCurrent ? '(Current)' : ''} ${!unlocked ? '🔒' : ''}</h4>
                    ${level > 0 ? `<span style="font-size: 0.9rem; opacity: 0.8;">${costs[level]} ✨</span>` : ''}
                </div>
                
                ${level === 0 ? `
                    <div style="font-size: 0.9rem; opacity: 0.8;">
                        <div>HP: ${creature.baseStats.hp}</div>
                        <div>DMG: ${creature.baseStats.dmg}</div>
                        <div>Shield: ${creature.baseStats.shield || 0}</div>
                        <div style="margin-top: 8px; font-style: italic; opacity: 0.6;">No abilities</div>
                    </div>
                ` : upgrade ? `
                    <div style="font-size: 0.9rem;">
                        <div style="font-weight: bold; margin-bottom: 4px;">📈 Stats:</div>
                        <div style="opacity: 0.9;">HP: ${upgrade.hp} | DMG: ${upgrade.dmg}</div>
                        
                        ${upgrade.passiveBonus ? `
                            <div style="margin-top: 8px;">
                                <div style="font-weight: bold; color: var(--uncommon);">⚡ Passive:</div>
                                <div style="opacity: 0.9;">${upgrade.passiveBonus}</div>
                            </div>
                        ` : ''}
                        
                        ${upgrade.activeBonus ? `
                            <div style="margin-top: 8px;">
                                <div style="font-weight: bold; color: var(--rare);">🔥 Active:</div>
                                <div style="opacity: 0.9;">${upgrade.activeBonus}</div>
                            </div>
                        ` : ''}
                        
                        ${upgrade.specialBonus ? `
                            <div style="margin-top: 8px;">
                                <div style="font-weight: bold; color: var(--legendary);">✨ Special:</div>
                                <div style="opacity: 0.9;">${upgrade.specialBonus}</div>
                            </div>
                        ` : ''}
                    </div>
                ` : `
                    <div style="opacity: 0.6; font-style: italic;">Upgrade details not available</div>
                `}
            </div>
        `;
    }
    
    static upgradeCreature(creatureId) {
        if (gameState.upgradeCreature(creatureId)) {
            UIManager.showNotification('Creature upgraded!', 'success');
            UIManager.hideModal();
            
            if (window.gameAPI) {
                window.gameAPI.updateResourceDisplay();
                // Reload current screen
                const activeNav = document.querySelector('.nav-btn.active');
                if (activeNav) {
                    loadScreen(activeNav.dataset.screen);
                }
            }
        } else {
            UIManager.showNotification('Upgrade failed!', 'error');
        }
    }
}
