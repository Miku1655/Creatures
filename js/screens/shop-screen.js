// ========================================
// SHOP SCREEN
// Purchase creatures and resources
// ========================================

function loadShopScreen() {
    const container = document.getElementById('screen-container');
    
    let html = '<div class="screen shop-screen">';
    html += '<h2>Shop</h2>';
    html += '<p class="screen-subtitle">Purchase creature packs and resources</p>';
    
    // Daily Free Pack
    html += '<div class="section">';
    html += '<h3>🎁 Daily Free</h3>';
    
    const canClaim = canClaimFreeDaily(gameState.state);
    html += `
        <div style="padding: 16px; background: var(--accent-bg); border-radius: var(--radius-md); max-width: 400px;">
            <h4>Daily Free Pack</h4>
            <p style="opacity: 0.8;">2 random creatures • Resets every 24 hours</p>
            <button class="btn btn-success" style="margin-top: 12px; width: 100%;" onclick="ShopScreen.claimFreeDaily()" ${!canClaim ? 'disabled' : ''}>
                ${canClaim ? 'Claim Free Pack' : 'Come Back Tomorrow'}
            </button>
        </div>
    `;
    html += '</div>';
    
    // Creature Packs
    html += '<div class="section" style="margin-top: 24px;">';
    html += '<h3>📦 Creature Packs</h3>';
    html += '<div class="card-grid">';
    
    SHOP_DATA.packs.forEach(pack => {
        const canAfford = gameState.canAfford(pack.cost);
        const costText = ResourceManager.formatCost(pack.cost);
        
        html += `
            <div class="shop-pack-card" style="background: var(--secondary-bg); padding: 16px; border-radius: var(--radius-lg); border: 2px solid var(--border-color);">
                <div style="font-size: 3rem; text-align: center; margin-bottom: 8px;">${pack.emoji}</div>
                <h4>${pack.name}</h4>
                <p style="opacity: 0.8; font-size: 0.9rem; margin-bottom: 12px;">${pack.description}</p>
                <div style="font-size: 0.85rem; opacity: 0.7; margin-bottom: 12px;">
                    ${pack.contents.creatures} creatures
                    ${pack.contents.guaranteedRarity ? `<br/>Guaranteed ${pack.contents.guaranteedRarity}+` : ''}
                </div>
                <div style="font-weight: bold; margin-bottom: 12px; color: var(--highlight);">
                    ${costText}
                </div>
                <button class="btn ${canAfford ? 'btn-success' : ''}" style="width: 100%;" onclick="ShopScreen.purchasePack('${pack.id}')" ${!canAfford ? 'disabled' : ''}>
                    ${canAfford ? 'Purchase' : 'Cannot Afford'}
                </button>
            </div>
        `;
    });
    
    html += '</div></div>';
    
    // Location Packs
    const availablePacks = getPurchaseablePacks(gameState.state);
    const locationPacks = availablePacks.filter(p => p.location);
    
    if (locationPacks.length > 0) {
        html += '<div class="section" style="margin-top: 24px;">';
        html += '<h3>🗺️ Location Bundles</h3>';
        html += '<div class="card-grid">';
        
        locationPacks.forEach(pack => {
            const canAfford = gameState.canAfford(pack.cost);
            const costText = ResourceManager.formatCost(pack.cost);
            
            html += `
                <div class="shop-pack-card" style="background: var(--secondary-bg); padding: 16px; border-radius: var(--radius-lg); border: 2px solid var(--border-color);">
                    <div style="font-size: 3rem; text-align: center; margin-bottom: 8px;">${pack.emoji}</div>
                    <h4>${pack.name}</h4>
                    <p style="opacity: 0.8; font-size: 0.9rem; margin-bottom: 12px;">${pack.description}</p>
                    <div style="font-weight: bold; margin-bottom: 12px; color: var(--highlight);">
                        ${costText}
                    </div>
                    <button class="btn ${canAfford ? 'btn-success' : ''}" style="width: 100%;" onclick="ShopScreen.purchasePack('${pack.id}')" ${!canAfford ? 'disabled' : ''}>
                        ${canAfford ? 'Purchase' : 'Cannot Afford'}
                    </button>
                </div>
            `;
        });
        
        html += '</div></div>';
    }
    
    // Resource Bundles
    html += '<div class="section" style="margin-top: 24px;">';
    html += '<h3>💎 Resources</h3>';
    html += '<div class="card-grid">';
    
    SHOP_DATA.resources.forEach(resource => {
        const canAfford = gameState.canAfford(resource.cost);
        const costText = ResourceManager.formatCost(resource.cost);
        
        html += `
            <div class="shop-pack-card" style="background: var(--secondary-bg); padding: 16px; border-radius: var(--radius-lg); border: 2px solid var(--border-color);">
                <div style="font-size: 3rem; text-align: center; margin-bottom: 8px;">${resource.emoji}</div>
                <h4>${resource.name}</h4>
                <p style="opacity: 0.8; font-size: 0.9rem; margin-bottom: 12px;">${resource.description}</p>
                <div style="font-weight: bold; margin-bottom: 12px; color: var(--highlight);">
                    ${costText}
                </div>
                <button class="btn ${canAfford ? 'btn-success' : ''}" style="width: 100%;" onclick="ShopScreen.purchaseResource('${resource.id}')" ${!canAfford ? 'disabled' : ''}>
                    ${canAfford ? 'Purchase' : 'Cannot Afford'}
                </button>
            </div>
        `;
    });
    
    html += '</div></div>';
    
    html += '</div>';
    container.innerHTML = html;
}

