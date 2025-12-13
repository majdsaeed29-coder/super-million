// استيراد جميع الوحدات
import { CONFIG, MESSAGES } from './config.js';
import { domManager } from './domManager.js';
import { gameState } from './gameState.js';
import { gameLogic } from './gameLogic.js';
import { lifelines } from './lifelines.js';
import { timer } from './timer.js';
import { audioManager } from './audioManager.js';
import { initializeUI, showCelebration } from './uiEffects.js';

// تهيئة اللعبة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    setupEventListeners();
});

// تهيئة اللعبة
function initializeGame() {
    console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION}`);
    
    // تهيئة الواجهة
    initializeUI();
    
    // تهيئة مدير الصوت
    audioManager.initialize();
    
    // عرض شاشة البداية
    domManager.showScreen('start');
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    const { elements } = domManager;
    
    // بدء اللعبة
    elements.startBtn.addEventListener('click', startGame);
    
    // زر التالي
    elements.nextBtn.addEventListener('click', () => {
        if (gameLogic.goToNextQuestion()) {
            audioManager.play('click');
        }
    });
    
    // زر الانسحاب
    elements.withdrawBtn.addEventListener('click', showWithdrawModal);
    
    // المساعدات
    elements.fiftyFiftyBtn.addEventListener('click', () => {
        lifelines.useFiftyFifty();
        audioManager.play('click');
    });
    
    elements.askAudienceBtn.addEventListener('click', () => {
        lifelines.useAskAudience();
        audioManager.play('click');
    });
    
    elements.phoneFriendBtn.addEventListener('click', () => {
        lifelines.usePhoneFriend();
        audioManager.play('click');
    });
    
    // خيارات الإجابة
    elements.optionButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            if (!gameState.gameActive || gameState.selectedOption !== null) return;
            
            audioManager.play('click');
            const isCorrect = gameLogic.checkAnswer(index);
            
            if (!isCorrect) {
                setTimeout(() => {
                    gameLogic.endGame(false);
                }, 2000);
            }
        });
    });
    
    // إعادة اللعب
    elements.playAgainBtn.addEventListener('click', () => {
        resetGame();
        domManager.showScreen('start');
        audioManager.play('click');
    });
    
    // نافذة الانسحاب
    document.getElementById('confirm-withdraw').addEventListener('click', () => {
        const prize = gameLogic.safeWithdraw();
        domManager.showNotification(`انسحاب آمن! ربحت ${prize.toLocaleString()} جنيه`, 'info');
        gameLogic.endGame(false);
    });
    
    document.getElementById('cancel-withdraw').addEventListener('click', () => {
        domManager.showScreen('game');
    });
    
    // إدخال الاسم عند الضغط على Enter
    elements.playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startGame();
        }
    });
}

// بدء اللعبة
function startGame() {
    const playerName = domManager.elements.playerNameInput.value.trim();
    
    if (!playerName) {
        domManager.showNotification('الرجاء إدخال اسمك!', 'error');
        return;
    }
    
    // بدء حالة اللعبة
    gameState.start(playerName);
    
    // تحديث الواجهة
    domManager.updatePlayerInfo(playerName);
    domManager.showScreen('game');
    
    // بدء الجولة الأولى
    gameLogic.startNewRound();
    
    // تشغيل صوت البداية
    audioManager.play('start');
}

// عرض نافذة الانسحاب
function showWithdrawModal() {
    const prize = gameState.getSafePrize();
    document.getElementById('withdraw-amount').textContent = prize.toLocaleString();
    domManager.showScreen('withdrawModal');
}

// إعادة تعيين اللعبة
function resetGame() {
    gameState.reset();
    lifelines.resetLifelines();
    timer.reset();
    domManager.clearOptions();
}

// إدارة حدث انتهاء الوقت
timer.onTimeUp = () => {
    audioManager.play('timeup');
    domManager.showNotification('انتهى الوقت!', 'warning');
    
    setTimeout(() => {
        if (gameState.currentQuestion < 14) {
            gameLogic.goToNextQuestion();
        } else {
            gameLogic.endGame(false);
        }
    }, 2000);
};

// تصدير الدوال الرئيسية للاستخدام العام
export { startGame, resetGame };
