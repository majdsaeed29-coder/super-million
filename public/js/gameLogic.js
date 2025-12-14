
// gameLogic.js - المعدل
import { gameState } from './gameState.js';
import { getRandomQuestion } from './question.js';
import { domManager } from './domManager.js';
import { timer } from './timer.js';
import { audioManager } from './audioManager.js';
import { uiEffects } from './uiEffects.js';
import { PRIZES } from './config.js';

class GameLogic {
    constructor() {
        this.currentQuestion = null;
    }

    startNewRound() {
        const level = Math.ceil((gameState.currentQuestion + 1) / 5);
        this.currentQuestion = getRandomQuestion(
            level,
            gameState.usedQuestions
        );
        
        if (!this.currentQuestion) {
            console.error('لا توجد أسئلة متاحة');
            return false;
        }
        
        gameState.addUsedQuestion(this.currentQuestion.id);
        this.updateUI();
        timer.start();
        
        return true;
    }

    updateUI() {
        if (!this.currentQuestion) return;
        
        const { currentQuestion } = this;
        
        domManager.elements.questionText.textContent = currentQuestion.question;
        domManager.updateQuestionNumber(gameState.currentQuestion + 1, 15);
        
        const options = [domManager.elements.optionA, domManager.elements.optionB,
                        domManager.elements.optionC, domManager.elements.optionD];
        
        options.forEach((element, index) => {
            if (element) {
                element.textContent = currentQuestion.options[index];
            }
        });
        
        domManager.updateCurrentPrize(gameState.getCurrentPrize());
        domManager.updatePrizesList(gameState.currentQuestion, PRIZES);
        domManager.clearOptions();
        domManager.setButtonState('next', true);
    }

    checkAnswer(selectedIndex) {
        if (!this.currentQuestion) return false;
        
        const isCorrect = selectedIndex === this.currentQuestion.correct;
        
        gameState.updateScore(isCorrect);
        gameState.selectedOption = selectedIndex;
        timer.stop();
        
        this.showAnswerResult(selectedIndex, isCorrect);
        
        if (isCorrect) {
            audioManager.play('correct');
            uiEffects.showCorrectEffect();
        } else {
            audioManager.play('wrong');
            uiEffects.showWrongEffect();
        }
        
        return isCorrect;
    }

    showAnswerResult(selectedIndex, isCorrect) {
        const buttons = domManager.elements.optionButtons;
        
        if (!buttons || buttons.length === 0) return;
        
        buttons.forEach(btn => btn.disabled = true);
        
        if (buttons[selectedIndex]) {
            buttons[selectedIndex].classList.add(isCorrect ? 'correct' : 'wrong');
        }
        
        if (!isCorrect && buttons[this.currentQuestion.correct]) {
            buttons[this.currentQuestion.correct].classList.add('correct');
        }
        
        if (isCorrect && gameState.currentQuestion < 14) {
            setTimeout(() => {
                domManager.setButtonState('next', false);
            }, 1000);
        }
    }

    goToNextQuestion() {
        if (gameState.nextQuestion()) {
            return this.startNewRound();
        }
        return false;
    }

    safeWithdraw() {
        const prize = gameState.getSafePrize();
        gameState.score = prize;
        return prize;
    }

    endGame(isWin = false) {
        gameState.gameActive = false;
        timer.stop();
        this.updateResultScreen(isWin);
        
        setTimeout(() => {
            domManager.showScreen('result');
        }, 2000);
    }

    updateResultScreen(isWin) {
        const { elements } = domManager;
        
        if (!elements) return;
        
        if (isWin && gameState.currentQuestion === 14) {
            if (elements.resultTitle) {
                elements.resultTitle.textContent = "مبروك! فزت بالمليون! 🏆";
            }
        } else if (!isWin && elements.resultTitle) {
            elements.resultTitle.textContent = "انتهت اللعبة";
        }
        
        if (elements.finalPrize) {
            elements.finalPrize.textContent = `${gameState.score.toLocaleString()}`;
        }
        
        if (elements.resultPlayerName) {
            elements.resultPlayerName.textContent = gameState.playerName;
        }
    }
}

export const gameLogic = new GameLogic();
