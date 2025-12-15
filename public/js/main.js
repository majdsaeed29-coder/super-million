// main.js - الملف الرئيسي الكامل
import { CONFIG, PRIZES } from './config.js';
import { gameState } from './gameState.js';
import { QUESTIONS } from './question.js';
import { domManager } from './domManager.js';
import { timer } from './timer.js';
import { audioManager } from './audioManager.js';
import { uiEffects } from './uiEffects.js';
import { lifelines } from './lifelines.js';

// كائن gameLogic بدل استيراده (لأنه يعتمد علينا)
class GameLogic {
    constructor() {
        this.currentQuestion = null;
        this.currentLevel = 1;
    }

    // بدء جولة جديدة
    startNewRound() {
        // تحديد المستوى حسب رقم السؤال
        this.currentLevel = Math.min(Math.ceil((gameState.currentQuestion + 1) / 5), 3);
        
        // الحصول على سؤال عشوائي من المستوى
        const availableQuestions = QUESTIONS.filter(q => 
            q.level === this.currentLevel && 
            !gameState.usedQuestions.includes(q.id)
        );
        
        if (availableQuestions.length === 0) {
            // إذا ما في أسئلة جديدة، نستخدم أي سؤال من المستوى
            const fallbackQuestions = QUESTIONS.filter(q => q.level === this.currentLevel);
            if (fallbackQuestions.length === 0) return false;
            
            const randomIndex = Math.floor(Math.random() * fallbackQuestions.length);
            this.currentQuestion = fallbackQuestions[randomIndex];
        } else {
            const randomIndex = Math.floor(Math.random() * availableQuestions.length);
            this.currentQuestion = availableQuestions[randomIndex];
        }
        
        // إضافة السؤال للمستخدمين
        gameState.addUsedQuestion(this.currentQuestion.id);
        
        // تحديث الواجهة
        this.updateUI();
        
        // بدء المؤقت
        timer.start(gameState.currentQuestion);
        
        return true;
    }

    // تحديث واجهة السؤال
    updateUI() {
        if (!this.currentQuestion) return;
        
        const { currentQuestion } = this;
        
        // تحديث نص السؤال
        domManager.elements.questionText.textContent = currentQuestion.question;
        
        // تحديث رقم السؤال
        domManager.updateQuestionNumber(gameState.currentQuestion + 1, CONFIG.TOTAL_QUESTIONS);
        
        // تحديث الخيارات
        const options = [
            domManager.elements.optionA,
            domManager.elements.optionB,
            domManager.elements.optionC,
            domManager.elements.optionD
        ];
        
        options.forEach((element, index) => {
            if (element && currentQuestion.options[index]) {
                element.textContent = currentQuestion.options[index];
            }
        });
        
        // تحديث الفئة والصعوبة
        if (domManager.elements.questionCategory) {
            domManager.elements.questionCategory.textContent = currentQuestion.category || "عام";
        }
        
        if (domManager.elements.questionDifficulty) {
            let stars = "";
            switch(currentQuestion.difficulty) {
                case "سهل": stars = "★☆☆☆☆"; break;
                case "متوسط": stars = "★★☆☆☆"; break;
                case "صعب": stars = "★★★☆☆"; break;
                default: stars = "★☆☆☆☆";
            }
            domManager.elements.questionDifficulty.textContent = stars;
        }
        
        // تحديث الجائزة الحالية
        domManager.updateCurrentPrize(gameState.getCurrentPrize());
        
        // تحديث قائمة الجوائز
        domManager.updatePrizesList(gameState.currentQuestion, PRIZES);
        
        // تنظيف الخيارات
        domManager.clearOptions();
        
        // تعطيل زر التالي
        if (domManager.elements.nextBtn) {
            domManager.elements.nextBtn.disabled = true;
            domManager.elements.nextBtn.classList.add('disabled');
        }
    }

    // التحقق من الإجابة
    checkAnswer(selectedIndex) {
        if (!this.currentQuestion) return false;
        
        const isCorrect = selectedIndex === this.currentQuestion.correct;
        
        // تحديث حالة اللعبة
        gameState.updateScore(isCorrect);
        gameState.selectedOption = selectedIndex;
        
        // إيقاف المؤقت
        timer.stop();
        
        // عرض النتيجة
        this.showAnswerResult(selectedIndex, isCorrect);
        
        // تشغيل الصوت المناسب
        if (isCorrect) {
            audioManager.play('correct');
            uiEffects.showCorrectEffect();
        } else {
            audioManager.play('wrong');
            uiEffects.showWrongEffect();
        }
        
        return isCorrect;
    }

