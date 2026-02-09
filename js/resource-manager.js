// ========================================
// RESOURCE MANAGER
// Handles resource transactions
// ========================================

class ResourceManager {
    static addResources(resources) {
        Object.entries(resources).forEach(([type, amount]) => {
            gameState.addResource(type, amount);
        });
        
        if (window.gameAPI) {
            window.gameAPI.updateResourceDisplay();
        }
    }
    
    static removeResources(resources) {
        Object.entries(resources).forEach(([type, amount]) => {
            gameState.removeResource(type, amount);
        });
        
        if (window.gameAPI) {
            window.gameAPI.updateResourceDisplay();
        }
    }
    
    static canAfford(cost) {
        return gameState.canAfford(cost);
    }
    
    static formatCost(cost) {
        const parts = [];
        if (cost.gold) parts.push(`${cost.gold} 💰`);
        if (cost.gems) parts.push(`${cost.gems} 💎`);
        if (cost.dust) parts.push(`${cost.dust} ✨`);
        return parts.join(' ');
    }
}
