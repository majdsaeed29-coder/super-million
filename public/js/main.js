// main.js - الملف الرئيسي الكامل
import { CONFIG, PRIZES } from './config.js';

class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.playerName = '';
        this.currentQuestion = 0;
        this.score = 0;
        this.totalCorrect = 0;
        this.totalTime = 0;
        this.lifelines = {
            fiftyFifty: true,
            askAudience: true,
            phoneFriend: true
        };
        this.usedQuestions = [];
        this.gameActive = false;
        this.isPaused = false;
        this.selectedOption = null;
        this.startTime = null;
        this.answered = false;
    }

    start(playerName) {
        this.reset();
        this.playerName = playerName;
        this.gameActive = true;
        this.startTime = Date.now();
        this.usedQuestions = [];
    }

    nextQuestion() {
        if (this.currentQuestion < CONFIG.TOTAL_QUESTIONS - 1) {
            this.currentQuestion++;
            this.selectedOption = null;
            this.answered = false;
            return true;
        }
        return false;
    }

    updateScore(isCorrect) {
        if (isCorrect) {
            this.score = PRIZES[this.currentQuestion];
            this.totalCorrect++;
        }
    }

    getCurrentPrize() {
        return PRIZES[this.currentQuestion] || 0;
    }

    getSafePrize() {
        for (let i = this.currentQuestion; i >= 0; i--) {
            if (CONFIG.SAFE_HAVEN_LEVELS.includes(i + 1) || i === 0) {
                return PRIZES[i];
            }
        }
        return 0;
    }

    useLifeline(lifeline) {
        if (this.lifelines[lifeline]) {
            this.lifelines[lifeline] = false;
            return true;
        }
        return false;
    }

    getRemainingLifelines() {
        return Object.values(this.lifelines).filter(v => v).length;
    }

    getPlayTime() {
        if (!this.startTime) return 0;
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    getAccuracy() {
        if (this.currentQuestion === 0) return 0;
        return Math.round((this.totalCorrect / (this.currentQuestion + 1)) * 100);
    }
}

class MillionaireGame {
    constructor() {
        this.gameState = new GameState();
        this.currentTimer = null;
        this.questions = [];
        this.currentQuestionObj = null;
        this.init();
    }

    init() {
        console.log(`${CONFIG.APP_NAME} - الإصدار ${CONFIG.VERSION}`);
        
        this.gameState.playerName = localStorage.getItem('millionairePlayerName') || 'اللاعب';
        
        if (!this.gameState.playerName) {
            this.redirectToStart();
            return;
        }
        
        this.startGame();
    }