    // عرض نتيجة الإجابة
    showAnswerResult(selectedIndex, isCorrect) {
        const buttons = domManager.elements.optionButtons;
        
        if (!buttons || buttons.length === 0) return;
        
        // تعطيل جميع الأزرار
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.pointerEvents = 'none';
        });
        
        // تلوين الإجابة المختارة
        if (buttons[selectedIndex]) {
            buttons[selectedIndex].classList.add(isCorrect ? 'correct' : 'wrong');
        }
        
        // إذا كانت الإجابة خاطئة، عرض الإجابة الصحيحة
        if (!isCorrect && buttons[this.currentQuestion.correct]) {
            buttons[this.currentQuestion.correct].classList.add('correct');
        }
        
        // تمكين زر التالي إذا كانت الإجابة صحيحة ولم يكن السؤال الأخير
        if (isCorrect && gameState.currentQuestion < CONFIG.TOTAL_QUESTIONS - 1) {
            setTimeout(() => {
                if (domManager.elements.nextBtn) {
                    domManager.elements.nextBtn.disabled = false;
                    domManager.elements.nextBtn.classList.remove('disabled');
                }
            }, 1000);
        }
    }

    // الانتقال للسؤال التالي
    goToNextQuestion() {
        if (gameState.nextQuestion()) {
            return this.startNewRound();
        }
        return false;
    }

    // انسحاب آمن
    safeWithdraw() {
        const prize = gameState.getSafePrize();
        gameState.score = prize;
        return prize;
    }

    // إنهاء اللعبة
    endGame(isWin = false) {
        gameState.gameActive = false;
        timer.stop();
        
        // تحديث شاشة النتائج
        this.updateResultScreen(isWin);
        
        // الانتقال لشاشة النتائج
        setTimeout(() => {
            domManager.showScreen('result');
        }, 2000);
    }

    // تحديث شاشة النتائج
    updateResultScreen(isWin) {
        const { elements } = domManager;
        
        if (!elements) return;
        
        if (isWin && gameState.currentQuestion === CONFIG.TOTAL_QUESTIONS - 1) {
            if (elements.resultTitle) {
                elements.resultTitle.textContent = "مبروك! فزت بالمليون! 🏆";
            }
            uiEffects.showConfetti();
        } else if (!isWin && elements.resultTitle) {
            elements.resultTitle.textContent = "انتهت اللعبة";
        }
        
        if (elements.finalPrize) {
            elements.finalPrize.textContent = gameState.score.toLocaleString();
        }
        
        if (elements.resultPlayerName) {
            elements.resultPlayerName.textContent = gameState.playerName;
        }
        
        if (elements.correctAnswers) {
            elements.correctAnswers.textContent = gameState.totalCorrect;
        }
        
        if (elements.timeTaken) {
            elements.timeTaken.textContent = `${gameState.getPlayTime()}s`;
        }
        
        if (elements.accuracyRate) {
            elements.accuracyRate.textContent = `${gameState.getAccuracy()}%`;
        }
        
        if (elements.lifelinesUsed) {
            const used = CONFIG.LIFELINES_COUNT - gameState.getRemainingLifelines();
            elements.lifelinesUsed.textContent = used;
        }
    }
}

// إنشاء نسخة من gameLogic
export const gameLogic = new GameLogic();

