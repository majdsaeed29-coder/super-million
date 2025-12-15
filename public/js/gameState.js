// gameState.js
import { CONFIG, PRIZES } from './config.js';

export class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.playerName = '';
        this.currentQuestion = 0;
        this.score = 0;
        this.totalCorrect = 0;
        this.lifelines = {
            fiftyFifty: true,
            askAudience: true,
            phoneFriend: true
        };
        this.usedQuestions = [];
        this.gameActive = false;
        this.selectedOption = null;
        this.startTime = null;
        this.answered = false;
    }

    start(playerName) {
        this.reset();
        this.playerName = playerName;
        this.gameActive = true;
        this.startTime = Date.now();
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
}

// ننشئ نسخة واحدة
export const gameState = new GameState();
