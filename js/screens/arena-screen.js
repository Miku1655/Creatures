// ========================================
// ARENA SCREEN
// Endless tier progression battles
// ========================================

function loadArenaScreen() {
    const container = document.getElementById('screen-container');
    
    const arena = gameState.state.arena;
    
    let html = '<div class="screen arena-screen">';
    html += '<h2>⚔️ Eternal Arena</h2>';
    html += '<p class="screen-subtitle">Climb the endless ladder and prove your worth</p>';
    
    // Stats Section
    html += '<div class="section">';
    html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">';
    
    html += `
        <div style="background: var(--accent-bg); padding: 16px; border-radius: var(--radius-md); text-align: center;">
            <div style="font-size: 2rem; color: var(--highlight);">🏆</div>
            <div style="font-size: 0.9rem; opacity: 0.8;">Current Tier</div>
            <div style="font-size: 1.5rem; font-weight: bold;">${arena.currentTier}</div>
        </div>
        <div style="background: var(--accent-bg); padding: 16px; border-radius: var(--radius-md); text-align: center;">
            <div style="font-size: 2rem; color: var(--highlight);">⭐</div>
            <div style="font-size: 0.9rem; opacity: 0.8;">Highest Tier</div>
            <div style="font-size: 1.5rem; font-weight: bold;">${arena.highestTier}</div>
        </div>
        <div style="background: var(--accent-bg); padding: 16px; border-radius: var(--radius-md); text-align: center;">
            <div style="font-size: 2rem; color: var(--highlight);">🔥</div>
            <div style="font-size: 0.9rem; opacity: 0.8;">Current Streak</div>
            <div style="font-size: 1.5rem; font-weight: bold;">${arena.currentStreak}</div>
        </div>
        <div style="background: var(--accent-bg); padding: 16px; border-radius: var(--radius-md); text-align: center;">
            <div style="font-size: 2rem; color: var(--highlight);">💥</div>
            <div style="font-size: 0.9rem; opacity: 0.8;">Best Streak</div>
            <div style="font-size: 1.5rem; font-weight: bold;">${arena.bestStreak}</div>
        </div>
    `;
    
    html += '</div></div>';
    
    // Entry Section
    html += '<div class="section" style="margin-top: 24px;">';
    
    if (!arena.paidEntry) {
        html += `
            <div style="background: var(--secondary-bg); padding: 24px; border-radius: var(--radius-lg); border: 2px solid var(--highlight); max-width: 600px; margin: 0 auto;">
                <h3>Enter the Arena</h3>
                <p style="opacity: 0.8; margin-bottom: 16px;">
                    Pay the entry fee to start climbing the arena ladder. Battle through endless tiers for greater rewards!
                </p>
                <div style="background: var(--accent-bg); padding: 12px; border-radius: var(--radius-md); margin-bottom: 16px;">
                    <div style="font-weight: bold; margin-bottom: 8px;">How it works:</div>
                    <ul style="margin-left: 20px; opacity: 0.9;">
                        <li>Win battles to climb tiers</li>
                        <li>Lose a battle to end your run</li>
                        <li>Collect rewards based on highest tier reached</li>
                        <li>Longer win streaks = bigger bonuses!</li>
                    </ul>
                </div>
                <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 16px;">
                    Entry Fee: ${ARENA_DATA.entryFee.gold}💰
                </div>
                <button class="btn btn-success" style="width: 100%;" onclick="ArenaScreen.enterArena()">
                    Pay Entry Fee & Enter Arena
                </button>
            </div>
        `;
    } else {
        const nextTier = arena.currentTier + 1;
        const isBoss = ARENA_DATA.isBossTier(nextTier);
        
        html += `
            <div style="background: var(--secondary-bg); padding: 24px; border-radius: var(--radius-lg); border: 2px solid var(--highlight); max-width: 600px; margin: 0 auto;">
                <h3>Next Battle - Tier ${nextTier} ${isBoss ? '👑 BOSS' : ''}</h3>
                <p style="opacity: 0.8; margin-bottom: 16px;">
                    ${isBoss ? 'This is a boss tier! Expect a tougher challenge with greater rewards.' : 'Continue your climb through the arena.'}
                </p>
                
                <div style="background: var(--accent-bg); padding: 12px; border-radius: var(--radius-md); margin-bottom: 16px;">
                    <div style="font-weight: bold; margin-bottom: 8px;">Potential Rewards (if you lose):</div>
                    <div style="opacity: 0.9;">
                        ${ArenaScreen.formatRewards(calculateArenaRewards(nextTier, arena.currentStreak))}
                    </div>
                </div>
                
                ${arena.currentStreak >= 3 ? `
                    <div style="background: linear-gradient(90deg, var(--highlight), var(--accent-bg)); padding: 12px; border-radius: var(--radius-md); margin-bottom: 16px;">
                        <div style="font-weight: bold;">🔥 Streak Bonus Active!</div>
                        <div style="opacity: 0.9;">Win streak: ${arena.currentStreak} battles</div>
                    </div>
                ` : ''}
                
                <button class="btn btn-success" style="width: 100%; font-size: 1.1rem;" onclick="ArenaScreen.startBattle(${nextTier})">
                    Start Battle
                </button>
                
                <button class="btn btn-secondary" style="width: 100%; margin-top: 12px;" onclick="ArenaScreen.forfeit()">
                    Forfeit & Collect Rewards
                </button>
            </div>
        `;
    }
    
    html += '</div>';
    
    // Milestones
    html += '<div class="section" style="margin-top: 24px;">';
    html += '<h3>🎯 Milestones</h3>';
    html += '<div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px;">';
    
    ARENA_DATA.milestones.forEach(milestone => {
        const achieved = arena.highestTier >= milestone.tier;
        html += `
            <div style="min-width: 200px; background: var(--accent-bg); padding: 12px; border-radius: var(--radius-md); border: 2px solid ${achieved ? '#4caf50' : 'var(--border-color)'}; opacity: ${achieved ? 1 : 0.6};">
                <div style="font-weight: bold; margin-bottom: 4px;">${achieved ? '✓' : '🔒'} ${milestone.name}</div>
                <div style="font-size: 0.9rem; opacity: 0.8;">Tier ${milestone.tier}</div>
                <div style="font-size: 0.85rem; margin-top: 8px;">
                    ${milestone.rewards.gold}💰 ${milestone.rewards.dust}✨ ${milestone.rewards.gems}💎
                </div>
            </div>
        `;
    });
    
    html += '</div></div>';
    
    html += '</div>';
    container.innerHTML = html;
}

