// gameManager.js
import { gameState } from './gameState.js';
import { gameLogic } from './gameLogic.js';
import { domManager } from './domManager.js';

class GameManager {
    constructor() {
        this.initGame();
    }
    
    initGame() {
        // الحصول على اسم اللاعب من localStorage
        const playerName = localStorage.getItem('millionairePlayerName') || 'ضيف';
        
        // تهيئة حالة اللعبة
        gameState.start(playerName);
        
        // بدء اللعبة
        gameLogic.startNewRound();
        
        // تحديث الواجهة
        domManager.updatePlayerInfo(playerName);
    }
}

// بدء اللعبة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const gameManager = new GameManager();
});
