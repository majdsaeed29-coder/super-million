import { CONFIG, PRIZES, QUESTION_CATEGORIES } from './config.js';
import { audioManager } from './audioManager.js';
import { gameState } from './gameState.js';
import { QUESTION_BANK } from './question.js';

class MillionaireGame {
    constructor() {
        this.currentTimer = null;
        this.currentQuestion = null;
        this.questions = [];
        this.init();
    }

    init() {
        console.log(`${CONFIG.APP_NAME} - الإصدار ${CONFIG.VERSION}`);
        
        // تحميل بيانات اللاعب
        this.loadPlayer();
        
        // إعداد الواجهة
        this.setupUI();
        
        // إعداد الأحداث
        this.setupEventListeners();
        
        // بدء اللعبة
        this.startGame();
    }

    loadPlayer() {
        const playerData = JSON.parse(localStorage.getItem('currentUser'));
        const settings = JSON.parse(localStorage.getItem('gameSettings'));
        
        if (!playerData) {
            window.location.href = 'start.html';
            return;
        }
        
        gameState.init(playerData);
        if (settings) {
            gameState.settings = settings;
        }
    }

    setupUI() {
        // تحديث معلومات اللاعب
        this.updatePlayerInfo();
        
        // تحديث الإعدادات
        this.updateGameSettings();
        
        // تحديث قائمة الجوائز
        this.updatePrizesList();
    }

    updatePlayerInfo() {
        const playerNameEl = document.getElementById('current-player');
        const playerLevelEl = document.getElementById('player-level');
        const playerAvatarEl = document.querySelector('.player-avatar i');
        
        if (playerNameEl) {
            playerNameEl.textContent = gameState.player.username;
        }
        
        if (playerLevelEl) {
            playerLevelEl.textContent = gameState.getPlayerLevel();
        }
        
        if (playerAvatarEl) {
            playerAvatarEl.className = gameState.player.isGuest ? 
                'fas fa-user-clock' : 'fas fa-user';
        }
    }

    updateGameSettings() {
        // إظهار/إخفاء المؤقت
        if (!gameState.settings.timerEnabled) {
            document.querySelector('.game-stats-bar').style.opacity = '0.5';
        }
    }

    startGame() {
        // تحميل الأسئلة
        this.loadQuestions();
        
        // بدء حالة اللعبة
        gameState.start();
        
        // عرض السؤال الأول
        this.showQuestion();
        
        // تشغيل موسيقى الخلفية
        audioManager.playBackgroundMusic();
    }

    loadQuestions() {
        const { questionType, difficulty } = gameState.settings;
        
        if (questionType === 'all') {
            this.questions = QUESTION_BANK.getRandomQuestions();
        } else {
            this.questions = QUESTION_BANK.getQuestionsByCategory(
                questionType.toUpperCase(),
                CONFIG.TOTAL_QUESTIONS
            );
        }
        
        // إذا لم يكن هناك أسئلة كافية، نستخدم الأسئلة العامة
        if (this.questions.length < CONFIG.TOTAL_QUESTIONS) {
            const generalQuestions = QUESTION_BANK.getQuestionsByCategory('GENERAL');
            this.questions = [...this.questions, ...generalQuestions]
                .slice(0, CONFIG.TOTAL_QUESTIONS);
        }
    }

    showQuestion() {
        if (gameState.currentQuestion >= this.questions.length) {
            this.endGame(true);
            return;
        }

        this.currentQuestion = this.questions[gameState.currentQuestion];
        
        // تحديث واجهة السؤال
        this.updateQuestionUI();
        
        // إعادة تعيين الخيارات
        this.resetOptions();
        
        // بدء المؤقت
        this.startTimer();
    }

