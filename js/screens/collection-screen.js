// ========================================
// COLLECTION SCREEN
// Bestiary - Discovery log of all creatures
// ========================================

function loadCollectionScreen() {
    const container = document.getElementById('screen-container');
    
    const ownedCreatures = gameState.state.collection;
    const discoveredBaseIds = gameState.state.discoveredCreatures || [];
    const totalCreatures = CREATURES_DATA.length;
    
    let html = '<div class="screen collection-screen">';
    html += '<h2>Bestiary</h2>';
    html += `<p class="screen-subtitle">Discovered: ${discoveredBaseIds.length} / ${totalCreatures} creatures</p>`;
    
    // Progress bar
    const percentage = (discoveredBaseIds.length / totalCreatures) * 100;
    html += `
        <div style="background: var(--accent-bg); padding: 16px; border-radius: var(--radius-md); margin-bottom: 24px;">
            <div style="background: var(--primary-bg); height: 30px; border-radius: var(--radius-sm); overflow: hidden; position: relative;">
                <div style="background: linear-gradient(90deg, var(--highlight), var(--uncommon)); height: 100%; width: ${percentage}%; transition: width 0.5s;"></div>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: bold; text-shadow: 1px 1px 2px black;">
                    ${Math.floor(percentage)}% Complete
                </div>
            </div>
        </div>
    `;
    
    // Filter by location
    const locations = [...new Set(CREATURES_DATA.map(c => c.location))];
    
    html += `
        <div style="margin-bottom: 16px; display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="CollectionScreen.filterByLocation('all')">All</button>
    `;
    
    locations.forEach(loc => {
        const locationData = getLocationById(loc);
        html += `<button class="btn btn-secondary" onclick="CollectionScreen.filterByLocation('${loc}')">${locationData?.emoji || ''} ${locationData?.name || loc}</button>`;
    });
    
    html += '</div>';
    
    // Show all creatures from database
    html += '<div class="card-grid">';
    
    CREATURES_DATA.forEach(baseCreature => {
        const discovered = discoveredBaseIds.includes(baseCreature.id);
        const owned = ownedCreatures.filter(c => c.baseId === baseCreature.id).length;
        
        html += `
            <div class="creature-card ${discovered ? baseCreature.rarity : 'unknown'}" data-location="${baseCreature.location}" style="${!discovered ? 'opacity: 0.5; filter: brightness(0.4);' : ''}">
                <div class="creature-header">
                    <span class="creature-name">${discovered ? baseCreature.name : '???'}</span>
                    ${discovered ? `<span class="creature-level">Owned: ${owned}</span>` : '<span>🔒</span>'}
                </div>
                <div class="creature-image">${discovered ? baseCreature.emoji : '❓'}</div>
                ${discovered ? `
                    <div class="creature-stats">
                        <div class="stat">
                            <div class="stat-label">HP</div>
                            <div class="stat-value">${baseCreature.baseStats.hp}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">DMG</div>
                            <div class="stat-value">${baseCreature.baseStats.dmg}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">Shield</div>
                            <div class="stat-value">${baseCreature.baseStats.shield || 0}</div>
                        </div>
                    </div>
                    <div class="creature-abilities">
                        <div class="ability">
                            <span class="ability-name">${baseCreature.passive.name}:</span>
                            ${baseCreature.passive.description}
                        </div>
                        ${baseCreature.active ? `
                            <div class="ability">
                                <span class="ability-name">${baseCreature.active.name}:</span>
                                ${baseCreature.active.description}
                            </div>
                        ` : ''}
                    </div>
                ` : `
                    <div style="text-align: center; padding: 24px; opacity: 0.6;">
                        <p>Not yet discovered</p>
                        <p style="font-size: 0.8rem;">Find in ${getLocationById(baseCreature.location)?.name || 'unknown'}</p>
                    </div>
                `}
            </div>
        `;
    });
    
    html += '</div>';
    html += '</div>';
    container.innerHTML = html;
}

const CollectionScreen = {
    filterByLocation(location) {
        const cards = document.querySelectorAll('.creature-card');
        cards.forEach(card => {
            if (location === 'all') {
                card.style.display = '';
            } else {
                card.style.display = card.dataset.location === location ? '' : 'none';
            }
        });
    }
};
