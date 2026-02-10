// ========================================
// TEAM SCREEN
// Manage your battle team
// ========================================

function loadTeamScreen() {
    const container = document.getElementById('screen-container');
    
    const team = gameState.getTeamCreatures();
    const collection = gameState.state.collection;
    
    let html = '<div class="screen team-screen">';
    html += '<h2>Your Battle Team</h2>';
    html += '<p class="screen-subtitle">Build your 8-creature team for battle</p>';
    
    // Current Team Section
    html += '<div class="section">';
    html += '<h3>Active Team (8 slots)</h3>';
    html += '<div class="team-slots card-grid">';
    
    for (let i = 0; i < 8; i++) {
        const creature = team[i];
        
        if (creature) {
            const creatureJson = JSON.stringify(creature).replace(/"/g, '&quot;');
            html += `
                <div class="creature-card ${creature.rarity}" onclick='CreatureManager.openCreatureDetails(${creatureJson})'>
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
                    <button class="btn btn-secondary" style="margin-top: 8px;" onclick="event.stopPropagation(); TeamScreen.removeFromTeam('${creature.id}')">Remove</button>
                </div>
            `;
        } else {
            html += `
                <div class="creature-card empty">
                    <div class="creature-image" style="font-size: 3rem; opacity: 0.3;">+</div>
                    <p style="opacity: 0.5;">Empty Slot</p>
                </div>
            `;
        }
    }
    
    html += '</div></div>';
    
    // Available Creatures - show all not in team (including duplicates of same base)
    const teamIds = team.map(c => c.id);
    const available = collection.filter(c => !teamIds.includes(c.id));
    
    html += '<div class="section" style="margin-top: 24px;">';
    html += '<h3>Available Creatures</h3>';
    html += `<p style="opacity: 0.8; font-size: 0.9rem; margin-bottom: 12px;">Click "Add" to add a creature to your team. You can add multiple of the same creature!</p>`;
    
    if (available.length > 0) {
        html += '<div class="card-grid">';
        
        available.forEach(creature => {
            const creatureJson = JSON.stringify(creature).replace(/"/g, '&quot;');
            const canAdd = team.length < 8;
            
            html += `
                <div class="creature-card ${creature.rarity}">
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
                    <div style="display: flex; gap: 8px; margin-top: 8px;">
                        <button class="btn ${canAdd ? 'btn-success' : ''}" style="flex: 1;" onclick="TeamScreen.addToTeam('${creature.id}')" ${!canAdd ? 'disabled' : ''}>
                            ${canAdd ? 'Add to Team' : 'Team Full'}
                        </button>
                        <button class="btn btn-secondary" style="flex: 1;" onclick='CreatureManager.openCreatureDetails(${creatureJson})'>View</button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    } else {
        html += '<p style="opacity: 0.6;">All creatures are in your team!</p>';
    }
    
    html += '</div></div>';
    container.innerHTML = html;
}

const TeamScreen = {
    addToTeam(creatureId) {
        if (gameState.addToTeam(creatureId)) {
            UIManager.showNotification('Added to team!', 'success');
            loadTeamScreen();
        }
    },
    
    removeFromTeam(creatureId) {
        if (gameState.removeFromTeam(creatureId)) {
            UIManager.showNotification('Removed from team', 'info');
            loadTeamScreen();
        }
    }
};
