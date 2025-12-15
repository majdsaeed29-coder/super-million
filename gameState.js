import { CONFIG, PRIZES } from './config.js';

export class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.player = null;
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
        this.settings = {
            timerEnabled: true,
            questionType: 'all',
            difficulty: 'medium'
        };
    }

    init(playerData) {
        this.player = playerData;
        this.settings = JSON.parse(localStorage.getItem('gameSettings')) || this.settings;
        return this;
    }

    start() {
        this.gameActive = true;
        this.startTime = Date.now();
        this.usedQuestions = [];
        return true;
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

    checkAnswer(selectedIndex, correctIndex) {
        this.answered = true;
        this.selectedOption = selectedIndex;
        
        const isCorrect = selectedIndex === correctIndex;
        
        if (isCorrect) {
            this.updateScore(true);
            this.totalCorrect++;
        }
        
        return isCorrect;
    }

    updateScore(isCorrect) {
        if (isCorrect) {
            this.score = PRIZES[this.currentQuestion];
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

    saveProgress() {
        const progress = {
            player: this.player,
            currentQuestion: this.currentQuestion,
            score: this.score,
            totalCorrect: this.totalCorrect,
            lifelines: this.lifelines,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('gameProgress', JSON.stringify(progress));
    }

    loadProgress() {
        const progress = JSON.parse(localStorage.getItem('gameProgress'));
        if (progress) {
            this.player = progress.player;
            this.currentQuestion = progress.currentQuestion;
            this.score = progress.score;
            this.totalCorrect = progress.totalCorrect;
            this.lifelines = progress.lifelines;
            return true;
        }
        return false;
    }

    clearProgress() {
        localStorage.removeItem('gameProgress');
    }

    getPlayerLevel() {
        if (!this.player || !this.player.score) return 1;
        
        const score = this.player.score || 0;
        if (score >= 1000000) return 5;
        if (score >= 500000) return 4;
        if (score >= 100000) return 3;
        if (score >= 10000) return 2;
        return 1;
    }

    updatePlayerStats(isWin, finalScore) {
        if (!this.player) return;
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.username === this.player.username);
        
        if (userIndex !== -1) {
            const user = users[userIndex];
            user.gamesPlayed = (user.gamesPlayed || 0) + 1;
            
            if (isWin) {
                user.score = Math.max(user.score || 0, finalScore);
                user.wins = (user.wins || 0) + 1;
                
                // ترقية المستوى
                if (finalScore >= 1000000) {
                    user.level = 5;
                } else if (finalScore >= 500000) {
                    user.level = 4;
                } else if (finalScore >= 100000) {
                    user.level = 3;
                } else if (finalScore >= 10000) {
                    user.level = 2;
                } else {
                    user.level = 1;
                }
            } else {
                user.losses = (user.losses || 0) + 1;
            }
            
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // تحديث المستخدم الحالي
        this.player.gamesPlayed = (this.player.gamesPlayed || 0) + 1;
        if (isWin) {
            this.player.score = Math.max(this.player.score || 0, finalScore);
        }
        localStorage.setItem('currentUser', JSON.stringify(this.player));
    }

    getRank() {
        if (!this.player) return 'مبتدئ';
        
        const score = this.player.score || 0;
        if (score >= 1000000) return 'مليونير';
        if (score >= 500000) return 'خبير';
        if (score >= 100000) return 'محترف';
        if (score >= 10000) return 'متوسط';
        return 'مبتدئ';
    }
}

// نسخة واحدة من حالة اللعبة
export const gameState = new GameState();