    redirectToStart() {
        const container = document.getElementById('game-container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 50px;">
                    <h1>الرجاء إدخال اسمك أولاً</h1>
                    <p>سيتم توجيهك لشاشة البداية خلال 3 ثوان...</p>
                </div>
            `;
        }
        
        setTimeout(() => {
            window.location.href = 'start.html';
        }, 3000);
    }

    startGame() {
        this.gameState.start(this.gameState.playerName);
        this.loadQuestions();
        this.updateUI();
        this.setupEventListeners();
        this.showQuestion();
    }

    loadQuestions() {
        this.questions = [
            {
                id: 1,
                question: "ما هي عاصمة فرنسا؟",
                options: ["لندن", "برلين", "باريس", "مدريد"],
                correct: 2,
                category: "جغرافيا",
                difficulty: "سهل",
                hint: "مدينة النور"
            },
            {
                id: 2,
                question: "كم عدد أيام الأسبوع؟",
                options: ["5", "6", "7", "8"],
                correct: 2,
                category: "معلومات عامة",
                difficulty: "سهل",
                hint: "بداية من السبت"
            },
            {
                id: 3,
                question: "ما هو الكوكب الأحمر؟",
                options: ["الزهرة", "المريخ", "المشتري", "زحل"],
                correct: 1,
                category: "علوم",
                difficulty: "سهل",
                hint: "سمي بلونه المميز"
            },
            {
                id: 4,
                question: "ما هو لون التفاحة الناضجة؟",
                options: ["أخضر", "أصفر", "أحمر", "بنفسجي"],
                correct: 2,
                category: "معلومات عامة",
                difficulty: "سهل",
                hint: "لون شائع للتفاح"
            },
            {
                id: 5,
                question: "كم عدد أحرف اللغة العربية؟",
                options: ["26", "28", "30", "32"],
                correct: 1,
                category: "لغة",
                difficulty: "سهل",
                hint: "عدد الحروف"
            },
            {
                id: 6,
                question: "من هو مؤسس الدولة الأموية؟",
                options: ["معاوية بن أبي سفيان", "عمر بن الخطاب", "علي بن أبي طالب", "عثمان بن عفان"],
                correct: 0,
                category: "تاريخ",
                difficulty: "متوسط",
                hint: "ابن أبي سفيان"
            },
            {
                id: 7,
                question: "ما هو العنصر الكيميائي برمزه 'O'؟",
                options: ["ذهب", "أكسجين", "فضة", "نحاس"],
                correct: 1,
                category: "علوم",
                difficulty: "متوسط",
                hint: "ضروري للتنفس"
            },
            {
                id: 8,
                question: "في أي دولة تقع برج إيفل؟",
                options: ["إيطاليا", "فرنسا", "إسبانيا", "ألمانيا"],
                correct: 1,
                category: "جغرافيا",
                difficulty: "متوسط",
                hint: "عاصمتها باريس"
            },
            {
                id: 9,
                question: "ما هو الحيوان الوطني لأستراليا؟",
                options: ["الكنغر", "الدب", "الأسد", "النمر"],
                correct: 0,
                category: "معلومات عامة",
                difficulty: "متوسط",
                hint: "يقفز"
            },
            {
                id: 10,
                question: "من كتب رواية 'البؤساء'؟",
                options: ["فيكتور هوغو", "شارل ديكنز", "ليو تولستوي", "جورج أورويل"],
                correct: 0,
                category: "أدب",
                difficulty: "متوسط",
                hint: "كاتب فرنسي"
            },
            {
                id: 11,
                question: "كم عدد غرف البيت الأبيض؟",
                options: ["132", "147", "156", "168"],
                correct: 0,
                category: "معلومات عامة",
                difficulty: "صعب",
                hint: "مقر الرئيس الأمريكي"
            },
            {
                id: 12,
                question: "ما هو أسرع حيوان بري؟",
                options: ["الفهد", "الأسد", "النمر", "الذئب"],
                correct: 0,
                category: "علوم",
                difficulty: "صعب",
                hint: "يملك بقعاً"
            },
            {
                id: 13,
                question: "من هو مخترع الهاتف؟",
                options: ["غراهام بيل", "توماس إديسون", "نيكولا تيسلا", "ألكسندر بوبوف"],
                correct: 0,
                category: "تاريخ",
                difficulty: "صعب",
                hint: "اخترع عام 1876"
            },
            {
                id: 14,
                question: "ما هي أكبر صحراء في العالم؟",
                options: ["الصحراء الكبرى", "صحراء الربع الخالي", "صحراء جوبي", "صحراء أنتاركتيكا"],
                correct: 3,
                category: "جغرافيا",
                difficulty: "صعب",
                hint: "في القارة القطبية الجنوبية"
            },
            {
                id: 15,
                question: "كم عدد عظام جسم الإنسان البالغ؟",
                options: ["206", "214", "198", "220"],
                correct: 0,
                category: "علوم",
                difficulty: "صعب",
                hint: "رقم معروف"
            }
        ];
    }

    updateUI() {
        const playerNameEl = document.getElementById('current-player');
        if (playerNameEl) {
            playerNameEl.textContent = this.gameState.playerName;
        }
        
        const levelEl = document.getElementById('player-level');
        if (levelEl) {
            levelEl.textContent = Math.min(Math.floor(this.gameState.currentQuestion / 5) + 1, 3);
        }
    }

    showQuestion() {
        if (this.gameState.currentQuestion >= this.questions.length) {
            this.endGame(true);
            return;
        }

        this.currentQuestionObj = this.questions[this.gameState.currentQuestion];
        
        document.getElementById('question-text').textContent = this.currentQuestionObj.question;
        document.getElementById('question-category').textContent = this.currentQuestionObj.category;
        document.getElementById('question-hint').textContent = this.currentQuestionObj.hint;
        document.getElementById('q-number').textContent = this.gameState.currentQuestion + 1;
        
        let stars = "";
        switch(this.currentQuestionObj.difficulty) {
            case "سهل": stars = "★☆☆☆☆"; break;
            case "متوسط": stars = "★★☆☆☆"; break;
            case "صعب": stars = "★★★☆☆"; break;
            default: stars = "★☆☆☆☆";
        }
        document.getElementById('question-difficulty').textContent = stars;
        
        document.getElementById('option-a').textContent = this.currentQuestionObj.options[0];
        document.getElementById('option-b').textContent = this.currentQuestionObj.options[1];
        document.getElementById('option-c').textContent = this.currentQuestionObj.options[2];
        document.getElementById('option-d').textContent = this.currentQuestionObj.options[3];
        
        const prize = this.gameState.getCurrentPrize();
        document.getElementById('current-prize').textContent = prize.toLocaleString();
        document.getElementById('total-prize').textContent = prize.toLocaleString();
        
        const progress = ((this.gameState.currentQuestion + 1) / 15) * 100;
        const progressFill = document.getElementById('progress-fill');
        const progressPercent = document.getElementById('progress-percent');
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressPercent) progressPercent.textContent = `${progress.toFixed(2)}%`;
        
        const levelEl = document.getElementById('player-level');
        if (levelEl) {
            levelEl.textContent = Math.min(Math.floor(this.gameState.currentQuestion / 5) + 1, 3);
        }
        
        this.updatePrizesList();
        this.resetOptions();
        this.startTimer();
    }

    updatePrizesList() {
        const prizesList = document.getElementById('prizes-list');
        if (!prizesList) return;
        
        prizesList.innerHTML = '';
        
        PRIZES.forEach((prize, index) => {
            const prizeItem = document.createElement('div');
            prizeItem.className = 'prize-item';
            
            if (index === this.gameState.currentQuestion) {
                prizeItem.classList.add('current');
            } else if (index < this.gameState.currentQuestion) {
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

    resetOptions() {
        const optionCards = document.querySelectorAll('.option-card');
        optionCards.forEach(card => {
            card.classList.remove('correct', 'wrong', 'selected');
            card.disabled = false;
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
        let timeLeft = CONFIG.TIME_PER_QUESTION;
        const timerDisplay = document.getElementById('timer');
        if (!timerDisplay) return;
        
        timerDisplay.textContent = timeLeft;
        timerDisplay.classList.remove('warning', 'danger');
        
        clearInterval(this.currentTimer);
        this.currentTimer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            
            if (timeLeft <= 10) {
                timerDisplay.classList.add('warning');
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
        alert('انتهى الوقت!');
        this.endGame(false);
    }

    setupEventListeners() {
        // الخيارات
        document.getElementById('option-a-card').addEventListener('click', () => this.checkAnswer(0));
        document.getElementById('option-b-card').addEventListener('click', () => this.checkAnswer(1));
        document.getElementById('option-c-card').addEventListener('click', () => this.checkAnswer(2));
        document.getElementById('option-d-card').addEventListener('click', () => this.checkAnswer(3));
        
        // زر التالي
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        
        // زر الانسحاب
        document.getElementById('withdraw-btn').addEventListener('click', () => this.showWithdrawModal());
        
        // المساعدات
        document.getElementById('fifty-fifty').addEventListener('click', () => this.useFiftyFifty());
        document.getElementById('ask-audience').addEventListener('click', () => this.useAskAudience());
        document.getElementById('phone-friend').addEventListener('click', () => this.usePhoneFriend());
        
        // التحكم بالصوت
        document.getElementById('sound-toggle').addEventListener('click', () => this.toggleSound());
        
        // التعليمات
        document.getElementById('help-btn').addEventListener('click', () => this.showHelpModal());
        
        // نافذة الانسحاب
        document.getElementById('confirm-withdraw')?.addEventListener('click', () => this.confirmWithdraw());
    }

    checkAnswer(selectedIndex) {
        if (this.gameState.answered || !this.gameState.gameActive) return;
        this.gameState.answered = true;
        
        clearInterval(this.currentTimer);
        
        const isCorrect = selectedIndex === this.currentQuestionObj.correct;
        const optionCards = document.querySelectorAll('.option-card');
        const selectedCard = optionCards[selectedIndex];
        const correctCard = optionCards[this.currentQuestionObj.correct];
        
        if (selectedCard) selectedCard.classList.add(isCorrect ? 'correct' : 'wrong');
        if (!isCorrect && correctCard) correctCard.classList.add('correct');
        
        optionCards.forEach(card => {
            card.style.pointerEvents = 'none';
        });
        
        this.gameState.updateScore(isCorrect);
        this.gameState.selectedOption = selectedIndex;
        
        if (isCorrect) {
            document.getElementById('current-prize').textContent = this.gameState.getCurrentPrize().toLocaleString();
            document.getElementById('total-prize').textContent = this.gameState.getCurrentPrize().toLocaleString();
            
            if (this.gameState.currentQuestion < this.questions.length - 1) {
                setTimeout(() => {
                    const nextBtn = document.getElementById('next-btn');
                    if (nextBtn) {
                        nextBtn.disabled = false;
                        nextBtn.classList.remove('disabled');
                    }
                }, 1000);
            } else {
                setTimeout(() => this.endGame(true), 2000);
            }
        } else {
            setTimeout(() => this.endGame(false), 2000);
        }
        
        this.updatePrizesList();
    }

    nextQuestion() {
        if (this.gameState.nextQuestion()) {
            this.showQuestion();
        } else {
            this.endGame(true);
        }
    }

    showWithdrawModal() {
        const safePrize = this.gameState.getSafePrize();
        const withdrawAmount = document.getElementById('withdraw-amount');
        if (withdrawAmount) {
            withdrawAmount.textContent = safePrize.toLocaleString();
        }
        document.getElementById('withdraw-modal').classList.add('active');
    }

    confirmWithdraw() {
        const safePrize = this.gameState.getSafePrize();
        this.gameState.score = safePrize;
        document.getElementById('withdraw-modal').classList.remove('active');
        this.endGame(false);
    }

    useFiftyFifty() {
        if (!this.gameState.lifelines.fiftyFifty || !this.currentQuestionObj) return;
        
        const correctIndex = this.currentQuestionObj.correct;
        let wrongOptions = [0, 1, 2, 3].filter(idx => idx !== correctIndex);
        
        wrongOptions.sort(() => Math.random() - 0.5);
        const toRemove = wrongOptions.slice(0, 2);
        
        toRemove.forEach(idx => {
            const button = document.querySelectorAll('.option-card')[idx];
            if (button) {
                button.style.opacity = '0.3';
                button.style.pointerEvents = 'none';
            }
        });
        
        this.gameState.useLifeline('fiftyFifty');
        const fiftyFiftyBtn = document.getElementById('fifty-fifty');
        if (fiftyFiftyBtn) {
            fiftyFiftyBtn.disabled = true;
            fiftyFiftyBtn.classList.add('disabled');
        }
    }

    useAskAudience() {
        if (!this.gameState.lifelines.askAudience || !this.currentQuestionObj) return;
        
        const correctIndex = this.currentQuestionObj.correct;
        let percentages = [0, 0, 0, 0];
        percentages[correctIndex] = 50 + Math.floor(Math.random() * 30);
        
        let remaining = 100 - percentages[correctIndex];
        for (let i = 0; i < 4; i++) {
            if (i !== correctIndex) {
                percentages[i] = Math.floor(Math.random() * remaining);
                remaining -= percentages[i];
            }
        }
        
        alert(`تصويت الجمهور:
        أ: ${percentages[0]}%
        ب: ${percentages[1]}%
        ج: ${percentages[2]}%
        د: ${percentages[3]}%`);
        
        this.gameState.useLifeline('askAudience');
        const askAudienceBtn = document.getElementById('ask-audience');
        if (askAudienceBtn) {
            askAudienceBtn.disabled = true;
            askAudienceBtn.classList.add('disabled');
        }
    }

    usePhoneFriend() {
        if (!this.gameState.lifelines.phoneFriend || !this.currentQuestionObj) return;
        
        const correctIndex = this.currentQuestionObj.correct;
        const confidence = Math.floor(Math.random() * 30) + 70;
        
        const options = ['أ', 'ب', 'ج', 'د'];
        alert(`الصديق: "أعتقد أن الإجابة الصحيحة هي ${options[correctIndex]}... أنا ${confidence}% متأكد"`);
        
        this.gameState.useLifeline('phoneFriend');
        const phoneFriendBtn = document.getElementById('phone-friend');
        if (phoneFriendBtn) {
            phoneFriendBtn.disabled = true;
            phoneFriendBtn.classList.add('disabled');
        }
    }

    toggleSound() {
        const soundBtn = document.getElementById('sound-toggle');
        if (!soundBtn) return;
        
        const icon = soundBtn.querySelector('i');
        if (icon.classList.contains('fa-volume-up')) {
            icon.className = 'fas fa-volume-mute';
            alert('تم إيقاف الصوت');
        } else {
            icon.className = 'fas fa-volume-up';
            alert('تم تشغيل الصوت');
        }
    }

    showHelpModal() {
        document.getElementById('help-modal').classList.add('active');
    }

    endGame(isWin) {
        clearInterval(this.currentTimer);
        this.gameState.gameActive = false;
        
        const container = document.getElementById('game-container');
        if (!container) return;
        
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
                                <h2 id="result-player-name">${this.gameState.playerName}</h2>
                                <div class="player-rank">
                                    <i class="fas fa-star"></i>
                                    <span>المستوى ${Math.min(Math.floor(this.gameState.currentQuestion / 5) + 1, 3)}</span>
                                </div>
                            </div>
                            
                            <div class="result-prize">
                                <div class="prize-amount-large">
                                    <span class="currency">$</span>
                                    <span id="final-prize">${this.gameState.score.toLocaleString()}</span>
                                </div>
                                <div class="prize-label">قيمة الجائزة التي ربحتها</div>
                                <div class="prize-breakdown">
                                    <div class="breakdown-item">
                                        <span>الإجابات الصحيحة</span>
                                        <span>${this.gameState.totalCorrect}</span>
                                    </div>
                                    <div class="breakdown-item">
                                        <span>الأسئلة المجابة</span>
                                        <span>${this.gameState.currentQuestion + 1}</span>
                                    </div>
                                    <div class="breakdown-item">
                                        <span>نسبة النجاح</span>
                                        <span>${this.gameState.getAccuracy()}%</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="result-stats">
                                <div class="stats-grid">
                                    <div class="stat-box">
                                        <i class="fas fa-clock"></i>
                                        <div class="stat-value">${this.gameState.getPlayTime()}</div>
                                        <div class="stat-label">ثانية</div>
                                    </div>
                                    <div class="stat-box">
                                        <i class="fas fa-life-ring"></i>
                                        <div class="stat-value">${CONFIG.LIFELINES_COUNT - this.gameState.getRemainingLifelines()}</div>
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
        
        this.saveHighScore();
        
        setTimeout(() => {
            document.getElementById('play-again-btn').addEventListener('click', () => {
                window.location.reload();
            });
            
            document.getElementById('main-menu-btn').addEventListener('click', () => {
                window.location.href = 'start.html';
            });
        }, 100);
    }

    saveHighScore() {
        const highScores = JSON.parse(localStorage.getItem('millionaireHighScores')) || [];
        
        highScores.push({
            name: this.gameState.playerName,
            score: this.gameState.score,
            date: new Date().toISOString(),
            questions: this.gameState.currentQuestion + 1,
            correct: this.gameState.totalCorrect
        });
        
        highScores.sort((a, b) => b.score - a.score);
        const topScores = highScores.slice(0, 10);
        localStorage.setItem('millionaireHighScores', JSON.stringify(topScores));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new MillionaireGame();
});