const ShopScreen = {
    claimFreeDaily() {
        if (!canClaimFreeDaily(gameState.state)) {
            UIManager.showNotification('Already claimed today!', 'error');
            return;
        }
        
        const pack = SHOP_DATA.dailyDeals.freeDaily;
        const creatures = this.openPack(pack.contents);
        
        gameState.state.shop.lastFreeClaim = Date.now();
        gameState.save();
        
        this.showPackResults(creatures, 'Daily Free Pack');
        updateResourceDisplay();
        loadShopScreen();
    },
    
    purchasePack(packId) {
        const pack = [...SHOP_DATA.packs, ...SHOP_DATA.locationPacks].find(p => p.id === packId);
        if (!pack) return;
        
        if (!gameState.canAfford(pack.cost)) {
            UIManager.showNotification('Cannot afford this pack!', 'error');
            return;
        }
        
        // Deduct cost
        ResourceManager.removeResources(pack.cost);
        
        // Open pack
        const creatures = this.openPack(pack.contents);
        
        this.showPackResults(creatures, pack.name);
        updateResourceDisplay();
    },
    
    purchaseResource(resourceId) {
        const resource = SHOP_DATA.resources.find(r => r.id === resourceId);
        if (!resource) return;
        
        if (!gameState.canAfford(resource.cost)) {
            UIManager.showNotification('Cannot afford this!', 'error');
            return;
        }
        
        ResourceManager.removeResources(resource.cost);
        ResourceManager.addResources(resource.contents);
        
        UIManager.showNotification('Resources purchased!', 'success');
        updateResourceDisplay();
    },
    
    openPack(contents) {
        const creatures = [];
        const availableCreatures = contents.location 
            ? getCreaturesByLocation(contents.location)
            : CREATURES_DATA;
        
        for (let i = 0; i < contents.creatures; i++) {
            const rarity = this.selectRarity(contents.rarityWeights);
            const rarityPool = availableCreatures.filter(c => c.rarity === rarity);
            
            if (rarityPool.length > 0) {
                const creature = rarityPool[Math.floor(Math.random() * rarityPool.length)];
                const added = gameState.addCreature(creature);
                creatures.push(added);
            }
        }
        
        return creatures;
    },
    
    selectRarity(weights) {
        const rand = Math.random() * 100;
        let cumulative = 0;
        
        for (const [rarity, weight] of Object.entries(weights)) {
            cumulative += weight;
            if (rand <= cumulative) return rarity;
        }
        
        return 'common';
    },
    
    showPackResults(creatures, packName) {
        let content = `<div style="text-align: center;">`;
        content += `<h3>Pack Opened!</h3>`;
        content += `<p style="margin-bottom: 16px;">You received ${creatures.length} creatures:</p>`;
        content += `<div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">`;
        
        creatures.forEach(creature => {
            content += `
                <div style="padding: 8px; background: var(--accent-bg); border-radius: 8px; border: 2px solid var(--${creature.rarity});">
                    <div style="font-size: 2rem;">${creature.emoji}</div>
                    <div style="font-size: 0.9rem; font-weight: bold;">${creature.name}</div>
                    <div style="font-size: 0.8rem; opacity: 0.8;">${creature.rarity}</div>
                </div>
            `;
        });
        
        content += `</div></div>`;
        
        UIManager.showModal(packName, content, [
            { text: 'Awesome!', class: 'btn-success', onclick: 'UIManager.hideModal()' }
        ]);
    }
};
