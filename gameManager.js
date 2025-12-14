// gameManager.js - لإدارة تدفق اللعبة
import { initMainGame, gameState, domManager } from './main.js';

class GameManager {
    constructor() {
        this.init();
    }

    init() {
        // التحقق إذا كان هناك اسم لاعب
        const playerName = localStorage.getItem('millionairePlayerName');
        
        if (!playerName) {
            // إذا ما في اسم، ارجع لشاشة البداية
            window.location.href = 'start.html';
            return;
        }
        
        // بدء اللعبة
        gameState.playerName = playerName;
        domManager.updatePlayerInfo(playerName);
        
        // تهيئة اللعبة الرئيسية
        initMainGame();
        
        // تحميل التصميم
        this.loadGameUI();
    }

    loadGameUI() {
        // هنا يمكنك تحميل واجهة اللعبة ديناميكياً إذا أردت
        // أو تركها كما هي في game.html
        console.log('Game UI Loaded');
    }
}

// بدء مدير اللعبة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new GameManager();
});
