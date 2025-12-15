// main.js - الملف الرئيسي
import { CONFIG, PRIZES } from './config.js';

// نستدعي فقط الملفات الأساسية
import { audioManager } from './audioManager.js';
import { gameState } from './gameState.js';
import { QUESTIONS } from './question.js';

// بدل استيراد الملفات كلها، ننشئ نسخة مبسطة
class MillionaireGame {
    constructor() {
        this.currentTimer = null;
        this.currentQuestion = null;
        this.init();
    }

    init() {
        console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION}`);
        
        this.loadPlayer();
        this.setupDOM();
        this.setupEventListeners();
        
        if (gameState.gameActive) {
            this.startGame();
        }
    }

    loadPlayer() {
        gameState.playerName = localStorage.getItem('millionairePlayerName') || 'اللاعب';
        
        if (!gameState.playerName) {
            setTimeout(() => window.location.href = 'start.html', 1000);
        }
    }

    setupDOM() {
        // تحديث اسم اللاعب في الواجهة
        const playerEl = document.getElementById('current-player');
        if (playerEl) playerEl.textContent = gameState.playerName;
        
        // تحديث المستوى
        const levelEl = document.getElementById('player-level');
        if (levelEl) levelEl.textContent = '1';
    }

    setupEventListeners() {
        // الأحداث الأساسية
        document.addEventListener('click', this.handleClick.bind(this));
        document.getElementById('next-btn')?.addEventListener('click', () => this.nextQuestion());
        document.getElementById('withdraw-btn')?.addEventListener('click', () => this.showWithdrawModal());
        
        // المساعدات
        document.getElementById('fifty-fifty')?.addEventListener('click', () => this.useFiftyFifty());
        document.getElementById('ask-audience')?.addEventListener('click', () => this.useAskAudience());
        document.getElementById('phone-friend')?.addEventListener('click', () => this.usePhoneFriend());
    }

    startGame() {
        gameState.start(gameState.playerName);
        this.loadQuestion();
    }

    loadQuestion() {
        if (gameState.currentQuestion >= QUESTIONS.length) return;
        
        this.currentQuestion = QUESTIONS[gameState.currentQuestion];
        this.updateUI();
        this.startTimer();
    }

    updateUI() {
        if (!this.currentQuestion) return;
        
        // تحديث السؤال
        document.getElementById('question-text').textContent = this.currentQuestion.question;
        document.getElementById('question-category').textContent = this.currentQuestion.category;
        document.getElementById('q-number').textContent = gameState.currentQuestion + 1;
        
        // تحديث الخيارات
        document.getElementById('option-a').textContent = this.currentQuestion.options[0];
        document.getElementById('option-b').textContent = this.currentQuestion.options[1];
        document.getElementById('option-c').textContent = this.currentQuestion.options[2];
        document.getElementById('option-d').textContent = this.currentQuestion.options[3];
        
        // تحديث الجائزة
        const prize = PRIZES[gameState.currentQuestion];
        document.getElementById('current-prize').textContent = prize.toLocaleString();
        document.getElementById('total-prize').textContent = prize.toLocaleString();
        
        // تحديث التقدم
        const progress = ((gameState.currentQuestion + 1) / CONFIG.TOTAL_QUESTIONS) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('progress-percent').textContent = `${progress.toFixed(2)}%`;
        
        this.updatePrizesList();
    }

    updatePrizesList() {
        const list = document.getElementById('prizes-list');
        if (!list) return;
        
        list.innerHTML = '';
        
        PRIZES.forEach((prize, index) => {
            const item = document.createElement('div');
            item.className = 'prize-item';
            
            if (index === gameState.currentQuestion) item.classList.add('current');
            else if (index < gameState.currentQuestion) item.classList.add('passed');
            else item.classList.add('future');
            
            if (CONFIG.SAFE_HAVEN_LEVELS.includes(index + 1)) {
                item.classList.add('safe');
            }
            
            item.innerHTML = `
                <div class="prize-rank">${index + 1}</div>
                <div class="prize-amount">${prize.toLocaleString()} $</div>
            `;
            
            list.appendChild(item);
        });
    }

    startTimer() {
        let timeLeft = CONFIG.TIME_PER_QUESTION;
        const timerEl = document.getElementById('timer');
        
        clearInterval(this.currentTimer);
        
        this.currentTimer = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft;
            
            if (timeLeft <= 10) timerEl.classList.add('warning');
            if (timeLeft <= 5) timerEl.classList.add('danger');
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

    handleClick(e) {
        const optionCard = e.target.closest('.option-card');
        if (!optionCard || gameState.answered) return;
        
        const index = Array.from(document.querySelectorAll('.option-card')).indexOf(optionCard);
        this.checkAnswer(index);
    }

    checkAnswer(selectedIndex) {
        gameState.answered = true;
        clearInterval(this.currentTimer);
        
        const isCorrect = selectedIndex === this.currentQuestion.correct;
        
        // تحديث النتيجة
        gameState.updateScore(isCorrect);
        
        // تلوين الإجابات
        const cards = document.querySelectorAll('.option-card');
        cards.forEach((card, idx) => {
            if (idx === selectedIndex) card.classList.add(isCorrect ? 'correct' : 'wrong');
            if (idx === this.currentQuestion.correct && !isCorrect) card.classList.add('correct');
            card.style.pointerEvents = 'none';
        });
        
        if (isCorrect) {
            audioManager.play('correct');
            
            if (gameState.currentQuestion < QUESTIONS.length - 1) {
                setTimeout(() => {
                    document.getElementById('next-btn').disabled = false;
                    document.getElementById('next-btn').classList.remove('disabled');
                }, 1000);
            } else {
                setTimeout(() => this.endGame(true), 2000);
            }
        } else {
            audioManager.play('wrong');
            setTimeout(() => this.endGame(false), 2000);
        }
    }

    nextQuestion() {
        if (gameState.nextQuestion()) {
            this.loadQuestion();
        } else {
            this.endGame(true);
        }
    }

    showWithdrawModal() {
        const safePrize = gameState.getSafePrize();
        document.getElementById('withdraw-amount').textContent = safePrize.toLocaleString();
        document.getElementById('withdraw-modal').classList.add('active');
    }

    useFiftyFifty() {
        if (!gameState.lifelines.fiftyFifty) return;
        
        const correctIndex = this.currentQuestion.correct;
        let wrongOptions = [0, 1, 2, 3].filter(idx => idx !== correctIndex);
        wrongOptions.sort(() => Math.random() - 0.5);
        const toRemove = wrongOptions.slice(0, 2);
        
        toRemove.forEach(idx => {
            const card = document.querySelectorAll('.option-card')[idx];
            card.style.opacity = '0.3';
            card.style.pointerEvents = 'none';
        });
        
        gameState.useLifeline('fiftyFifty');
        document.getElementById('fifty-fifty').disabled = true;
    }

    useAskAudience() {
        if (!gameState.lifelines.askAudience) return;
        
        const correctIndex = this.currentQuestion.correct;
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
        
        gameState.useLifeline('askAudience');
        document.getElementById('ask-audience').disabled = true;
    }

    usePhoneFriend() {
        if (!gameState.lifelines.phoneFriend) return;
        
        const correctIndex = this.currentQuestion.correct;
        const confidence = Math.floor(Math.random() * 30) + 70;
        const options = ['أ', 'ب', 'ج', 'د'];
        
        alert(`الصديق: "أعتقد أن الإجابة الصحيحة هي ${options[correctIndex]}... أنا ${confidence}% متأكد"`);
        
        gameState.useLifeline('phoneFriend');
        document.getElementById('phone-friend').disabled = true;
    }

    endGame(isWin) {
        gameState.gameActive = false;
        clearInterval(this.currentTimer);
        
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
                                <h2 id="result-player-name">${gameState.playerName}</h2>
                            </div>
                            
                            <div class="result-prize">
                                <div class="prize-amount-large">
                                    <span class="currency">$</span>
                                    <span id="final-prize">${gameState.score.toLocaleString()}</span>
                                </div>
                                <div class="prize-label">قيمة الجائزة التي ربحتها</div>
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
        
        // إضافة أحداث النتائج
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

// نبدأ اللعبة
document.addEventListener('DOMContentLoaded', () => {
    new MillionaireGame();
});
