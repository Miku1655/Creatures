// ========================================
// CAMPAIGN SCREEN
// Play through story campaigns
// ========================================

function loadCampaignScreen() {
    const container = document.getElementById('screen-container');
    
    const unlockedLocations = getUnlockedLocations(gameState.state);
    
    let html = '<div class="screen campaign-screen">';
    html += '<h2>Campaign</h2>';
    html += '<p class="screen-subtitle">Embark on adventures across different realms</p>';
    
    unlockedLocations.forEach(location => {
        const campaign = getCampaignByLocation(location.id);
        
        if (campaign && campaign.length > 0) {
            html += `
                <div class="location-section" style="margin-bottom: 32px; padding: 16px; background: var(--secondary-bg); border-radius: var(--radius-lg); border: 2px solid ${location.theme.accent};">
                    <h3>${location.emoji} ${location.name}</h3>
                    <p style="opacity: 0.8; margin-bottom: 16px;">${location.description}</p>
                    
                    <div class="chapters-list">
            `;
            
            campaign.forEach(chapter => {
                const chapterCompleted = gameState.state.campaign[location.id]?.completed || [];
                const allBattlesCompleted = chapter.battles.every(b => chapterCompleted.includes(b.id));
                
                html += `
                    <div class="chapter-card" style="background: var(--accent-bg); padding: 16px; border-radius: var(--radius-md); margin-bottom: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h4>Chapter ${chapter.chapter}: ${chapter.name}</h4>
                                <p style="opacity: 0.8;">${chapter.description}</p>
                            </div>
                            ${allBattlesCompleted ? '<span style="color: #4caf50; font-weight: bold;">✓ COMPLETED</span>' : ''}
                        </div>
                        
                        <div class="battles-list" style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
                `;
                
                chapter.battles.forEach((battle, index) => {
                    const completed = chapterCompleted.includes(battle.id);
                    const canPlay = index === 0 || chapterCompleted.includes(chapter.battles[index - 1].id);
                    
                    html += `
                        <div class="battle-card" style="flex: 1; min-width: 200px; background: var(--primary-bg); padding: 12px; border-radius: var(--radius-sm); border: 2px solid ${completed ? '#4caf50' : 'var(--border-color)'};">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <strong>${battle.name}</strong>
                                ${battle.boss ? '<span style="color: var(--highlight);">👑 BOSS</span>' : ''}
                            </div>
                            <div style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 8px;">
                                Difficulty: ${'⭐'.repeat(battle.difficulty)}
                            </div>
                            <div style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 12px;">
                                Enemies: ${battle.enemyTeam.length}
                            </div>
                            <div style="font-size: 0.85rem; opacity: 0.7; margin-bottom: 8px;">
                                Rewards: ${battle.rewards.gold}💰 ${battle.rewards.dust}✨ ${battle.rewards.gems || 0}💎
                            </div>
                            ${canPlay ? `
                                <button class="btn ${completed ? 'btn-secondary' : 'btn-success'}" style="width: 100%;" onclick="CampaignScreen.startBattle('${location.id}', '${battle.id}')">
                                    ${completed ? 'Replay' : 'Start Battle'}
                                </button>
                            ` : `
                                <button class="btn" disabled style="width: 100%; opacity: 0.5;">Locked</button>
                            `}
                        </div>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
    });
    
    // Show next locked location
    const nextLocked = getNextLockedLocation(gameState.state);
    if (nextLocked) {
        html += `
            <div class="locked-location" style="padding: 16px; background: var(--accent-bg); border-radius: var(--radius-lg); opacity: 0.6;">
                <h3>🔒 ${nextLocked.emoji} ${nextLocked.name}</h3>
                <p>${nextLocked.unlockRequirement.message}</p>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

const CampaignScreen = {
    startBattle(locationId, battleId) {
        const battle = getBattle(locationId, battleId);
        if (!battle) return;
        
        const playerTeam = gameState.getTeamCreatures();
        
        if (playerTeam.length === 0) {
            UIManager.showNotification('You need creatures in your team!', 'error');
            return;
        }
        
        // Create enemy team
        const enemyTeam = battle.enemyTeam.map(creatureId => {
            const baseCreature = getCreatureById(creatureId);
            return { ...baseCreature, level: 0 };
        });
        
        // Start battle
        BattleScreen.startBattle(playerTeam, enemyTeam, {
            mode: 'campaign',
            locationId: locationId,
            battleId: battleId,
            rewards: battle.rewards
        });
    }
};