const ArenaScreen = {
    enterArena() {
        if (!gameState.canAfford(ARENA_DATA.entryFee)) {
            UIManager.showNotification('Cannot afford entry fee!', 'error');
            return;
        }
        
        ResourceManager.removeResources(ARENA_DATA.entryFee);
        gameState.state.arena.paidEntry = true;
        gameState.state.arena.currentTier = 0;
        gameState.state.arena.currentStreak = 0;
        gameState.save();
        
        UIManager.showNotification('Welcome to the Arena!', 'success');
        updateResourceDisplay();
        loadArenaScreen();
    },
    
    startBattle(tier) {
        const playerTeam = gameState.getTeamCreatures();
        
        if (playerTeam.length === 0) {
            UIManager.showNotification('You need creatures in your team!', 'error');
            return;
        }
        
        // Generate enemy team
        const isBoss = ARENA_DATA.isBossTier(tier);
        const enemyTeam = isBoss 
            ? ARENA_DATA.generateBossTeam(tier)
            : ARENA_DATA.generateEnemyTeam(tier);
        
        BattleScreen.startBattle(playerTeam, enemyTeam, {
            mode: 'arena',
            tier: tier,
            isBoss: isBoss
        });
    },
    
    forfeit() {
        if (!confirm('Are you sure you want to forfeit and collect your rewards?')) {
            return;
        }
        
        const rewards = calculateArenaRewards(gameState.state.arena.currentTier, gameState.state.arena.currentStreak);
        
        ResourceManager.addResources({
            gold: rewards.gold,
            dust: rewards.dust,
            gems: rewards.gems
        });
        
        // Reset arena
        gameState.state.arena.paidEntry = false;
        gameState.state.arena.currentTier = 0;
        gameState.state.arena.currentStreak = 0;
        gameState.save();
        
        UIManager.showNotification(`Collected rewards: ${rewards.gold}💰 ${rewards.dust}✨ ${rewards.gems}💎`, 'success');
        updateResourceDisplay();
        loadArenaScreen();
    },
    
    formatRewards(rewards) {
        let text = `${rewards.gold} Gold, ${rewards.dust} Dust, ${rewards.gems} Gems`;
        if (rewards.streakBonus) {
            text += ` (${rewards.streakBonus}x streak bonus!)`;
        }
        return text;
    }
};