    updateQuestionUI() {
        if (!this.currentQuestion) return;
        
        const questionText = document.getElementById('question-text');
        const questionCategory = document.getElementById('question-category');
        const questionNumber = document.getElementById('q-number');
        const questionDifficulty = document.getElementById('question-difficulty');
        
        if (questionText) {
            questionText.textContent = this.currentQuestion.question;
        }
        
        if (questionCategory) {
            questionCategory.textContent = this.currentQuestion.category;
            const categoryInfo = Object.values(QUESTION_CATEGORIES)
                .find(cat => cat.name === this.currentQuestion.category);
            
            if (categoryInfo) {
                questionCategory.style.backgroundColor = categoryInfo.color;
            }
        }
        
        if (questionNumber) {
            questionNumber.textContent = gameState.currentQuestion + 1;
        }
        
        if (questionDifficulty) {
            let stars = "";
            switch(this.currentQuestion.difficulty) {
                case "easy": stars = "★☆☆☆☆"; break;
                case "medium": stars = "★★☆☆☆"; break;
                case "hard": stars = "★★★☆☆"; break;
                default: stars = "★☆☆☆☆";
            }
            questionDifficulty.textContent = stars;
        }
        
        // تحديث الخيارات
        this.updateOptions();
        
        // تحديث الجائزة
        this.updatePrizeDisplay();
        
        // تحديث شريط التقدم
        this.updateProgressBar();
    }

    updateOptions() {
        const options = ['a', 'b', 'c', 'd'];
        options.forEach((letter, index) => {
            const optionText = document.getElementById(`option-${letter}`);
            if (optionText && this.currentQuestion.options[index]) {
                optionText.textContent = this.currentQuestion.options[index];
            }
        });
    }

    updatePrizeDisplay() {
        const prize = gameState.getCurrentPrize();
        const currentPrizeEl = document.getElementById('current-prize');
        const totalPrizeEl = document.getElementById('total-prize');
        
        if (currentPrizeEl) {
            currentPrizeEl.textContent = prize.toLocaleString();
        }
        
        if (totalPrizeEl) {
            totalPrizeEl.textContent = prize.toLocaleString();
        }
    }

