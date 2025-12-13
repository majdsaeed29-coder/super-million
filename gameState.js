import { CONFIG, PRIZES } from './config.js';

// حالة اللعبة
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
    }

    // بدء اللعبة
    start(playerName) {
        this.reset();
        this.playerName = playerName;
        this.gameActive = true;
        this.startTime = Date.now();
        this.usedQuestions = [];
    }

    // الانتقال للسؤال التالي
    nextQuestion() {
        if (this.currentQuestion < CONFIG.TOTAL_QUESTIONS - 1) {
            this.currentQuestion++;
            this.selectedOption = null;
            return true;
        }
        return false;
    }

    // إضافة سؤال مستخدم
    addUsedQuestion(questionId) {
        this.usedQuestions.push(questionId);
    }

    // التحقق إذا تم استخدام السؤال
    isQuestionUsed(questionId) {
        return this.usedQuestions.includes(questionId);
    }

    // تحديث النتيجة
    updateScore(isCorrect) {
        if (isCorrect) {
            this.score = PRIZES[this.currentQuestion];
            this.totalCorrect++;
        }
    }

    // الحصول على الجائزة الحالية
    getCurrentPrize() {
        return PRIZES[this.currentQuestion] || 0;
    }

    // الحصول على الجائزة الآمنة
    getSafePrize() {
        for (let i = this.currentQuestion; i >= 0; i--) {
            if (CONFIG.SAFE_HAVEN_LEVELS.includes(i + 1) || i === 0) {
                return PRIZES[i];
            }
        }
        return 0;
    }

    // التحقق إذا وصل لخط أمان
    isAtSafeHaven() {
        return CONFIG.SAFE_HAVEN_LEVELS.includes(this.currentQuestion + 1);
    }

    // استخدام مساعدة
    useLifeline(lifeline) {
        if (this.lifelines[lifeline]) {
            this.lifelines[lifeline] = false;
            return true;
        }
        return false;
    }

    // عدد المساعدات المتبقية
    getRemainingLifelines() {
        return Object.values(this.lifelines).filter(v => v).length;
    }

    // الحصول على وقت اللعب
    getPlayTime() {
        if (!this.startTime) return 0;
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    // نسبة النجاح
    getAccuracy() {
        if (this.currentQuestion === 0) return 0;
        return Math.round((this.totalCorrect / this.currentQuestion) * 100);
    }
}

// تصدير نسخة واحدة من حالة اللعبة
export const gameState = new GameState();
