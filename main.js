// main.js - النسخة النهائية
import { CONFIG, PRIZES, QUESTION_CATEGORIES } from './config.js';
import { audioManager } from './audioManager.js';
import { gameState } from './gameState.js';
import { QUESTION_BANK } from './question.js';

class MillionaireGame {
    constructor() {
        this.currentTimer = null;
        this.currentQuestion = null;
        this.questions = [];
        this.isInitialized = false;
        this.init();
    }

    async init() {
        console.log(`🎮 ${CONFIG.APP_NAME} - الإصدار ${CONFIG.VERSION}`);
        
        // انتظر حتى تحميل الصفحة بالكامل
        await this.waitForDOM();
        
        // تحميل بيانات اللاعب
        this.loadPlayer();
        
        // إعداد الواجهة
        this.setupUI();
        
        // إعداد الأحداث
        this.setupEventListeners();
        
        // بدء اللعبة
        this.startGame();
        
        this.isInitialized = true;
    }

    waitForDOM() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    loadPlayer() {
        const playerData = JSON.parse(localStorage.getItem('currentUser'));
        const settings = JSON.parse(localStorage.getItem('gameSettings'));
        
        if (!playerData) {
            setTimeout(() => {
                window.location.href = 'start.html';
            }, 1000);
            throw new Error('لا يوجد لاعب مسجل');
        }
        
        gameState.init(playerData);
        if (settings) {
            gameState.settings = settings;
        }
        
        console.log(`👤 اللاعب: ${gameState.player.username}`);
    }

    setupUI() {
        // تحديث معلومات اللاعب
        this.updatePlayerInfo();
        
        // تحديث الإعدادات
        this.updateGameSettings();
        
        // تحديث قائمة الجوائز
        this.updatePrizesList();
        
        // إعداد الموسيقى
        this.setupMusic();
    }

    setupMusic() {
        // تشغيل موسيقى اللعبة الحماسية
        audioManager.play('background_game');
        
        // ضبط مستوى الصوت
        const savedVolume = localStorage.getItem('volume');
        if (savedVolume) {
            audioManager.setVolume(parseFloat(savedVolume));
        }
        
        // تحديث زر الصوت
        this.updateSoundButton();
    }

