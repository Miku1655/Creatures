// ========================================
// BATTLE SCREEN
// Visual battle interface
// ========================================

const BattleScreen = {
    currentContext: null,
    currentSpeed: '1x',
    
    startBattle(playerTeam, enemyTeam, context) {
        this.currentContext = context;
        this.currentSpeed = '1x';
        
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
        html += '<div style="text-align: center; margin-bottom: 16px; background: var(--accent-bg); padding: 12px; border-radius: 8px;">';
        html += `<h2 style="margin: 0;">${this.getBattleTitle()}</h2>`;
        html += `<div id="battle-turn-info" style="font-size: 1rem; opacity: 0.8; margin-top: 4px;">Turn 0 - Preparing...</div>`;
        html += '</div>';
        
        // Battle Field
        html += '<div class="battle-field" style="background: var(--secondary-bg); padding: 16px; border-radius: 12px; margin-bottom: 16px;">';
        
        // Enemy Team
        html += '<div style="margin-bottom: 24px;">';
        html += '<h3 style="text-align: center; color: var(--highlight); margin-bottom: 12px;">🔴 Enemy Team</h3>';
        html += '<div class="team-row enemy" id="enemy-field" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">';
        html += this.renderTeamSlots('enemy', 4);
        html += '</div></div>';
        
        // VS Divider
        html += '<div style="text-align: center; font-size: 1.5rem; font-weight: bold; margin: 16px 0; padding: 8px; background: var(--accent-bg); border-radius: 8px;">⚔️ VERSUS ⚔️</div>';
        
        // Player Team
        html += '<div>';
        html += '<h3 style="text-align: center; color: #4caf50; margin-bottom: 12px;">🟢 Your Team</h3>';
        html += '<div class="team-row player" id="player-field" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">';
        html += this.renderTeamSlots('player', 4);
        html += '</div></div>';
        
        html += '</div>';
        
        // Reserves Section
        html += '<div style="background: var(--accent-bg); padding: 16px; border-radius: 12px; margin-bottom: 16px;">';
        html += '<h4 style="text-align: center; margin-bottom: 12px;">📋 Reserves</h4>';
        html += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">';
        
        html += '<div>';
        html += '<div style="text-align: center; margin-bottom: 8px; opacity: 0.8; font-weight: bold;">Enemy</div>';
        html += '<div class="reserve-line" id="enemy-reserves" style="display: flex; gap: 8px; justify-content: center;">';
        html += this.renderReserveSlots('enemy', 4);
        html += '</div></div>';
        
        html += '<div>';
        html += '<div style="text-align: center; margin-bottom: 8px; opacity: 0.8; font-weight: bold;">Player</div>';
        html += '<div class="reserve-line" id="player-reserves" style="display: flex; gap: 8px; justify-content: center;">';
        html += this.renderReserveSlots('player', 4);
        html += '</div></div>';
        
        html += '</div></div>';
        
        // Battle Log
        html += '<div style="margin-bottom: 16px;">';
        html += '<h4>📜 Battle Log</h4>';
        html += '<div id="battle-log" style="background: var(--primary-bg); padding: 12px; border-radius: 8px; height: 120px; overflow-y: auto; font-size: 0.85rem; font-family: monospace;"></div>';
        html += '</div>';
        
        // Controls
        html += '<div class="battle-controls" style="display: flex; gap: 12px; align-items: center; justify-content: center; flex-wrap: wrap; background: var(--accent-bg); padding: 12px; border-radius: 8px;">';
        html += '<button id="mode-toggle-btn" class="btn btn-success" onclick="BattleScreen.toggleMode()">Mode: Auto</button>';
        html += '<button id="next-turn-btn" class="btn" onclick="BattleScreen.nextTurn()" style="display: none;">▶️ Next Turn</button>';
        html += '<div style="display: flex; gap: 4px; align-items: center;">';
        html += '<span style="opacity: 0.8; font-size: 0.9rem; margin-right: 4px;">Speed:</span>';
        html += '<button class="btn btn-secondary speed-btn" data-speed="1x" onclick="BattleScreen.setSpeed(\'1x\')">1x</button>';
        html += '<button class="btn btn-secondary speed-btn" data-speed="2x" onclick="BattleScreen.setSpeed(\'2x\')">2x</button>';
        html += '<button class="btn btn-secondary speed-btn" data-speed="4x" onclick="BattleScreen.setSpeed(\'4x\')">4x</button>';
        html += '</div>';
        html += '<button class="btn" style="background: #f44336;" onclick="BattleScreen.forfeit()">❌ Forfeit</button>';
        html += '</div>';
        
        html += '</div>';
        
        container.innerHTML = html;
        
        // Highlight current speed
        this.updateSpeedButtons();
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
                
                const isQueued = side === 'player' && battleEngine.isAbilityQueued(i);
                const canUseAbility = creature.active && creature.cooldowns.active === 0;
                
                // Cooldown/ability status indicator
                let abilityIndicator = '';
                if (creature.cooldowns.active > 0) {
                    abilityIndicator = `<div class="cooldown-indicator" style="position: absolute; top: 5px; right: 5px; background: #f44336; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${creature.cooldowns.active}</div>`;
                } else if (canUseAbility) {
                    abilityIndicator = `<div style="position: absolute; top: 5px; right: 5px; background: ${isQueued ? '#ff9800' : '#4caf50'}; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${isQueued ? '⏰' : '✓'}</div>`;
                }
                
                // Ability button for player in manual mode
                const abilityButton = side === 'player' && !battleEngine.autoMode && canUseAbility
                    ? `<button class="btn ${isQueued ? 'btn-warning' : 'btn-success'}" style="width: 100%; margin-top: 6px; padding: 6px 4px; font-size: 0.75rem; font-weight: bold;" onclick="BattleScreen.toggleAbility(${i})" title="${creature.active.name}">
                        ${isQueued ? '⏰ Queued' : '🔥 Queue Ability'}
                    </button>`
                    : '';
                
                slot.innerHTML = `
                    <div class="battle-creature-name" style="font-size: 0.85rem; font-weight: bold; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${creature.name}</div>
                    <div class="battle-creature-image" style="font-size: 2.5rem; margin: 4px 0;">${creature.emoji}</div>
                    <div class="battle-hp-bar" style="background: var(--primary-bg); height: 20px; border-radius: 10px; overflow: hidden; position: relative; margin: 4px 0;">
                        <div class="hp-fill" style="background: linear-gradient(90deg, #4caf50, #8bc34a); height: 100%; width: ${(creature.currentHp / creature.maxHp) * 100}%; transition: width 0.3s;"></div>
                        <div class="hp-text" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.75rem; font-weight: bold; text-shadow: 1px 1px 2px black;">${creature.currentHp}/${creature.maxHp}</div>
                    </div>
                    ${abilityIndicator}
                    ${abilityButton}
                `;
            } else {
                slot.classList.add('empty');
                slot.innerHTML = '<div style="opacity: 0.3; font-size: 2rem;">💀</div>';
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
                const completed = gameState.completeCampaignBattle(
                    this.currentContext.locationId,
                    this.currentContext.battleId,
                    this.currentContext.rewards
                );
                
                // Check if we unlocked a new location
                const battle = getBattle(this.currentContext.locationId, this.currentContext.battleId);
                if (battle && battle.unlocks) {
                    const unlockedLocation = getLocationById(battle.unlocks);
                    if (unlockedLocation) {
                        setTimeout(() => {
                            UIManager.showNotification(`🎉 New location unlocked: ${unlockedLocation.name}!`, 'success');
                        }, 1500);
                    }
                }
                
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
    
    toggleMode() {
        battleEngine.autoMode = !battleEngine.autoMode;
        const btn = document.getElementById('mode-toggle-btn');
        const nextBtn = document.getElementById('next-turn-btn');
        
        if (battleEngine.autoMode) {
            btn.textContent = 'Mode: Auto';
            btn.classList.add('btn-success');
            btn.classList.remove('btn-secondary');
            nextBtn.style.display = 'none';
            // Resume auto
            battleEngine.runAutoTurn();
        } else {
            btn.textContent = 'Mode: Manual';
            btn.classList.remove('btn-success');
            btn.classList.add('btn-secondary');
            nextBtn.style.display = '';
        }
        
        // Refresh to show/hide ability buttons
        if (battleEngine.battleState) {
            this.updateBattleDisplay(battleEngine.battleState);
        }
    },
    
    toggleAbility(creatureIndex) {
        if (battleEngine.autoMode) return;
        
        const success = battleEngine.queueAbility(creatureIndex);
        if (success) {
            this.updateBattleDisplay(battleEngine.battleState);
        }
    },
    
    nextTurn() {
        if (!battleEngine.autoMode) {
            battleEngine.executeNextTurn();
        }
    },
    
    setSpeed(speed) {
        this.currentSpeed = speed;
        battleEngine.setBattleSpeed(speed);
        this.updateSpeedButtons();
    },
    
    updateSpeedButtons() {
        document.querySelectorAll('.speed-btn').forEach(btn => {
            if (btn.dataset.speed === this.currentSpeed) {
                btn.classList.add('btn-success');
                btn.classList.remove('btn-secondary');
            } else {
                btn.classList.remove('btn-success');
                btn.classList.add('btn-secondary');
            }
        });
    },
    
    toggleSpeed() {
        // Legacy - now handled by setSpeed
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