// دالة تهيئة اللعبة الرئيسية
export function initMainGame() {
    console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION} - Game Started`);
    
    try {
        // تهيئة المديرين
        audioManager.initialize();
        uiEffects.init();
        
        // تحميل حالة اللعبة من localStorage
        loadGameState();
        
        // إعداد مستمعي الأحداث
        setupEventListeners();
        
        // بدء الجولة الأولى إذا كان هناك اسم لاعب واللعبة نشطة
        if (gameState.playerName && gameState.gameActive) {
            gameLogic.startNewRound();
        } else {
            // إظهار الشاشة الرئيسية
            domManager.showScreen('start');
        }
        
        console.log('✅ اللعبة مهيأة بنجاح');
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة اللعبة:', error);
        domManager.showNotification('حدث خطأ في تحميل اللعبة', 'error');
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
        
        if (savedSoundSetting !== null) {
            audioManager.setEnabled(savedSoundSetting === 'true');
        }
        
        // تحميل النتائج العالية
        const highScores = localStorage.getItem('millionaireHighScores');
        if (highScores) {
            try {
                window.highScores = JSON.parse(highScores);
            } catch (e) {
                window.highScores = [];
            }
        } else {
            window.highScores = [];
        }
        
    } catch (e) {
        console.log('لا توجد حالة محفوظة');
    }
}

// إعداد جميع مستمعي الأحداث
function setupEventListeners() {
    console.log('🔄 جاري إعداد مستمعي الأحداث...');
    
    // زر بدء اللعبة من الشاشة الرئيسية
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startGameFromButton);
        console.log('✅ زر البدء جاهز');
    }
    
    // اسم اللاعب عند الضغط على Enter
    const playerNameInput = document.getElementById('player-name');
    if (playerNameInput) {
        playerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                startGameFromButton();
            }
        });
    }
    
    // زر التالي في شاشة اللعبة
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (gameLogic.goToNextQuestion()) {
                audioManager.play('click');
                domManager.showNotification('سؤال جديد جاهز!', 'info');
            }
        });
        console.log('✅ زر التالي جاهز');
    }
    
    // زر الانسحاب
    const withdrawBtn = document.getElementById('withdraw-btn');
    if (withdrawBtn) {
        withdrawBtn.addEventListener('click', showWithdrawModal);
        console.log('✅ زر الانسحاب جاهز');
    }
    
    // زر الانسحاب السريع
    const quickWithdrawBtn = document.getElementById('quick-withdraw');
    if (quickWithdrawBtn) {
        quickWithdrawBtn.addEventListener('click', showWithdrawModal);
    }
    
    // المساعدات
    const fiftyFiftyBtn = document.getElementById('fifty-fifty');
    if (fiftyFiftyBtn) {
        fiftyFiftyBtn.addEventListener('click', () => {
            if (gameState.lifelines.fiftyFifty && gameLogic.currentQuestion) {
                lifelines.useFiftyFifty(gameLogic.currentQuestion.correct);
                audioManager.play('click');
                domManager.showNotification('تم استخدام 50:50', 'info');
            }
        });
    }
    
    const askAudienceBtn = document.getElementById('ask-audience');
    if (askAudienceBtn) {
        askAudienceBtn.addEventListener('click', () => {
            if (gameState.lifelines.askAudience && gameLogic.currentQuestion) {
                lifelines.useAskAudience(gameLogic.currentQuestion);
                audioManager.play('click');
            }
        });
    }
    
    const phoneFriendBtn = document.getElementById('phone-friend');
    if (phoneFriendBtn) {
        phoneFriendBtn.addEventListener('click', () => {
            if (gameState.lifelines.phoneFriend && gameLogic.currentQuestion) {
                lifelines.usePhoneFriend(gameLogic.currentQuestion);
                audioManager.play('click');
            }
        });
    }
    
    // خيارات الإجابة
    const optionButtons = document.querySelectorAll('.option-card');
    if (optionButtons.length > 0) {
        optionButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                if (!gameState.gameActive || gameState.selectedOption !== null) return;
                
                audioManager.play('click');
                const isCorrect = gameLogic.checkAnswer(index);
                
                if (!isCorrect) {
                    setTimeout(() => {
                        gameLogic.endGame(false);
                    }, 2000);
                } else if (gameState.currentQuestion === CONFIG.TOTAL_QUESTIONS - 1) {
                    // إذا كان السؤال الأخير وصحيح
                    setTimeout(() => {
                        gameLogic.endGame(true);
                    }, 1500);
                }
            });
        });
        console.log(`✅ ${optionButtons.length} زر خيار جاهز`);
    }
    
    // زر إعادة اللعب
    const playAgainBtn = document.getElementById('play-again-btn');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', () => {
            resetGame();
            window.location.reload();
        });
    }
    
    // زر القائمة الرئيسية
    const mainMenuBtn = document.getElementById('main-menu-btn');
    if (mainMenuBtn) {
        mainMenuBtn.addEventListener('click', () => {
            resetGame();
            domManager.showScreen('start');
        });
    }
    
    // زر المشاركة
    const shareResult = document.getElementById('share-result');
    if (shareResult) {
        shareResult.addEventListener('click', shareGameResult);
    }
    
    // نافذة الانسحاب
    const confirmWithdraw = document.getElementById('confirm-withdraw');
    if (confirmWithdraw) {
        confirmWithdraw.addEventListener('click', () => {
            const prize = gameLogic.safeWithdraw();
            domManager.showNotification(`انسحاب آمن! ربحت ${prize.toLocaleString()} $`, 'success');
            gameLogic.endGame(false);
            document.getElementById('withdraw-modal').classList.remove('active');
        });
    }
    
    const cancelWithdraw = document.getElementById('cancel-withdraw');
    if (cancelWithdraw) {
        cancelWithdraw.addEventListener('click', () => {
            document.getElementById('withdraw-modal').classList.remove('active');
        });
    }
    
    const continuePlaying = document.getElementById('continue-playing');
    if (continuePlaying) {
        continuePlaying.addEventListener('click', () => {
            document.getElementById('withdraw-modal').classList.remove('active');
        });
    }
    
    // إغلاق النوافذ
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) modal.classList.remove('active');
        });
    });
    
    // زر التعليمات
    const instructionsBtn = document.getElementById('instructions-btn');
    if (instructionsBtn) {
        instructionsBtn.addEventListener('click', () => {
            document.getElementById('help-modal').classList.add('active');
        });
    }
    
    const startAfterHelp = document.getElementById('start-after-help');
    if (startAfterHelp) {
        startAfterHelp.addEventListener('click', () => {
            document.getElementById('help-modal').classList.remove('active');
            startGameFromButton();
        });
    }
    
    // زر الصوت
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', toggleSound);
    }
    
    const soundToggleGame = document.getElementById('sound-toggle-game');
    if (soundToggleGame) {
        soundToggleGame.addEventListener('click', toggleSound);
    }
    
    // زر الإيقاف المؤقت
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', togglePause);
    }
    
    // زر المساعدة في اللعبة
    const helpBtn = document.getElementById('help-btn');
    if (helpBtn) {
        helpBtn.addEventListener('click', () => {
            document.getElementById('help-modal').classList.add('active');
        });
    }
    
    console.log('✅ جميع الأحداث جاهزة');
}

// بدء اللعبة من الزر
function startGameFromButton() {
    const playerNameInput = document.getElementById('player-name');
    let playerName = playerNameInput ? playerNameInput.value.trim() : 'اللاعب';
    
    if (!playerName || playerName.length < 2) {
        playerName = 'اللاعب';
    }
    
    // حفظ اسم اللاعب
    localStorage.setItem('millionairePlayerName', playerName);
    
    // بدء حالة اللعبة الجديدة
    gameState.start(playerName);
    
    // تحديث الواجهة
    domManager.updatePlayerInfo(playerName);
    domManager.updatePrizesList(0, PRIZES);
    
    // الانتقال لشاشة اللعبة
    domManager.showScreen('game');
    
    // بدء الجولة الأولى
    setTimeout(() => {
        if (gameLogic.startNewRound()) {
            domManager.showNotification(`مرحباً ${playerName}! حظاً موفقاً`, 'success');
            audioManager.play('correct');
        }
    }, 500);
}

// تبديل الصوت
function toggleSound() {
    const isEnabled = audioManager.toggle();
    
    // تحديث الأيقونة في الشاشة الرئيسية
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        const icon = soundToggle.querySelector('i');
        if (icon) {
            icon.className = isEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        }
    }
    
    // تحديث الأيقونة في شاشة اللعبة
    const soundToggleGame = document.getElementById('sound-toggle-game');
    if (soundToggleGame) {
        const icon = soundToggleGame.querySelector('i');
        if (icon) {
            icon.className = isEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        }
    }
    
    domManager.showNotification(isEnabled ? 'الصوت مفعل' : 'الصوت معطل', 'info');
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

// إظهار نافذة الانسحاب
function showWithdrawModal() {
    const prize = gameState.getSafePrize();
    const withdrawAmount = document.getElementById('withdraw-amount');
    if (withdrawAmount) {
        withdrawAmount.textContent = prize.toLocaleString();
    }
    document.getElementById('withdraw-modal').classList.add('active');
}

// مشاركة النتيجة
function shareGameResult() {
    const shareText = `🎮 فزت ب ${gameState.score.toLocaleString()} $ في لعبة المليونير الذهبي! \nجربها الآن: ${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'نتيجتي في المليونير الذهبي',
            text: shareText,
            url: window.location.href
        });
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText)
            .then(() => {
                domManager.showNotification('تم نسخ النتيجة للحافظة!', 'success');
            })
            .catch(() => {
                domManager.showNotification('تعذر النسخ، حاول مرة أخرى', 'error');
            });
    } else {
        domManager.showNotification('المتصفح لا يدعم المشاركة', 'warning');
    }
}

// إعادة تعيين اللعبة
export function resetGame() {
    gameState.reset();
    lifelines.resetLifelines();
    timer.reset();
    uiEffects.reset();
    
    // تحديث الواجهة
    if (domManager.elements.scoreDisplay) {
        domManager.elements.scoreDisplay.textContent = '0';
    }
    
    if (domManager.elements.timerDisplay) {
        domManager.elements.timerDisplay.textContent = '30';
    }
    
    if (domManager.elements.currentPrize) {
        domManager.elements.currentPrize.textContent = '100';
    }
    
    console.log('🔄 اللعبة أعيد تعيينها');
}

// بدء اللعبة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 الصفحة محملة، جاري تهيئة اللعبة...');
    initMainGame();
});

// تصدير للأغراض العامة
export { gameState, domManager, timer, audioManager, uiEffects, lifelines };
