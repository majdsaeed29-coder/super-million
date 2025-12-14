
// main.js - الملف الرئيسي لربط كل الوحدات
import { CONFIG } from './config.js';
import { gameState } from './gameState.js';
import { gameLogic } from './gameLogic.js';
import { domManager } from './domManager.js';
import { lifelines } from './lifelines.js';
import { timer } from './timer.js';
import { audioManager } from './audioManager.js';
import { uiEffects } from './uiEffects.js';

// دالة تهيئة اللعبة الرئيسية
export function initMainGame() {
    console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION} - Game Started`);
    
    // تهيئة مدير الصوت
    audioManager.initialize();
    
    // تهيئة المؤثرات البصرية
    uiEffects.init();
    
    // تحميل حالة اللعبة من localStorage إذا موجودة
    loadGameState();
    
    // إعداد مستمعي الأحداث
    setupEventListeners();
    
    // بدء الجولة الأولى إذا كان هناك اسم لاعب
    if (gameState.playerName) {
        gameLogic.startNewRound();
    }
}

// تحميل حالة اللعبة المحفوظة
function loadGameState() {
    try {
        const savedPlayerName = localStorage.getItem('millionairePlayerName');
        const savedSoundSetting = localStorage.getItem('millionaireSoundEnabled');
        
        if (savedPlayerName) {
            gameState.playerName = savedPlayerName;
            domManager.updatePlayerInfo(savedPlayerName);
        }
        
        if (savedSoundSetting) {
            audioManager.setEnabled(savedSoundSetting === 'true');
        }
    } catch (e) {
        console.log('No saved game state found');
    }
}

// إعداد جميع مستمعي الأحداث
function setupEventListeners() {
    const { elements } = domManager;
    
    // زر التالي
    elements.nextBtn?.addEventListener('click', () => {
        if (gameLogic.goToNextQuestion()) {
            audioManager.play('click');
        }
    });
    
    // زر الانسحاب
    elements.withdrawBtn?.addEventListener('click', showWithdrawModal);
    
    // المساعدات
    elements.fiftyFiftyBtn?.addEventListener('click', () => {
        lifelines.useFiftyFifty();
        audioManager.play('click');
    });
    
    elements.askAudienceBtn?.addEventListener('click', () => {
        lifelines.useAskAudience();
        audioManager.play('click');
    });
    
    elements.phoneFriendBtn?.addEventListener('click', () => {
        lifelines.usePhoneFriend();
        audioManager.play('click');
    });
    
    // خيارات الإجابة
    elements.optionButtons?.forEach((btn, index) => {
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
    elements.playAgainBtn?.addEventListener('click', () => {
        resetGame();
        window.location.href = 'start.html'; // العودة لشاشة البداية
    });
    
    // نافذة الانسحاب
    document.getElementById('confirm-withdraw')?.addEventListener('click', () => {
        const prize = gameLogic.safeWithdraw();
        domManager.showNotification(`انسحاب آمن! ربحت ${prize.toLocaleString()} $`, 'info');
        gameLogic.endGame(false);
    });
    
    document.getElementById('cancel-withdraw')?.addEventListener('click', () => {
        domManager.showScreen('game');
    });
    
    // زر القائمة الرئيسية
    document.getElementById('main-menu-btn')?.addEventListener('click', () => {
        window.location.href = 'start.html';
    });
    
    // زر مشاركة النتيجة
    document.getElementById('share-result')?.addEventListener('click', shareResult);
    
    // تحكم بالصوت في شاشة اللعبة
    document.getElementById('sound-toggle-game')?.addEventListener('click', toggleSound);
    
    // زر الإيقاف المؤقت
    document.getElementById('pause-btn')?.addEventListener('click', togglePause);
}

// إظهار نافذة الانسحاب
function showWithdrawModal() {
    const prize = gameState.getSafePrize();
    document.getElementById('withdraw-amount').textContent = prize.toLocaleString();
    domManager.showScreen('withdrawModal');
}

// تبديل الصوت
function toggleSound() {
    const isEnabled = audioManager.toggle();
    const btn = document.getElementById('sound-toggle-game');
    if (btn) {
        btn.innerHTML = isEnabled ? 
            '<i class="fas fa-volume-up"></i>' : 
            '<i class="fas fa-volume-mute"></i>';
    }
}

// تبديل الإيقاف المؤقت
function togglePause() {
    if (gameState.isPaused) {
        timer.resume();
        gameState.isPaused = false;
        domManager.showNotification('استمرار اللعبة', 'info');
    } else {
        timer.pause();
        gameState.isPaused = true;
        domManager.showNotification('اللعبة متوقفة مؤقتاً', 'warning');
    }
}

// مشاركة النتيجة
function shareResult() {
    const shareText = `فزت ب ${gameState.score.toLocaleString()} $ في لعبة المليونير الذهبي! جربها الآن:`;
    
    if (navigator.share) {
        navigator.share({
            title: 'نتيجتي في المليونير الذهبي',
            text: shareText,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(shareText);
        domManager.showNotification('تم نسخ النتيجة للحافظة!', 'success');
    }
}

// إعادة تعيين اللعبة
export function resetGame() {
    gameState.reset();
    lifelines.resetLifelines();
    timer.reset();
    uiEffects.reset();
}

// تصدير دوال مهمة
export { gameState, gameLogic, domManager, lifelines, timer, audioManager };
