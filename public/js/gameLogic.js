import { gameState } from './gameState.js';
import { getRandomQuestion } from './questions.js';
import { domManager } from './domManager.js';
import { timer } from './timer.js';
import { audioManager } from './audioManager.js';
import { showCorrectEffect, showWrongEffect } from './uiEffects.js';

class GameLogic {
    constructor() {
        this.currentQuestion = null;
    }

    // بدء جولة جديدة
    startNewRound() {
        // الحصول على سؤال جديد
        this.currentQuestion = getRandomQuestion(
            Math.ceil((gameState.currentQuestion + 1) / 3),
            gameState.usedQuestions
        );
        
        if (!this.currentQuestion) return false;
        
        // إضافة السؤال للمستخدمين
        gameState.addUsedQuestion(this.currentQuestion.id);
        
        // تحديث الواجهة
        this.updateUI();
        
        // بدء المؤقت
        timer.start();
        
        return true;
    }

    // تحديث واجهة السؤال
    updateUI() {
        const { currentQuestion } = this;
        
        // تحديث نص السؤال
        domManager.elements.questionText.textContent = currentQuestion.question;
        domManager.updateQuestionNumber(gameState.currentQuestion + 1, 15);
        
        // تحديث الخيارات
        const options = [domManager.elements.optionA, domManager.elements.optionB,
                        domManager.elements.optionC, domManager.elements.optionD];
        
        options.forEach((element, index) => {
            if (element) {
                element.textContent = currentQuestion.options[index];
            }
        });
        
        // تحديث الجائزة
        domManager.updateCurrentPrize(gameState.getCurrentPrize());
        
        // تحديث قائمة الجوائز
        domManager.updatePrizesList(gameState.currentQuestion, PRIZES);
        
        // تنظيف الخيارات
        domManager.clearOptions();
        
        // تعطيل زر التالي
        domManager.setButtonState('next', true);
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
            showCorrectEffect();
        } else {
            audioManager.play('wrong');
            showWrongEffect();
        }
        
        return isCorrect;
    }

    // عرض نتيجة الإجابة
    showAnswerResult(selectedIndex, isCorrect) {
        const buttons = domManager.elements.optionButtons;
        
        // تعطيل جميع الأزرار
        buttons.forEach(btn => btn.disabled = true);
        
        // تلوين الإجابة المختارة
        buttons[selectedIndex].classList.add(isCorrect ? 'correct' : 'wrong');
        
        // إذا كانت الإجابة خاطئة، عرض الإجابة الصحيحة
        if (!isCorrect) {
            buttons[this.currentQuestion.correct].classList.add('correct');
        }
        
        // تمكين زر التالي إذا كانت الإجابة صحيحة ولم يكن السؤال الأخير
        if (isCorrect && gameState.currentQuestion < 14) {
            setTimeout(() => {
                domManager.setButtonState('next', false);
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
        
        if (isWin && gameState.currentQuestion === 14) {
            elements.resultTitle.textContent = "مبروك! فزت بالمليون! 🏆";
        } else if (!isWin) {
            elements.resultTitle.textContent = "انتهت اللعبة";
        }
        
        elements.finalPrize.textContent = `${gameState.score.toLocaleString()} جنيه`;
        elements.resultPlayerName.textContent = gameState.playerName;
        elements.questionsAnswered.textContent = gameState.currentQuestion + 1;
        elements.lifelinesLeft.textContent = gameState.getRemainingLifelines();
    }
}

export const gameLogic = new GameLogic();