    updateProgressBar() {
        const progress = ((gameState.currentQuestion + 1) / CONFIG.TOTAL_QUESTIONS) * 100;
        const progressFill = document.getElementById('progress-fill');
        const progressPercent = document.getElementById('progress-percent');
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressPercent) {
            progressPercent.textContent = `${progress.toFixed(2)}%`;
        }
    }

    resetOptions() {
        const optionCards = document.querySelectorAll('.option-card');
        optionCards.forEach(card => {
            card.classList.remove('correct', 'wrong', 'selected');
            card.style.opacity = '1';
            card.style.pointerEvents = 'auto';
        });
        
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.disabled = true;
            nextBtn.classList.add('disabled');
        }
    }

    startTimer() {
        if (!gameState.settings.timerEnabled) return;
        
        let timeLeft = CONFIG.TIME_PER_QUESTION;
        const timerDisplay = document.getElementById('timer');
        
        if (!timerDisplay) return;
        
        timerDisplay.textContent = timeLeft;
        timerDisplay.classList.remove('warning', 'danger');
        
        // إيقاف المؤقت السابق
        clearInterval(this.currentTimer);
        
        // بدء مؤقت جديد
        this.currentTimer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            
            // تغيير اللون حسب الوقت المتبقي
            if (timeLeft <= 10) {
                timerDisplay.classList.add('warning');
                audioManager.play('timer');
            }
            
            if (timeLeft <= 5) {
                timerDisplay.classList.add('danger');
            }
            
            if (timeLeft <= 0) {
                clearInterval(this.currentTimer);
                this.timeUp();
            }
        }, 1000);
    }

    timeUp() {
        audioManager.play('wrong');
        alert('انتهى الوقت!');
        this.endGame(false);
    }

    setupEventListeners() {
        // أحداث الخيارات
        document.getElementById('option-a-card')?.addEventListener('click', () => this.checkAnswer(0));
        document.getElementById('option-b-card')?.addEventListener('click', () => this.checkAnswer(1));
        document.getElementById('option-c-card')?.addEventListener('click', () => this.checkAnswer(2));
        document.getElementById('option-d-card')?.addEventListener('click', () => this.checkAnswer(3));
        
        // زر التالي
        document.getElementById('next-btn')?.addEventListener('click', () => this.nextQuestion());
        
        // زر الانسحاب
        document.getElementById('withdraw-btn')?.addEventListener('click', () => this.showWithdrawModal());
        
        // المساعدات
        document.getElementById('fifty-fifty')?.addEventListener('click', () => this.useFiftyFifty());
        document.getElementById('ask-audience')?.addEventListener('click', () => this.useAskAudience());
        document.getElementById('phone-friend')?.addEventListener('click', () => this.usePhoneFriend());
        
        // التحكم بالصوت
        document.getElementById('sound-toggle')?.addEventListener('click', () => this.toggleSound());
        
        // التعليمات
        document.getElementById('help-btn')?.addEventListener('click', () => this.showHelpModal());
        
        // إدارة النوافذ المنبثقة
        this.setupModalEvents();
    }

    setupModalEvents() {
        // نافذة الانسحاب
        document.getElementById('confirm-withdraw')?.addEventListener('click', () => this.confirmWithdraw());
        document.getElementById('continue-playing')?.addEventListener('click', () => {
            document.getElementById('withdraw-modal').classList.remove('active');
        });
        document.getElementById('close-withdraw')?.addEventListener('click', () => {
            document.getElementById('withdraw-modal').classList.remove('active');
        });
        
        // نافذة التعليمات
        document.getElementById('start-after-help')?.addEventListener('click', () => {
            document.getElementById('help-modal').classList.remove('active');
        });
        document.getElementById('close-help')?.addEventListener('click', () => {
            document.getElementById('help-modal').classList.remove('active');
        });
    }

    checkAnswer(selectedIndex) {
        if (gameState.answered || !gameState.gameActive) return;
        
        gameState.answered = true;
        audioManager.play('click');
        
        // إيقاف المؤقت
        clearInterval(this.currentTimer);
        
        const isCorrect = gameState.checkAnswer(selectedIndex, this.currentQuestion.correct);
        
        // تلوين الإجابات
        this.highlightAnswers(selectedIndex, isCorrect);
        
        if (isCorrect) {
            audioManager.play('correct');
            this.handleCorrectAnswer();
        } else {
            audioManager.play('wrong');
            this.handleWrongAnswer();
        }
        
        // تحديث قائمة الجوائز
        this.updatePrizesList();
    }

    highlightAnswers(selectedIndex, isCorrect) {
        const optionCards = document.querySelectorAll('.option-card');
        const selectedCard = optionCards[selectedIndex];
        const correctCard = optionCards[this.currentQuestion.correct];
        
        if (selectedCard) {
            selectedCard.classList.add(isCorrect ? 'correct' : 'wrong');
        }
        
        if (!isCorrect && correctCard) {
            correctCard.classList.add('correct');
        }
        
        optionCards.forEach(card => {
            card.style.pointerEvents = 'none';
        });
    }

    handleCorrectAnswer() {
        // تحديث الجائزة
        this.updatePrizeDisplay();
        
        // التحقق إذا كانت هذه آخر سؤال
        if (gameState.currentQuestion < this.questions.length - 1) {
            // تفعيل زر التالي بعد تأخير
            setTimeout(() => {
                const nextBtn = document.getElementById('next-btn');
                if (nextBtn) {
                    nextBtn.disabled = false;
                    nextBtn.classList.remove('disabled');
                }
            }, 1000);
        } else {
            // إنهاء اللعبة بالفوز
            setTimeout(() => this.endGame(true), 2000);
        }
    }

    handleWrongAnswer() {
        // إنهاء اللعبة بالخسارة بعد تأخير
        setTimeout(() => this.endGame(false), 2000);
    }

    nextQuestion() {
        if (gameState.nextQuestion()) {
            this.showQuestion();
        } else {
            this.endGame(true);
        }
    }

    updatePrizesList() {
        const prizesList = document.getElementById('prizes-list');
        if (!prizesList) return;
        
        prizesList.innerHTML = '';
        
        PRIZES.forEach((prize, index) => {
            const prizeItem = document.createElement('div');
            prizeItem.className = 'prize-item';
            
            if (index === gameState.currentQuestion) {
                prizeItem.classList.add('current');
            } else if (index < gameState.currentQuestion) {
                prizeItem.classList.add('passed');
            } else {
                prizeItem.classList.add('future');
            }
            
            if (CONFIG.SAFE_HAVEN_LEVELS.includes(index + 1)) {
                prizeItem.classList.add('safe');
            }
            
            prizeItem.innerHTML = `
                <div class="prize-rank">${index + 1}</div>
                <div class="prize-amount">${prize.toLocaleString()} $</div>
            `;
            
            prizesList.appendChild(prizeItem);
        });
    }

    showWithdrawModal() {
        const safePrize = gameState.getSafePrize();
        const withdrawAmount = document.getElementById('withdraw-amount');
        
        if (withdrawAmount) {
            withdrawAmount.textContent = safePrize.toLocaleString();
        }
        
        document.getElementById('withdraw-modal').classList.add('active');
    }

    confirmWithdraw() {
        const safePrize = gameState.getSafePrize();
        gameState.score = safePrize;
        
        document.getElementById('withdraw-modal').classList.remove('active');
        this.endGame(false);
    }

    useFiftyFifty() {
        if (!gameState.lifelines.fiftyFifty || !this.currentQuestion) return;
        
        audioManager.play('lifeline');
        
        const correctIndex = this.currentQuestion.correct;
        let wrongOptions = [0, 1, 2, 3].filter(idx => idx !== correctIndex);
        
        // اختيار إجابتين خاطئتين عشوائياً
        wrongOptions.sort(() => Math.random() - 0.5);
        const toRemove = wrongOptions.slice(0, 2);
        
        // إخفاء الإجابتين الخاطئتين
        toRemove.forEach(idx => {
            const card = document.querySelectorAll('.option-card')[idx];
            if (card) {
                card.style.opacity = '0.3';
                card.style.pointerEvents = 'none';
            }
        });
        
        // تحديث حالة المساعدة
        gameState.useLifeline('fiftyFifty');
        this.updateLifelineButton('fifty-fifty');
    }

    useAskAudience() {
        if (!gameState.lifelines.askAudience || !this.currentQuestion) return;
        
        audioManager.play('lifeline');
        
        const correctIndex = this.currentQuestion.correct;
        let percentages = [0, 0, 0, 0];
        
        // إعطاء نسبة عالية للإجابة الصحيحة
        percentages[correctIndex] = 50 + Math.floor(Math.random() * 30);
        
        // توزيع النسب المتبقية
        let remaining = 100 - percentages[correctIndex];
        for (let i = 0; i < 4; i++) {
            if (i !== correctIndex) {
                percentages[i] = Math.floor(Math.random() * remaining);
                remaining -= percentages[i];
            }
        }
        
        // إظهار نتائج تصويت الجمهور
        this.showAudienceResults(percentages);
        
        // تحديث حالة المساعدة
        gameState.useLifeline('askAudience');
        this.updateLifelineButton('ask-audience');
    }

    showAudienceResults(percentages) {
        const letters = ['أ', 'ب', 'ج', 'د'];
        let resultsText = 'تصويت الجمهور:\n\n';
        
        letters.forEach((letter, index) => {
            resultsText += `${letter}: ${percentages[index]}%\n`;
        });
        
        alert(resultsText);
    }

    usePhoneFriend() {
        if (!gameState.lifelines.phoneFriend || !this.currentQuestion) return;
        
        audioManager.play('lifeline');
        
        const correctIndex = this.currentQuestion.correct;
        const confidence = Math.floor(Math.random() * 30) + 70;
        const options = ['أ', 'ب', 'ج', 'د'];
        
        // إظهار إجابة الصديق
        const friendResponse = `الصديق: "أعتقد أن الإجابة الصحيحة هي ${options[correctIndex]}...\nأنا ${confidence}% متأكد"`;
        alert(friendResponse);
        
        // تحديث حالة المساعدة
        gameState.useLifeline('phoneFriend');
        this.updateLifelineButton('phone-friend');
    }

    updateLifelineButton(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = true;
            button.classList.add('disabled');
            button.style.opacity = '0.5';
        }
    }

    toggleSound() {
        const soundBtn = document.getElementById('sound-toggle');
        if (!soundBtn) return;
        
        const icon = soundBtn.querySelector('i');
        const soundEnabled = audioManager.toggle();
        
        if (soundEnabled) {
            icon.className = 'fas fa-volume-up';
            audioManager.play('click');
        } else {
            icon.className = 'fas fa-volume-mute';
            audioManager.stopAll();
        }
    }

    showHelpModal() {
        document.getElementById('help-modal').classList.add('active');
        audioManager.play('click');
    }

    endGame(isWin) {
        // إيقاف المؤقت
        clearInterval(this.currentTimer);
        
        // تحديث حالة اللعبة
        gameState.gameActive = false;
        
        // تشغيل صوت النهاية
        if (isWin) {
            audioManager.play('win');
        } else {
            audioManager.play('lose');
        }
        
        // إيقاف موسيقى الخلفية
        audioManager.stopBackgroundMusic();
        
        // تحديث إحصائيات اللاعب
        gameState.updatePlayerStats(isWin, gameState.score);
        
        // عرض شاشة النتائج
        this.showResultScreen(isWin);
    }

    showResultScreen(isWin) {
        const container = document.getElementById('game-container');
        if (!container) return;
        
        const playTime = gameState.getPlayTime();
        const accuracy = gameState.getAccuracy();
        const remainingLifelines = gameState.getRemainingLifelines();
        const rank = gameState.getRank();
        
        container.innerHTML = `
            <div class="container">
                <div id="result-screen" class="screen active">
                    <div class="result-container">
                        <div class="result-header">
                            <div class="result-badge">
                                <i class="fas fa-${isWin ? 'trophy' : 'sad-tear'}"></i>
                            </div>
                            <h1 id="result-title">${isWin ? 'مبروك! فزت' : 'انتهت اللعبة'}</h1>
                            <p class="result-subtitle">${isWin ? 'لقد أتممت اللعبة بنجاح' : 'للأسف لم تربح المليون'}</p>
                        </div>
                        
                        <div class="result-card">
                            <div class="result-player">
                                <div class="result-avatar">
                                    <i class="fas fa-user"></i>
                                    <div class="avatar-crown">
                                        <i class="fas fa-crown"></i>
                                    </div>
                                </div>
                                <h2 id="result-player-name">${gameState.player.username}</h2>
                                <div class="player-rank">
                                    <i class="fas fa-star"></i>
                                    <span>${rank} - المستوى ${gameState.getPlayerLevel()}</span>
                                </div>
                            </div>
                            
                            <div class="result-prize">
                                <div class="prize-amount-large">
                                    <span class="currency">$</span>
                                    <span id="final-prize">${gameState.score.toLocaleString()}</span>
                                </div>
                                <div class="prize-label">قيمة الجائزة التي ربحتها</div>
                                <div class="prize-breakdown">
                                    <div class="breakdown-item">
                                        <span>الإجابات الصحيحة</span>
                                        <span>${gameState.totalCorrect}</span>
                                    </div>
                                    <div class="breakdown-item">
                                        <span>الأسئلة المجابة</span>
                                        <span>${gameState.currentQuestion + 1}</span>
                                    </div>
                                    <div class="breakdown-item">
                                        <span>نسبة النجاح</span>
                                        <span>${accuracy}%</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="result-stats">
                                <div class="stats-grid">
                                    <div class="stat-box">
                                        <i class="fas fa-clock"></i>
                                        <div class="stat-value">${playTime}</div>
                                        <div class="stat-label">ثانية</div>
                                    </div>
                                    <div class="stat-box">
                                        <i class="fas fa-life-ring"></i>
                                        <div class="stat-value">${CONFIG.LIFELINES_COUNT - remainingLifelines}</div>
                                        <div class="stat-label">مساعدات مستخدمة</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="result-actions">
                                <button class="result-btn primary" id="play-again-btn">
                                    <i class="fas fa-redo"></i>
                                    <span>العب مرة أخرى</span>
                                </button>
                                <button class="result-btn secondary" id="main-menu-btn">
                                    <i class="fas fa-home"></i>
                                    <span>القائمة الرئيسية</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // إضافة أحداث لأزرار النتائج
        setTimeout(() => {
            document.getElementById('play-again-btn')?.addEventListener('click', () => {
                window.location.reload();
            });
            
            document.getElementById('main-menu-btn')?.addEventListener('click', () => {
                window.location.href = 'start.html';
            });
        }, 100);
    }
}

// بدء اللعبة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new MillionaireGame();
});