    updateSoundButton() {
        const soundBtn = document.getElementById('sound-toggle');
        if (soundBtn) {
            const icon = soundBtn.querySelector('i');
            if (audioManager.isEnabled()) {
                icon.className = 'fas fa-volume-up';
            } else {
                icon.className = 'fas fa-volume-mute';
            }
        }
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
            if (gameState.player.isGuest) {
                playerAvatarEl.className = 'fas fa-user-clock';
                playerAvatarEl.style.color = '#95a5a6';
            } else if (gameState.getPlayerLevel() >= 4) {
                playerAvatarEl.className = 'fas fa-crown';
                playerAvatarEl.style.color = '#ffd700';
            } else {
                playerAvatarEl.className = 'fas fa-user';
                playerAvatarEl.style.color = '#3498db';
            }
        }
    }

    updateGameSettings() {
        // إظهار/إخفاء المؤقت حسب الإعدادات
        const timerEl = document.querySelector('.stat-item:nth-child(1)');
        if (timerEl && !gameState.settings.timerEnabled) {
            timerEl.style.opacity = '0.5';
            timerEl.style.pointerEvents = 'none';
        }
    }

    async startGame() {
        try {
            // تحميل الأسئلة
            await this.loadQuestions();
            
            // بدء حالة اللعبة
            gameState.start();
            
            // عرض السؤال الأول مع تأثير
            await this.showQuestionWithEffect();
            
            console.log('🚀 اللعبة بدأت!');
            
        } catch (error) {
            console.error('❌ خطأ في بدء اللعبة:', error);
            this.showError('حدث خطأ في بدء اللعبة. حاول مرة أخرى.');
        }
    }

    async loadQuestions() {
        const { questionType, difficulty } = gameState.settings;
        
        // محاكاة تأخير التحميل
        await this.delay(500);
        
        if (questionType === 'all') {
            this.questions = QUESTION_BANK.getRandomQuestions();
        } else {
            this.questions = QUESTION_BANK.getQuestionsByCategory(
                questionType.toUpperCase(),
                CONFIG.TOTAL_QUESTIONS
            );
        }
        
        // إذا لم يكن هناك أسئلة كافية
        if (this.questions.length < CONFIG.TOTAL_QUESTIONS) {
            const generalQuestions = QUESTION_BANK.getQuestionsByCategory('GENERAL');
            this.questions = [...this.questions, ...generalQuestions]
                .slice(0, CONFIG.TOTAL_QUESTIONS);
        }
        
        console.log(`📚 تم تحميل ${this.questions.length} سؤال`);
    }

    async showQuestionWithEffect() {
        // تأثير ظهور السؤال
        const questionCard = document.querySelector('.question-card');
        if (questionCard) {
            questionCard.style.opacity = '0';
            questionCard.style.transform = 'translateY(20px)';
        }
        
        // عرض السؤال
        this.showQuestion();
        
        // تأثير ظهور تدريجي
        await this.delay(100);
        if (questionCard) {
            questionCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            questionCard.style.opacity = '1';
            questionCard.style.transform = 'translateY(0)';
        }
        
        // تشغيل صوت ظهور السؤال
        audioManager.play('click');
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
        
        // بدء المؤقت إذا كان مفعلاً
        if (gameState.settings.timerEnabled) {
            this.startTimer();
        }
    }

    updateQuestionUI() {
        if (!this.currentQuestion) return;
        
        const questionText = document.getElementById('question-text');
        const questionCategory = document.getElementById('question-category');
        const questionNumber = document.getElementById('q-number');
        const questionDifficulty = document.getElementById('question-difficulty');
        
        if (questionText) {
            questionText.textContent = this.currentQuestion.question;
            // تأثير الكتابة
            questionText.style.animation = 'none';
            setTimeout(() => {
                questionText.style.animation = 'textGlow 2s ease';
            }, 10);
        }
        
        if (questionCategory) {
            questionCategory.textContent = this.currentQuestion.category;
            const categoryInfo = Object.values(QUESTION_CATEGORIES)
                .find(cat => cat.name === this.currentQuestion.category);
            
            if (categoryInfo) {
                questionCategory.style.backgroundColor = categoryInfo.color;
                questionCategory.style.color = '#fff';
                questionCategory.style.fontWeight = 'bold';
            }
        }
        
        if (questionNumber) {
            questionNumber.textContent = gameState.currentQuestion + 1;
            // تأثير الترقيم
            questionNumber.style.transform = 'scale(1.2)';
            setTimeout(() => {
                questionNumber.style.transform = 'scale(1)';
                questionNumber.style.transition = 'transform 0.3s ease';
            }, 300);
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
            questionDifficulty.style.color = this.getDifficultyColor(this.currentQuestion.difficulty);
        }
        
        // تحديث الخيارات مع تأثيرات
        this.updateOptionsWithEffects();
        
        // تحديث الجائزة مع تأثير
        this.updatePrizeDisplay();
        
        // تحديث شريط التقدم
        this.updateProgressBar();
        
        // تحديث نص التلميحة
        this.updateGameTip();
    }

    getDifficultyColor(difficulty) {
        switch(difficulty) {
            case 'easy': return '#27ae60';
            case 'medium': return '#f39c12';
            case 'hard': return '#e74c3c';
            default: return '#95a5a6';
        }
    }

    async updateOptionsWithEffects() {
        const options = ['a', 'b', 'c', 'd'];
        
        for (let i = 0; i < options.length; i++) {
            const optionText = document.getElementById(`option-${options[i]}`);
            if (optionText && this.currentQuestion.options[i]) {
                // إخفاء ثم إظهار مع تأثير
                optionText.style.opacity = '0';
                optionText.style.transform = 'translateX(20px)';
                
                optionText.textContent = this.currentQuestion.options[i];
                
                // ظهور تدريجي مع تأخير
                setTimeout(() => {
                    optionText.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    optionText.style.opacity = '1';
                    optionText.style.transform = 'translateX(0)';
                }, i * 100);
            }
        }
        
        await this.delay(500);
    }

    updatePrizeDisplay() {
        const prize = gameState.getCurrentPrize();
        const currentPrizeEl = document.getElementById('current-prize');
        const totalPrizeEl = document.getElementById('total-prize');
        
        if (currentPrizeEl) {
            // تأثير المال المتزايد
            const oldValue = parseInt(currentPrizeEl.textContent.replace(/,/g, '')) || 0;
            this.animateNumberChange(currentPrizeEl, oldValue, prize, 500);
        }
        
        if (totalPrizeEl) {
            totalPrizeEl.textContent = prize.toLocaleString();
            // تأثير الوميض
            totalPrizeEl.style.animation = 'none';
            setTimeout(() => {
                totalPrizeEl.style.animation = 'prizeGlow 1s ease';
            }, 10);
        }
    }

    animateNumberChange(element, start, end, duration) {
        const startTime = performance.now();
        const updateValue = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(start + (end - start) * progress);
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateValue);
            } else {
                element.textContent = end.toLocaleString();
            }
        };
        
        requestAnimationFrame(updateValue);
    }

    updateProgressBar() {
        const progress = ((gameState.currentQuestion + 1) / CONFIG.TOTAL_QUESTIONS) * 100;
        const progressFill = document.getElementById('progress-fill');
        const progressPercent = document.getElementById('progress-percent');
        
        if (progressFill) {
            // تأثير سلسل للتقدم
            progressFill.style.transition = 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressPercent) {
            this.animateNumberChange(progressPercent, 
                parseFloat(progressPercent.textContent) || 0, 
                progress, 
                800);
        }
        
        // تحديث مستوى اللاعب
        const levelEl = document.getElementById('player-level');
        if (levelEl) {
            const newLevel = Math.min(Math.floor(gameState.currentQuestion / 5) + 1, 3);
            if (parseInt(levelEl.textContent) !== newLevel) {
                levelEl.textContent = newLevel;
                levelEl.style.animation = 'levelUp 0.5s ease';
                audioManager.play('lifeline');
            }
        }
    }

    updateGameTip() {
        const tips = [
            "يمكنك استخدام المساعدات عند الحاجة",
            "خطوط الأمان عند السؤال 5 و 10",
            "انتبه للوقت في كل سؤال",
            "فكر جيداً قبل اختيار الإجابة",
            "يمكنك الانسحاب بأي وقت",
            "كل سؤال يصبح أصعب من الذي قبله",
            "استخدم المساعدات بحكمة",
            "ركز على السؤال الحالي فقط"
        ];
        
        const tipElement = document.getElementById('game-tip');
        if (tipElement && Math.random() < 0.3) {
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            tipElement.style.opacity = '0';
            setTimeout(() => {
                tipElement.textContent = randomTip;
                tipElement.style.opacity = '1';
                tipElement.style.transition = 'opacity 0.5s ease';
            }, 300);
        }
    }

    resetOptions() {
        const optionCards = document.querySelectorAll('.option-card');
        optionCards.forEach((card, index) => {
            card.classList.remove('correct', 'wrong', 'selected');
            card.style.opacity = '1';
            card.style.pointerEvents = 'auto';
            card.style.transform = 'scale(1)';
            card.style.transition = 'all 0.3s ease';
            
            // إعادة تعيين التأثيرات
            const optionLetter = card.querySelector('.option-letter');
            if (optionLetter) {
                optionLetter.style.backgroundColor = '';
                optionLetter.style.transform = 'scale(1)';
            }
        });
        
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.disabled = true;
            nextBtn.classList.add('disabled');
            nextBtn.innerHTML = '<i class="fas fa-arrow-left"></i><span>التالي</span>';
        }
    }

    startTimer() {
        if (!gameState.settings.timerEnabled) return;
        
        let timeLeft = CONFIG.TIME_PER_QUESTION;
        const timerDisplay = document.getElementById('timer');
        
        if (!timerDisplay) return;
        
        timerDisplay.textContent = timeLeft;
        timerDisplay.classList.remove('warning', 'danger');
        timerDisplay.style.color = '';
        
        // إيقاف المؤقت السابق
        clearInterval(this.currentTimer);
        
        // بدء مؤقت جديد
        this.currentTimer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            
            // تغيير الألوان والآثار
            if (timeLeft <= 10) {
                timerDisplay.classList.add('warning');
                timerDisplay.style.color = '#f39c12';
                
                // صوت المؤقت السريع
                if (timeLeft <= 5 && timeLeft > 0) {
                    audioManager.play('timer');
                }
            }
            
            if (timeLeft <= 5) {
                timerDisplay.classList.add('danger');
                timerDisplay.style.color = '#e74c3c';
                timerDisplay.style.animation = 'pulse 0.5s infinite';
            }
            
            if (timeLeft <= 0) {
                clearInterval(this.currentTimer);
                audioManager.play('wrong');
                this.timeUp();
            }
        }, 1000);
    }

    timeUp() {
        // تأثير انتهاء الوقت
        const timerDisplay = document.getElementById('timer');
        if (timerDisplay) {
            timerDisplay.style.animation = 'shake 0.5s ease';
        }
        
        // عرض رسالة
        this.showMessage('انتهى الوقت!', 'error');
        
        // الانتقال للنتيجة بعد تأخير
        setTimeout(() => {
            this.endGame(false);
        }, 1500);
    }

    setupEventListeners() {
        // أحداث الخيارات مع تأثيرات
        this.setupOptionEvents();
        
        // أحداث الأزرار
        this.setupButtonEvents();
        
        // أحداث النوافذ المنبثقة
        this.setupModalEvents();
        
        // أحداث خاصة
        this.setupSpecialEvents();
    }

    setupOptionEvents() {
        const optionIds = ['option-a-card', 'option-b-card', 'option-c-card', 'option-d-card'];
        
        optionIds.forEach((id, index) => {
            const card = document.getElementById(id);
            if (card) {
                // إزالة الأحداث القديمة أولاً
                card.replaceWith(card.cloneNode(true));
                const newCard = document.getElementById(id);
                
                // إضافة أحداث جديدة
                newCard.addEventListener('click', () => this.handleOptionClick(index));
                newCard.addEventListener('mouseenter', () => this.handleOptionHover(index, true));
                newCard.addEventListener('mouseleave', () => this.handleOptionHover(index, false));
            }
        });
    }

    handleOptionClick(index) {
        if (gameState.answered || !gameState.gameActive) return;
        
        // تأثير النقر
        const card = document.querySelectorAll('.option-card')[index];
        if (card) {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 150);
        }
        
        audioManager.play('click');
        this.checkAnswer(index);
    }

    handleOptionHover(index, isEnter) {
        if (gameState.answered || !gameState.gameActive) return;
        
        const card = document.querySelectorAll('.option-card')[index];
        const letter = card?.querySelector('.option-letter');
        
        if (isEnter) {
            if (card) card.style.transform = 'translateY(-3px)';
            if (letter) {
                letter.style.backgroundColor = '#ffd700';
                letter.style.transform = 'scale(1.1)';
                letter.style.transition = 'all 0.2s ease';
            }
        } else {
            if (card) card.style.transform = 'translateY(0)';
            if (letter) {
                letter.style.backgroundColor = '';
                letter.style.transform = 'scale(1)';
            }
        }
    }

    setupButtonEvents() {
        // زر التالي
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                audioManager.play('click');
                this.nextQuestion();
            });
        }
        
        // زر الانسحاب
        const withdrawBtn = document.getElementById('withdraw-btn');
        if (withdrawBtn) {
            withdrawBtn.addEventListener('click', () => {
                audioManager.play('withdraw');
                this.showWithdrawModal();
            });
        }
        
        // المساعدات
        this.setupLifelineEvents();
        
        // التحكم بالصوت
        const soundBtn = document.getElementById('sound-toggle');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => this.toggleSound());
        }
        
        // التعليمات
        const helpBtn = document.getElementById('help-btn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                audioManager.play('click');
                this.showHelpModal();
            });
        }
    }

    setupLifelineEvents() {
        const lifelines = {
            'fifty-fifty': () => this.useFiftyFifty(),
            'ask-audience': () => this.useAskAudience(),
            'phone-friend': () => this.usePhoneFriend()
        };
        
        Object.entries(lifelines).forEach(([id, handler]) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => {
                    if (!btn.disabled) {
                        audioManager.play('lifeline');
                        handler();
                    }
                });
                
                // تأثير التمرير
                btn.addEventListener('mouseenter', () => {
                    if (!btn.disabled) {
                        btn.style.transform = 'scale(1.05) rotate(5deg)';
                    }
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = '';
                });
            }
        });
    }

    setupModalEvents() {
        // نافذة الانسحاب
        document.getElementById('confirm-withdraw')?.addEventListener('click', () => {
            audioManager.play('withdraw');
            this.confirmWithdraw();
        });
        
        document.getElementById('continue-playing')?.addEventListener('click', () => {
            audioManager.play('click');
            document.getElementById('withdraw-modal').classList.remove('active');
        });
        
        document.getElementById('close-withdraw')?.addEventListener('click', () => {
            audioManager.play('click');
            document.getElementById('withdraw-modal').classList.remove('active');
        });
        
        // نافذة التعليمات
        document.getElementById('start-after-help')?.addEventListener('click', () => {
            audioManager.play('click');
            document.getElementById('help-modal').classList.remove('active');
        });
        
        document.getElementById('close-help')?.addEventListener('click', () => {
            audioManager.play('click');
            document.getElementById('help-modal').classList.remove('active');
        });
    }

    setupSpecialEvents() {
        // إعادة تحميل عند الضغط على F5
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F5') {
                e.preventDefault();
                audioManager.play('click');
                window.location.reload();
            }
        });
        
        // حفظ التقدم عند الخروج
        window.addEventListener('beforeunload', () => {
            gameState.saveProgress();
        });
    }

    checkAnswer(selectedIndex) {
        if (gameState.answered || !gameState.gameActive) return;
        
        gameState.answered = true;
        
        // إيقاف المؤقت
        clearInterval(this.currentTimer);
        
        const isCorrect = gameState.checkAnswer(selectedIndex, this.currentQuestion.correct);
        
        // تلوين الإجابات مع تأثيرات
        this.highlightAnswers(selectedIndex, isCorrect);
        
        // التأخير ثم التعامل مع النتيجة
        setTimeout(() => {
            if (isCorrect) {
                this.handleCorrectAnswer();
            } else {
                this.handleWrongAnswer();
            }
            
            // تحديث قائمة الجوائز
            this.updatePrizesList();
            
        }, 1500);
    }

    highlightAnswers(selectedIndex, isCorrect) {
        const optionCards = document.querySelectorAll('.option-card');
        const selectedCard = optionCards[selectedIndex];
        const correctCard = optionCards[this.currentQuestion.correct];
        
        // تعطيل جميع البطاقات
        optionCards.forEach(card => {
            card.style.pointerEvents = 'none';
        });
        
        // التأثير على البطاقة المختارة
        if (selectedCard) {
            if (isCorrect) {
                selectedCard.classList.add('correct');
                audioManager.play('correct');
                this.animateCorrectAnswer(selectedCard);
            } else {
                selectedCard.classList.add('wrong');
                audioManager.play('wrong');
                this.animateWrongAnswer(selectedCard);
            }
        }
        
        // إظهار الإجابة الصحيحة إذا كانت خاطئة
        if (!isCorrect && correctCard) {
            setTimeout(() => {
                correctCard.classList.add('correct');
                this.animateCorrectAnswer(correctCard);
            }, 800);
        }
    }

    animateCorrectAnswer(card) {
        card.style.animation = 'correctPulse 0.5s ease';
        
        const letter = card.querySelector('.option-letter');
        if (letter) {
            letter.style.backgroundColor = '#27ae60';
            letter.style.color = 'white';
            letter.style.transform = 'scale(1.2)';
        }
        
        const checkMark = card.querySelector('.option-check');
        if (checkMark) {
            checkMark.style.opacity = '1';
            checkMark.style.transform = 'scale(1) rotate(360deg)';
            checkMark.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }
    }

    animateWrongAnswer(card) {
        card.style.animation = 'shake 0.5s ease';
        
        const letter = card.querySelector('.option-letter');
        if (letter) {
            letter.style.backgroundColor = '#e74c3c';
            letter.style.color = 'white';
        }
    }

    handleCorrectAnswer() {
        // تحديث الجائزة
        this.updatePrizeDisplay();
        
        // تشغيل صوت إضافي للنصر الصغير
        setTimeout(() => {
            audioManager.play('click');
        }, 500);
        
        // التحقق إذا كانت هذه آخر سؤال
        if (gameState.currentQuestion < this.questions.length - 1) {
            // تفعيل زر التالي مع تأثير
            setTimeout(() => {
                const nextBtn = document.getElementById('next-btn');
                if (nextBtn) {
                    nextBtn.disabled = false;
                    nextBtn.classList.remove('disabled');
                    nextBtn.style.animation = 'pulse 2s infinite';
                    nextBtn.innerHTML = '<i class="fas fa-arrow-left"></i><span>التالي - $' + 
                                        gameState.getCurrentPrize().toLocaleString() + '</span>';
                }
            }, 1000);
        } else {
            // إنهاء اللعبة بالفوز
            setTimeout(() => {
                audioManager.play('win');
                this.endGame(true);
            }, 2000);
        }
    }

    handleWrongAnswer() {
        // إنهاء اللعبة بالخسارة بعد تأخير
        setTimeout(() => {
            audioManager.play('lose');
            this.endGame(false);
        }, 2000);
    }

    nextQuestion() {
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.style.animation = 'none';
        }
        
        if (gameState.nextQuestion()) {
            this.showQuestionWithEffect();
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
                prizeItem.style.animation = 'currentPrizeGlow 2s infinite';
            } else if (index < gameState.currentQuestion) {
                prizeItem.classList.add('passed');
            } else {
                prizeItem.classList.add('future');
            }
            
            if (CONFIG.SAFE_HAVEN_LEVELS.includes(index + 1)) {
                prizeItem.classList.add('safe');
                prizeItem.title = 'خط أمان - الجائزة مضمونة';
            }
            
            prizeItem.innerHTML = `
                <div class="prize-rank">${index + 1}</div>
                <div class="prize-amount">${prize.toLocaleString()} $</div>
            `;
            
            // تأثير عند إضافة العنصر
            prizeItem.style.opacity = '0';
            prizeItem.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                prizeItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                prizeItem.style.opacity = '1';
                prizeItem.style.transform = 'translateX(0)';
            }, index * 30);
            
            prizesList.appendChild(prizeItem);
        });
        
        // التمرير إلى الجائزة الحالية
        const currentPrize = prizesList.querySelector('.prize-item.current');
        if (currentPrize) {
            setTimeout(() => {
                currentPrize.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 500);
        }
    }

    showWithdrawModal() {
        const safePrize = gameState.getSafePrize();
        const withdrawAmount = document.getElementById('withdraw-amount');
        
        if (withdrawAmount) {
            // تأثير ظهور المبلغ
            withdrawAmount.textContent = '0';
            setTimeout(() => {
                this.animateNumberChange(withdrawAmount, 0, safePrize, 1000);
            }, 300);
        }
        
        // إظهار النافذة مع تأثير
        const modal = document.getElementById('withdraw-modal');
        if (modal) {
            modal.classList.add('active');
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.transition = 'opacity 0.3s ease';
                modal.style.opacity = '1';
            }, 10);
        }
    }

    confirmWithdraw() {
        const safePrize = gameState.getSafePrize();
        gameState.score = safePrize;
        
        // إغلاق النافذة
        const modal = document.getElementById('withdraw-modal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.classList.remove('active');
            }, 300);
        }
        
        // الانتقال لشاشة النتائج
        setTimeout(() => {
            this.endGame(false);
        }, 500);
    }

    useFiftyFifty() {
        if (!gameState.lifelines.fiftyFifty || !this.currentQuestion) return;
        
        const correctIndex = this.currentQuestion.correct;
        let wrongOptions = [0, 1, 2, 3].filter(idx => idx !== correctIndex);
        
        // اختيار إجابتين خاطئتين عشوائياً
        wrongOptions.sort(() => Math.random() - 0.5);
        const toRemove = wrongOptions.slice(0, 2);
        
        // تأثير إخفاء الإجابات
        toRemove.forEach((idx, i) => {
            setTimeout(() => {
                const card = document.querySelectorAll('.option-card')[idx];
                if (card) {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '0.3';
                    card.style.pointerEvents = 'none';
                    card.style.filter = 'grayscale(80%)';
                    
                    // تأثير اهتزاز
                    card.style.animation = 'shake 0.3s ease';
                }
            }, i * 200);
        });
        
        // تحديث حالة المساعدة
        gameState.useLifeline('fiftyFifty');
        this.updateLifelineButton('fifty-fifty', 'تم الاستخدام');
    }

    useAskAudience() {
        if (!gameState.lifelines.askAudience || !this.currentQuestion) return;
        
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
        
        // إظهار نتائج تصويت الجمهور بفنيات
        this.showAudienceResults(percentages);
        
        // تحديث حالة المساعدة
        gameState.useLifeline('askAudience');
        this.updateLifelineButton('ask-audience', 'تم الاستخدام');
    }

    showAudienceResults(percentages) {
        const letters = ['أ', 'ب', 'ج', 'د'];
        let resultsHTML = `
            <div style="text-align: center; padding: 20px;">
                <h3 style="color: #ffd700; margin-bottom: 20px;">
                    <i class="fas fa-users"></i> تصويت الجمهور
                </h3>
                <div style="display: flex; justify-content: space-around; margin: 30px 0;">
        `;
        
        letters.forEach((letter, index) => {
            const percentage = percentages[index];
            const isCorrect = index === this.currentQuestion.correct;
            
            resultsHTML += `
                <div style="text-align: center;">
                    <div style="
                        width: 60px;
                        height: ${percentage * 1.5}px;
                        background: ${isCorrect ? '#27ae60' : '#3498db'};
                        margin: 0 auto 10px;
                        border-radius: 10px 10px 0 0;
                        transition: height 1s ease;
                        position: relative;
                    ">
                        <div style="
                            position: absolute;
                            top: -25px;
                            left: 0;
                            right: 0;
                            color: white;
                            font-weight: bold;
                        ">${percentage}%</div>
                    </div>
                    <div style="
                        width: 50px;
                        height: 50px;
                        background: ${isCorrect ? '#2ecc71' : '#2980b9'};
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto;
                        color: white;
                        font-weight: bold;
                        font-size: 1.2rem;
                    ">${letter}</div>
                </div>
            `;
        });
        
        resultsHTML += `
                </div>
                <p style="color: #95a5a6; font-style: italic;">
                    بناءً على تصويت 1000 مشاهد
                </p>
            </div>
        `;
        
        this.showModal('تصويت الجمهور', resultsHTML);
    }

    usePhoneFriend() {
        if (!gameState.lifelines.phoneFriend || !this.currentQuestion) return;
        
        const correctIndex = this.currentQuestion.correct;
        const confidence = Math.floor(Math.random() * 30) + 70;
        const options = ['أ', 'ب', 'ج', 'د'];
        const friendNames = ['أحمد', 'محمد', 'خالد', 'علي', 'فاطمة', 'سارة'];
        const friendName = friendNames[Math.floor(Math.random() * friendNames.length)];
        
        // إظهار إجابة الصديق بفنيات
        const phoneHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, #3498db, #2980b9);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    animation: pulse 2s infinite;
                ">
                    <i class="fas fa-phone-alt" style="font-size: 2.5rem; color: white;"></i>
                </div>
                
                <h3 style="color: #ffd700; margin-bottom: 10px;">
                    ${friendName} يتصل...
                </h3>
                
                <div style="
                    background: rgba(255, 255, 255, 0.1);
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                    border-left: 4px solid #3498db;
                ">
                    <p style="font-size: 1.1rem; line-height: 1.6;">
                        "أعتقد أن الإجابة الصحيحة هي 
                        <span style="color: #ffd700; font-weight: bold;">${options[correctIndex]}</span>..."
                    </p>
                </div>
                
                <div style="margin-top: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>ثقة الصديق:</span>
                        <span style="color: #ffd700; font-weight: bold;">${confidence}%</span>
                    </div>
                    <div style="
                        width: 100%;
                        height: 10px;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 5px;
                        overflow: hidden;
                    ">
                        <div style="
                            width: ${confidence}%;
                            height: 100%;
                            background: linear-gradient(90deg, #2ecc71, #27ae60);
                            border-radius: 5px;
                            transition: width 1.5s ease;
                        "></div>
                    </div>
                </div>
            </div>
        `;
        
        this.showModal('الاتصال بصديق', phoneHTML);
        
        // تحديث حالة المساعدة
        gameState.useLifeline('phoneFriend');
        this.updateLifelineButton('phone-friend', 'تم الاتصال');
    }

    updateLifelineButton(buttonId, text = '') {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = true;
            button.classList.add('disabled');
            button.style.opacity = '0.7';
            button.style.transform = 'scale(0.95)';
            
            if (text) {
                const textEl = button.querySelector('.lifeline-text');
                if (textEl) {
                    textEl.textContent = text;
                    textEl.style.color = '#95a5a6';
                }
            }
            
            // تغيير لون الأيقونة
            const icon = button.querySelector('.lifeline-icon');
            if (icon) {
                icon.style.background = 'rgba(149, 165, 166, 0.2)';
                icon.querySelector('i').style.color = '#95a5a6';
            }
        }
    }

    showModal(title, content) {
        // إنشاء نافذة مخصصة
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <h3><i class="fas fa-info-circle"></i> ${title}</h3>
                    <button class="modal-close" id="custom-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">${content}</div>
                <div class="modal-footer">
                    <button class="modal-btn" id="custom-modal-ok">حسناً</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // إظهار مع تأثير
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // إضافة أحداث الإغلاق
        const closeBtn = document.getElementById('custom-modal-close');
        const okBtn = document.getElementById('custom-modal-ok');
        
        const closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
            }, 300);
        };
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (okBtn) okBtn.addEventListener('click', closeModal);
        
        // إغلاق عند النقر خارج النافذة
        modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    }

    toggleSound() {
        const soundEnabled = audioManager.toggle();
        this.updateSoundButton();
        
        // تشغيل صوت للتأكيد
        if (soundEnabled) {
            audioManager.play('click');
        }
        
        // رسالة تأكيد
        this.showMessage(
            soundEnabled ? 'تم تشغيل الصوت 🔊' : 'تم إيقاف الصوت 🔇',
            'info'
        );
    }

    showHelpModal() {
        document.getElementById('help-modal').classList.add('active');
    }

    endGame(isWin) {
        // إيقاف المؤقت
        clearInterval(this.currentTimer);
        
        // إيقاف موسيقى الخلفية
        audioManager.stopBackgroundMusic();
        
        // تشغيل موسيقى النتيجة
        if (isWin) {
            audioManager.play('win');
        } else {
            audioManager.play('lose');
        }
        
        // تحديث حالة اللعبة
        gameState.gameActive = false;
        
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
        const level = gameState.getPlayerLevel();
        
        // جمع الإحصائيات
        const stats = {
            correctAnswers: gameState.totalCorrect,
            totalQuestions: gameState.currentQuestion + 1,
            accuracy: accuracy,
            timeSpent: playTime,
            lifelinesUsed: CONFIG.LIFELINES_COUNT - remainingLifelines,
            finalPrize: gameState.score,
            rank: rank,
            level: level
        };
        
        // حفظ الإحصائيات
        this.saveGameStats(stats);
        
        // إنشاء شاشة النتائج
        container.innerHTML = this.createResultScreen(isWin, stats);
        
        // إضافة أحداث الأزرار
        setTimeout(() => {
            this.setupResultEvents();
        }, 100);
    }

    createResultScreen(isWin, stats) {
        const { correctAnswers, totalQuestions, accuracy, timeSpent, lifelinesUsed, finalPrize, rank, level } = stats;
        
        return `
            <div class="container">
                <div id="result-screen" class="screen active">
                    <div class="result-container">
                        <!-- الرأس -->
                        <div class="result-header">
                            <div class="result-badge">
                                <i class="fas fa-${isWin ? 'trophy' : 'gem'}"></i>
                            </div>
                            <h1 id="result-title" style="
                                background: linear-gradient(45deg, ${isWin ? '#ffd700, #ff9800' : '#3498db, #2980b9'});
                                -webkit-background-clip: text;
                                background-clip: text;
                                color: transparent;
                            ">
                                ${isWin ? '🎉 مبروك! فزت 🎉' : '🎯 انتهت اللعبة 🎯'}
                            </h1>
                            <p class="result-subtitle">
                                ${isWin ? 'لقد حققت المستحيل!' : 'لكنك لعبت بشجاعة!'}
                            </p>
                        </div>
                        
                        <!-- معلومات اللاعب -->
                        <div class="result-card">
                            <div class="result-player">
                                <div class="result-avatar">
                                    <i class="fas fa-${level >= 4 ? 'crown' : 'user'}"></i>
                                    <div class="avatar-crown">
                                        <i class="fas fa-star"></i>
                                    </div>
                                </div>
                                <h2 id="result-player-name">${gameState.player.username}</h2>
                                <div class="player-rank">
                                    <i class="fas fa-${rank === 'مليونير' ? 'crown' : 'award'}"></i>
                                    <span>${rank} - المستوى ${level}</span>
                                </div>
                            </div>
                            
                            <!-- الجائزة -->
                            <div class="result-prize">
                                <div class="prize-amount-large">
                                    <span class="currency">$</span>
                                    <span id="final-prize">0</span>
                                </div>
                                <div class="prize-label">قيمة الجائزة التي ربحتها</div>
                                <div class="prize-breakdown">
                                    <div class="breakdown-item">
                                        <i class="fas fa-check-circle"></i>
                                        <span>الإجابات الصحيحة</span>
                                        <span>${correctAnswers}</span>
                                    </div>
                                    <div class="breakdown-item">
                                        <i class="fas fa-question-circle"></i>
                                        <span>الأسئلة المجابة</span>
                                        <span>${totalQuestions}</span>
                                    </div>
                                    <div class="breakdown-item">
                                        <i class="fas fa-chart-line"></i>
                                        <span>نسبة النجاح</span>
                                        <span>${accuracy}%</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- الإحصائيات -->
                            <div class="result-stats">
                                <div class="stats-grid">
                                    <div class="stat-box">
                                        <i class="fas fa-clock" style="color: #3498db;"></i>
                                        <div class="stat-value">${timeSpent}</div>
                                        <div class="stat-label">ثانية</div>
                                    </div>
                                    <div class="stat-box">
                                        <i class="fas fa-life-ring" style="color: #e74c3c;"></i>
                                        <div class="stat-value">${lifelinesUsed}</div>
                                        <div class="stat-label">مساعدات مستخدمة</div>
                                    </div>
                                    <div class="stat-box">
                                        <i class="fas fa-star" style="color: #ffd700;"></i>
                                        <div class="stat-value">${level}</div>
                                        <div class="stat-label">المستوى</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- رسالة خاصة -->
                            <div style="
                                background: rgba(255, 255, 255, 0.05);
                                padding: 20px;
                                border-radius: var(--border-radius);
                                margin: 20px 0;
                                border-left: 4px solid ${isWin ? '#2ecc71' : '#e74c3c'};
                            ">
                                <p style="text-align: center; color: rgba(255, 255, 255, 0.9);">
                                    <i class="fas fa-quote-left"></i>
                                    ${this.getResultMessage(isWin, stats)}
                                    <i class="fas fa-quote-right"></i>
                                </p>
                            </div>
                            
                            <!-- الأزرار -->
                            <div class="result-actions">
                                <button class="result-btn primary" id="play-again-btn">
                                    <i class="fas fa-redo"></i>
                                    <span>العب مرة أخرى</span>
                                </button>
                                <button class="result-btn secondary" id="main-menu-btn">
                                    <i class="fas fa-home"></i>
                                    <span>القائمة الرئيسية</span>
                                </button>
                                <button class="result-btn outline" id="share-btn">
                                    <i class="fas fa-share-alt"></i>
                                    <span>شارك النتيجة</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes countUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                #final-prize {
                    animation: countUp 2s ease forwards;
                }
            </style>
        `;
    }

    getResultMessage(isWin, stats) {
        const messages = {
            win: [
                "إنجاز رائع! لقد أثبتت أنك جدير بلقب المليونير!",
                "عبقرية في الإجابة! أنت مثال للذكاء والمعرفة!",
                "تهانينا! لقد وصلت إلى القمة بجدارة واستحقاق!",
                "أداء مذهل! لقد حطمت جميع التوقعات!"
            ],
            lose: [
                "محاولة شجاعة! كل خسارة هي خطوة نحو النصر!",
                "أداء جيد! المهم أنك تعلمت وجربت!",
                "لا تستسلم! العظماء يقعون وينهضون أقوى!",
                "لعبة رائعة! المرة القادمة ستكون فرصتك!"
            ]
        };
        
        const category = isWin ? 'win' : 'lose';
        const randomIndex = Math.floor(Math.random() * messages[category].length);
        return messages[category][randomIndex];
    }

    saveGameStats(stats) {
        const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
        const history = gameStats.history || [];
        
        history.push({
            ...stats,
            player: gameState.player.username,
            date: new Date().toISOString(),
            isWin: stats.finalPrize >= 1000000
        });
        
        // حفظ آخر 50 لعبة فقط
        gameStats.history = history.slice(-50);
        gameStats.totalGames = (gameStats.totalGames || 0) + 1;
        
        if (stats.finalPrize >= 1000000) {
            gameStats.totalWins = (gameStats.totalWins || 0) + 1;
        }
        
        localStorage.setItem('gameStats', JSON.stringify(gameStats));
    }

    setupResultEvents() {
        // زر اللعب مرة أخرى
        document.getElementById('play-again-btn')?.addEventListener('click', () => {
            audioManager.play('start');
            setTimeout(() => {
                window.location.reload();
            }, 500);
        });
        
        // زر القائمة الرئيسية
        document.getElementById('main-menu-btn')?.addEventListener('click', () => {
            audioManager.play('click');
            setTimeout(() => {
                window.location.href = 'start.html';
            }, 500);
        });
        
        // زر المشاركة
        document.getElementById('share-btn')?.addEventListener('click', () => {
            this.shareResult();
        });
        
        // تأثير عد الجائزة
        const finalPrizeEl = document.getElementById('final-prize');
        if (finalPrizeEl) {
            this.animateNumberChange(finalPrizeEl, 0, gameState.score, 2000);
        }
    }

    shareResult() {
        const shareText = `🏆 حققت $${gameState.score.toLocaleString()} في لعبة المليونير الذهبي! 
        ${gameState.totalCorrect}/${gameState.currentQuestion + 1} إجابة صحيحة
        ${gameState.getAccuracy()}% دقة
        جرب اللعبة الآن!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'نتيجتي في المليونير الذهبي',
                text: shareText,
                url: window.location.href
            });
        } else {
            // نسخ للنص
            navigator.clipboard.writeText(shareText).then(() => {
                this.showMessage('تم نسخ النتيجة للحافظة! 📋', 'success');
            });
        }
    }

    showMessage(message, type = 'info') {
        // إنشاء عنصر الرسالة
        const messageEl = document.createElement('div');
        messageEl.className = 'game-message';
        messageEl.innerHTML = `
            <div class="message-content">
                <i class="fas fa-${this.getMessageIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // إضافة التصميم
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getMessageColor(type)};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideIn 0.5s ease;
            max-width: 400px;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(messageEl);
        
        // إزالة الرسالة بعد 3 ثوان
        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.5s ease forwards';
            setTimeout(() => {
                messageEl.remove();
            }, 500);
        }, 3000);
    }

    getMessageIcon(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }

    getMessageColor(type) {
        switch(type) {
            case 'success': return 'linear-gradient(135deg, #27ae60, #229954)';
            case 'error': return 'linear-gradient(135deg, #e74c3c, #c0392b)';
            case 'warning': return 'linear-gradient(135deg, #f39c12, #e67e22)';
            default: return 'linear-gradient(135deg, #3498db, #2980b9)';
        }
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// بدء اللعبة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    try {
        const game = new MillionaireGame();
        
        // إضافة CSS إضافي للأنيميشن
        const style = document.createElement('style');
        style.textContent = `
            @keyframes textGlow {
                0%, 100% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
                50% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
            }
            
            @keyframes prizeGlow {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            @keyframes currentPrizeGlow {
                0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
                50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.6); }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            
            @keyframes correctPulse {
                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(39, 174, 96, 0.7); }
                70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(39, 174, 96, 0); }
                100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(39, 174, 96, 0); }
            }
            
            @keyframes levelUp {
                0% { transform: scale(1); }
                50% { transform: scale(1.3); }
                100% { transform: scale(1); }
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            .game-message {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                animation: slideIn 0.5s ease;
            }
            
            .game-message .message-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .screen {
                animation: fadeInUp 0.6s ease forwards;
            }
        `;
        document.head.appendChild(style);
        
    } catch (error) {
        console.error('❌ فشل بدء اللعبة:', error);
        document.body.innerHTML = `
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background: linear-gradient(135deg, #0c2461, #1e3799);
                color: white;
                text-align: center;
                padding: 20px;
            ">
                <div>
                    <h1 style="color: #ffd700; margin-bottom: 20px;">
                        <i class="fas fa-exclamation-triangle"></i> خطأ
                    </h1>
                    <p style="margin-bottom: 20px; font-size: 1.2rem;">
                        حدث خطأ في تحميل اللعبة
                    </p>
                    <button onclick="window.location.href='start.html'" style="
                        background: linear-gradient(135deg, #ffd700, #ff9800);
                        border: none;
                        padding: 15px 30px;
                        border-radius: 10px;
                        color: #0c2461;
                        font-weight: bold;
                        cursor: pointer;
                        font-size: 1.1rem;
                    ">
                        <i class="fas fa-redo"></i> حاول مرة أخرى
                    </button>
                </div>
            </div>
        `;
    }
});
