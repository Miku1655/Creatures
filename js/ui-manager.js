// ========================================
// UI MANAGER
// Handles UI updates and animations
// ========================================

class UIManager {
    static showModal(title, content, buttons = []) {
        const overlay = document.getElementById('modal-overlay');
        const container = document.getElementById('modal-container');
        
        let html = `
            <div class="modal">
                <h2>${title}</h2>
                <div class="modal-content">${content}</div>
                <div class="modal-buttons">
        `;
        
        buttons.forEach(btn => {
            html += `<button class="btn ${btn.class || ''}" onclick="${btn.onclick}">${btn.text}</button>`;
        });
        
        html += `</div></div>`;
        
        container.innerHTML = html;
        overlay.classList.remove('hidden');
    }
    
    static hideModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    }
    
    static showNotification(message, type = 'info') {
        // Simple notification system
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}
