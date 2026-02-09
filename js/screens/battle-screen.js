// ========================================
// BATTLE SCREEN
// Visual battle interface
// ========================================

const BattleScreen = {
    currentContext: null,
    
    startBattle(playerTeam, enemyTeam, context) {
        this.currentContext = context;
        
        // Show battle overlay
        const overlay = document.getElementById('battle-overlay');
        overlay.classList.remove('hidden');
        
        // Set up battle callbacks
        battleEngine.setCallbacks(
            (state) => this.updateBattleDisplay(state),
            (winner) => this.endBattle(winner)
        );
        
        // Start battle
        battleEngine.startBattle(playerTeam, enemyTeam, 'auto');
        
        this.renderBattleUI();
    },
    
    renderBattleUI() {
        const container = document.getElementById('battle-container');
        
        let html = '<div class="battle-ui">';
        
        // Battle Header
        html += '<div style="text-align: center; margin-bottom: 24px;">';
        html += `<h2>${this.getBattleTitle()}</h2>`;
        html += `<div id="battle-turn-info" style="font-size: 1.1rem; opacity: 0.8;">Turn 0</div>`;
        html += '</div>';
        
        // Battle Field
        html += '<div class="battle-field">';
        
        // Enemy Team
        html += '<div class="team-row enemy" id="enemy-field">';
        html += this.renderTeamSlots('enemy', 4);
        html += '</div>';
        
        // VS Divider
        html += '<div style="text-align: center; font-size: 2rem; font-weight: bold; margin: 16px 0;">⚔️ VS ⚔️</div>';
        
        // Player Team
        html += '<div class="team-row player" id="player-field">';
        html += this.renderTeamSlots('player', 4);
        html += '</div>';
        
        html += '</div>';
        
        // Reserves
        html += '<div style="margin-top: 24px;">';
        html += '<h4 style="text-align: center;">Reserves</h4>';
        html += '<div style="display: flex; gap: 32px; justify-content: center;">';
        
        html += '<div>';
        html += '<div style="text-align: center; margin-bottom: 8px; opacity: 0.8;">Enemy</div>';
        html += '<div class="reserve-line" id="enemy-reserves">';
        html += this.renderReserveSlots('enemy', 4);
        html += '</div></div>';
        
        html += '<div>';
        html += '<div style="text-align: center; margin-bottom: 8px; opacity: 0.8;">Player</div>';
        html += '<div class="reserve-line" id="player-reserves">';
        html += this.renderReserveSlots('player', 4);
        html += '</div></div>';
        
        html += '</div></div>';
        
        // Battle Log
        html += '<div style="margin-top: 24px;">';
        html += '<h4>Battle Log</h4>';
        html += '<div id="battle-log" style="background: var(--primary-bg); padding: 12px; border-radius: var(--radius-md); height: 150px; overflow-y: auto; font-size: 0.9rem; font-family: monospace;"></div>';
        html += '</div>';
        
        // Controls
        html += '<div class="battle-controls">';
        html += '<button class="btn btn-secondary" onclick="BattleScreen.toggleSpeed()">Speed: 1x</button>';
        html += '<button class="btn" style="background: #f44336;" onclick="BattleScreen.forfeit()">Forfeit</button>';
        html += '</div>';
        
        html += '</div>';
        
        container.innerHTML = html;
    },
    
    renderTeamSlots(side, count) {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `<div class="battle-slot empty" data-side="${side}" data-pos="${i}"></div>`;
        }
        return html;
    },
    
    renderReserveSlots(side, count) {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `<div class="reserve-slot empty" data-side="${side}" data-pos="${i}"></div>`;
        }
        return html;
    },
    
    updateBattleDisplay(state) {
        if (!state) return;
        
        // Update turn info
        const turnInfo = document.getElementById('battle-turn-info');
        if (turnInfo) {
            turnInfo.textContent = `Turn ${state.turn} - ${state.phase === 'player' ? 'Your' : 'Enemy'} Phase`;
        }
        
        // Update field
        this.updateField('player', state.player.field);
        this.updateField('enemy', state.enemy.field);
        
        // Update reserves
        this.updateReserves('player', state.player.reserves);
        this.updateReserves('enemy', state.enemy.reserves);
        
        // Update battle log
        this.updateBattleLog();
    },
    
    updateField(side, creatures) {
        const fieldContainer = document.getElementById(`${side}-field`);
        if (!fieldContainer) return;
        
        const slots = fieldContainer.querySelectorAll('.battle-slot');
        
        slots.forEach((slot, i) => {
            const creature = creatures[i];
            
            if (creature && creature.alive) {
                slot.classList.remove('empty');
                slot.innerHTML = `
                    <div class="battle-creature-name">${creature.name}</div>
                    <div class="battle-creature-image">${creature.emoji}</div>
                    <div class="battle-hp-bar">
                        <div class="hp-fill" style="width: ${(creature.currentHp / creature.maxHp) * 100}%"></div>
                        <div class="hp-text">${creature.currentHp}/${creature.maxHp}</div>
                    </div>
                    ${creature.cooldowns.active > 0 ? `<div class="cooldown-indicator">${creature.cooldowns.active}</div>` : ''}
                `;
            } else {
                slot.classList.add('empty');
                slot.innerHTML = '';
            }
        });
    },
    
    updateReserves(side, reserves) {
        const reserveContainer = document.getElementById(`${side}-reserves`);
        if (!reserveContainer) return;
        
        const slots = reserveContainer.querySelectorAll('.reserve-slot');
        
        slots.forEach((slot, i) => {
            const creature = reserves[i];
            
            if (creature) {
                slot.classList.remove('empty');
                slot.innerHTML = `
                    <div style="font-size: 1.5rem;">${creature.emoji}</div>
                    <div style="font-size: 0.7rem;">${creature.name}</div>
                `;
            } else {
                slot.classList.add('empty');
                slot.innerHTML = '';
            }
        });
    },
    
    updateBattleLog() {
        const logContainer = document.getElementById('battle-log');
        if (!logContainer) return;
        
        const logs = battleEngine.battleLog.slice(-10); // Last 10 entries
        logContainer.innerHTML = logs.map(log => `<div>${log}</div>`).join('');
        logContainer.scrollTop = logContainer.scrollHeight;
    },
    
    endBattle(winner) {
        const won = winner === 'player';
        
        // Handle rewards based on context
        if (this.currentContext.mode === 'campaign') {
            if (won) {
                gameState.completeCampaignBattle(
                    this.currentContext.locationId,
                    this.currentContext.battleId,
                    this.currentContext.rewards
                );
                
                UIManager.showNotification('Victory! Rewards collected!', 'success');
            }
        } else if (this.currentContext.mode === 'arena') {
            if (won) {
                gameState.updateArenaTier(this.currentContext.tier);
                gameState.updateArenaStreak(true);
                UIManager.showNotification(`Tier ${this.currentContext.tier} complete!`, 'success');
            } else {
                // Defeat - collect rewards and end run
                const rewards = calculateArenaRewards(
                    gameState.state.arena.currentTier,
                    gameState.state.arena.currentStreak
                );
                
                ResourceManager.addResources({
                    gold: rewards.gold,
                    dust: rewards.dust,
                    gems: rewards.gems
                });
                
                gameState.updateArenaStreak(false);
                gameState.state.arena.paidEntry = false;
                gameState.save();
                
                UIManager.showNotification(`Arena run ended! Collected: ${rewards.gold}💰 ${rewards.dust}✨ ${rewards.gems}💎`, 'info');
            }
        }
        
        // Record battle
        gameState.recordBattleResult(won);
        updateResourceDisplay();
        
        // Show result modal
        setTimeout(() => {
            const content = `
                <div style="text-align: center; padding: 24px;">
                    <h2 style="font-size: 3rem; margin-bottom: 16px;">
                        ${won ? '🏆 VICTORY! 🏆' : '💀 DEFEAT 💀'}
                    </h2>
                    <p style="font-size: 1.2rem;">
                        ${won ? 'Congratulations! You won the battle!' : 'Better luck next time!'}
                    </p>
                </div>
            `;
            
            UIManager.showModal(won ? 'Victory!' : 'Defeat', content, [
                {
                    text: 'Continue',
                    class: 'btn-success',
                    onclick: 'BattleScreen.closeBattle()'
                }
            ]);
        }, 1000);
    },
    
    closeBattle() {
        document.getElementById('battle-overlay').classList.add('hidden');
        UIManager.hideModal();
        
        // Return to appropriate screen
        if (this.currentContext.mode === 'campaign') {
            loadScreen('campaign');
        } else if (this.currentContext.mode === 'arena') {
            loadScreen('arena');
        }
    },
    
    toggleSpeed() {
        // Placeholder for speed toggle
        UIManager.showNotification('Speed toggle not yet implemented', 'info');
    },
    
    forfeit() {
        if (confirm('Are you sure you want to forfeit this battle?')) {
            battleEngine.endBattle('enemy');
        }
    },
    
    getBattleTitle() {
        if (this.currentContext.mode === 'campaign') {
            return '⚔️ Campaign Battle';
        } else if (this.currentContext.mode === 'arena') {
            return `⚔️ Arena - Tier ${this.currentContext.tier}`;
        }
        return '⚔️ Battle';
    }
};
