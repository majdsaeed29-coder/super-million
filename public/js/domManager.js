// domManager.js - كامل
class DOMManager {
    constructor() {
        this.elements = {};
        this.cacheElements();
    }

    cacheElements() {
        // الشاشات
        this.elements.startScreen = document.getElementById('start-screen');
        this.elements.gameScreen = document.getElementById('game-screen');
        this.elements.resultScreen = document.getElementById('result-screen');
        
        // عناصر الشاشة الرئيسية
        this.elements.playerNameInput = document.getElementById('player-name');
        this.elements.startBtn = document.getElementById('start-btn');
        
        // عناصر شاشة اللعبة
        this.elements.currentPlayer = document.getElementById('current-player');
        this.elements.currentPrize = document.getElementById('current-prize');
        this.elements.questionNumber = document.getElementById('q-number');
        this.elements.questionText = document.getElementById('question-text');
        this.elements.questionCategory = document.getElementById('question-category');
        this.elements.questionDifficulty = document.getElementById('question-difficulty');
        this.elements.questionHint = document.getElementById('question-hint');
        
        // الخيارات
        this.elements.optionA = document.getElementById('option-a');
        this.elements.optionB = document.getElementById('option-b');
        this.elements.optionC = document.getElementById('option-c');
        this.elements.optionD = document.getElementById('option-d');
        this.elements.optionButtons = document.querySelectorAll('.option-card');
        
        // أزرار التحكم
        this.elements.nextBtn = document.getElementById('next-btn');
        this.elements.withdrawBtn = document.getElementById('withdraw-btn');
        this.elements.quickWithdrawBtn = document.getElementById('quick-withdraw');
        this.elements.pauseBtn = document.getElementById('pause-btn');
        this.elements.helpBtn = document.getElementById('help-btn');
        
        // المساعدات
        this.elements.fiftyFiftyBtn = document.getElementById('fifty-fifty');
        this.elements.askAudienceBtn = document.getElementById('ask-audience');
        this.elements.phoneFriendBtn = document.getElementById('phone-friend');
        
        // الإحصائيات
        this.elements.timerDisplay = document.getElementById('timer');
        this.elements.scoreDisplay = document.getElementById('score-display');
        this.elements.progressFill = document.getElementById('progress-fill');
        this.elements.progressPercent = document.getElementById('progress-percent');
        this.elements.playerLevel = document.getElementById('player-level');
        
        // قائمة الجوائز
        this.elements.prizesList = document.getElementById('prizes-list');
        this.elements.totalPrize = document.getElementById('total-prize');
        
        // شاشة النتائج
        this.elements.resultTitle = document.getElementById('result-title');
        this.elements.resultSubtitle = document.getElementById('result-subtitle');
        this.elements.finalPrize = document.getElementById('final-prize');
        this.elements.resultPlayerName = document.getElementById('result-player-name');
        this.elements.playerRank = document.getElementById('player-rank');
        this.elements.guaranteedPrize = document.getElementById('guaranteed-prize');
        this.elements.bonusPrize = document.getElementById('bonus-prize');
        this.elements.correctAnswers = document.getElementById('correct-answers');
        this.elements.timeTaken = document.getElementById('time-taken');
        this.elements.accuracyRate = document.getElementById('accuracy-rate');
        this.elements.lifelinesUsed = document.getElementById('lifelines-used');
        this.elements.questionsAnswered = document.getElementById('questions-answered');
        this.elements.playAgainBtn = document.getElementById('play-again-btn');
        this.elements.answerHistory = document.getElementById('answer-history');
        
        // النوافذ المنبثقة
        this.elements.helpModal = document.getElementById('help-modal');
        this.elements.withdrawModal = document.getElementById('withdraw-modal');
        this.elements.audienceModal = document.getElementById('audience-modal');
        this.elements.phoneModal = document.getElementById('phone-modal');
    }

    // تبديل الشاشات
    showScreen(screenName) {
        // إخفاء جميع الشاشات
        if (this.elements.startScreen) this.elements.startScreen.classList.remove('active');
        if (this.elements.gameScreen) this.elements.gameScreen.classList.remove('active');
        if (this.elements.resultScreen) this.elements.resultScreen.classList.remove('active');
        
        // إخفاء جميع النوافذ المنبثقة
        const modals = ['help', 'withdraw', 'audience', 'phone'];
        modals.forEach(modal => {
            const modalElement = document.getElementById(`${modal}-modal`);
            if (modalElement) modalElement.classList.remove('active');
        });
        
        // عرض الشاشة المطلوبة
        const screen = this.elements[`${screenName}Screen`];
        if (screen) {
            screen.classList.add('active');
        } else {
            // إذا كانت نافذة منبثقة
            const modal = document.getElementById(`${screenName}-modal`);
            if (modal) {
                modal.classList.add('active');
            }
        }
    }

    // تحديث بيانات اللاعب
    updatePlayerInfo(name) {
        if (this.elements.currentPlayer) {
            this.elements.currentPlayer.textContent = `اللاعب: ${name}`;
        }
    }

    // تحديث الجائزة الحالية
    updateCurrentPrize(amount) {
        if (this.elements.currentPrize) {
            this.elements.currentPrize.textContent = amount.toLocaleString();
        }
    }

    // تحديث رقم السؤال
    updateQuestionNumber(number, total) {
        if (this.elements.questionNumber) {
            this.elements.questionNumber.textContent = number;
        }
        
        // تحديث شريط التقدم
        if (this.elements.progressFill && this.elements.progressPercent) {
            const percent = ((number / total) * 100).toFixed(2);
            this.elements.progressFill.style.width = `${percent}%`;
            this.elements.progressPercent.textContent = `${percent}%`;
        }
    }

    // تحديث السؤال
    updateQuestion(questionData) {
        if (this.elements.questionText) {
            this.elements.questionText.textContent = questionData.question;
        }
        
        if (this.elements.questionCategory) {
            this.elements.questionCategory.textContent = questionData.category || "عام";
        }
        
        if (this.elements.questionDifficulty) {
            const difficulty = questionData.difficulty || "سهل";
            let stars = "";
            switch(difficulty) {
                case "سهل": stars = "★☆☆☆☆"; break;
                case "متوسط": stars = "★★☆☆☆"; break;
                case "صعب": stars = "★★★☆☆"; break;
                case "صعب جداً": stars = "★★★★☆"; break;
                case "خبير": stars = "★★★★★"; break;
                default: stars = "★☆☆☆☆";
            }
            this.elements.questionDifficulty.textContent = stars;
        }
        
        if (this.elements.questionHint) {
            this.elements.questionHint.textContent = questionData.hint || "";
        }
    }

    // تحديث الخيارات
    updateOptions(options) {
        const optionElements = [
            this.elements.optionA,
            this.elements.optionB,
            this.elements.optionC,
            this.elements.optionD
        ];
        
        optionElements.forEach((element, index) => {
            if (element && options[index]) {
                element.textContent = options[index];
            }
        });
    }

    // تعطيل/تمكين الأزرار
    setButtonState(buttonId, disabled) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = disabled;
            button.classList.toggle('disabled', disabled);
        }
    }

    // تحديث قائمة الجوائز
    updatePrizesList(currentIndex, prizes) {
        if (!this.elements.prizesList) return;

        this.elements.prizesList.innerHTML = '';
        
        prizes.forEach((prize, index) => {
            const prizeItem = document.createElement('div');
            prizeItem.className = 'prize-item';
            
            if (index === currentIndex) {
                prizeItem.classList.add('current');
            } else if (index < currentIndex) {
                prizeItem.classList.add('passed');
            } else {
                prizeItem.classList.add('future');
            }
            
            if ([4, 9].includes(index)) {
                prizeItem.classList.add('safe');
            }
            
            prizeItem.innerHTML = `
                <div class="prize-rank">${index + 1}</div>
                <div class="prize-amount">${prize.toLocaleString()} $</div>
            `;
            
            this.elements.prizesList.appendChild(prizeItem);
        });
        
        // تحديث إجمالي الجوائز
        if (this.elements.totalPrize) {
            const total = prizes[currentIndex] || 0;
            this.elements.totalPrize.textContent = total.toLocaleString();
        }
    }

    // تنظيف الخيارات
    clearOptions() {
        if (!this.elements.optionButtons) return;
        
        this.elements.optionButtons.forEach(btn => {
            btn.classList.remove('correct', 'wrong', 'selected');
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        });
    }

    // عرض نتيجة الإجابة
    showAnswerResult(selectedIndex, correctIndex, isCorrect) {
        if (!this.elements.optionButtons) return;
        
        // تعطيل جميع الأزرار
        this.elements.optionButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.pointerEvents = 'none';
        });
        
        // عرض الإجابة الصحيحة
        if (this.elements.optionButtons[correctIndex]) {
            this.elements.optionButtons[correctIndex].classList.add('correct');
        }
        
        // إذا كانت الإجابة خاطئة، عرض الإجابة المختارة
        if (!isCorrect && this.elements.optionButtons[selectedIndex]) {
            this.elements.optionButtons[selectedIndex].classList.add('wrong');
        }
    }

    // استخدام مساعدة 50:50
    useFiftyFifty(correctIndex) {
        if (!this.elements.optionButtons) return;
        
        // اختيار إجابتين خاطئتين عشوائياً
        const wrongOptions = [0, 1, 2, 3].filter(idx => idx !== correctIndex);
        const toRemove = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2);
        
        toRemove.forEach(idx => {
            if (this.elements.optionButtons[idx]) {
                this.elements.optionButtons[idx].style.opacity = '0.3';
                this.elements.optionButtons[idx].disabled = true;
            }
        });
    }

    // عرض الإشعار
    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <div class="notification-content">
                <div class="notification-title">${this.getNotificationTitle(type)}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        container.appendChild(notification);
        
        // إغلاق الإشعار
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => notification.remove());
        
        // إزالة الإشعار تلقائياً بعد 5 ثواني
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }

    getNotificationTitle(type) {
        switch(type) {
            case 'success': return 'نجاح';
            case 'error': return 'خطأ';
            case 'warning': return 'تحذير';
            default: return 'معلومة';
        }
    }

    // تحديث المؤقت
    updateTimer(seconds) {
        if (this.elements.timerDisplay) {
            this.elements.timerDisplay.textContent = seconds;
            
            // تغيير اللون عند اقتراب الوقت للنفاد
            this.elements.timerDisplay.classList.remove('warning', 'danger');
            if (seconds <= 10) {
                this.elements.timerDisplay.classList.add('warning');
            }
            if (seconds <= 5) {
                this.elements.timerDisplay.classList.add('danger');
            }
        }
    }

    // تحديث النتيجة
    updateScore(score) {
        if (this.elements.scoreDisplay) {
            this.elements.scoreDisplay.textContent = score.toLocaleString();
        }
    }

    // تحديث مستوى اللاعب
    updatePlayerLevel(level) {
        if (this.elements.playerLevel) {
            this.elements.playerLevel.textContent = level;
        }
    }

    // تحديث شاشة النتائج
    updateResultScreen(data) {
        if (this.elements.resultTitle) {
            this.elements.resultTitle.textContent = data.title || "تهانينا!";
        }
        
        if (this.elements.resultSubtitle) {
            this.elements.resultSubtitle.textContent = data.subtitle || "لقد أتممت اللعبة بنجاح";
        }
        
        if (this.elements.finalPrize) {
            this.elements.finalPrize.textContent = data.finalPrize || "0";
        }
        
        if (this.elements.resultPlayerName) {
            this.elements.resultPlayerName.textContent = data.playerName || "ضيف";
        }
        
        if (this.elements.playerRank) {
            this.elements.playerRank.textContent = data.rank || "1";
        }
        
        if (this.elements.guaranteedPrize) {
            this.elements.guaranteedPrize.textContent = data.guaranteedPrize || "0";
        }
        
        if (this.elements.bonusPrize) {
            this.elements.bonusPrize.textContent = data.bonusPrize || "0";
        }
        
        if (this.elements.correctAnswers) {
            this.elements.correctAnswers.textContent = data.correctAnswers || "0";
        }
        
        if (this.elements.timeTaken) {
            this.elements.timeTaken.textContent = data.timeTaken || "0s";
        }
        
        if (this.elements.accuracyRate) {
            this.elements.accuracyRate.textContent = data.accuracyRate || "0%";
        }
        
        if (this.elements.lifelinesUsed) {
            this.elements.lifelinesUsed.textContent = data.lifelinesUsed || "0";
        }
        
        if (this.elements.questionsAnswered) {
            this.elements.questionsAnswered.textContent = data.questionsAnswered || "0";
        }
        
        // تحديث سجل الإجابات
        this.updateAnswerHistory(data.answerHistory || []);
    }

    // تحديث سجل الإجابات
    updateAnswerHistory(history) {
        if (!this.elements.answerHistory) return;
        
        this.elements.answerHistory.innerHTML = '';
        
        history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = `history-item ${item.isCorrect ? 'correct' : 'wrong'}`;
            
            historyItem.innerHTML = `
                <div class="history-question">
                    <strong>سؤال ${index + 1}:</strong> ${item.question}
                </div>
                <div class="history-result">
                    <div class="history-icon">
                        <i class="fas fa-${item.isCorrect ? 'check' : 'times'}"></i>
                    </div>
                    <div class="history-prize">${item.prize.toLocaleString()} $</div>
                </div>
            `;
            
            this.elements.answerHistory.appendChild(historyItem);
        });
    }

    // عرض نتيجة تصويت الجمهور
    showAudienceResults(percentages) {
        if (!this.elements.audienceModal) return;
        
        const resultsContainer = document.getElementById('audience-results');
        if (!resultsContainer) return;
        
        resultsContainer.innerHTML = `
            <h4>نتيجة تصويت الجمهور:</h4>
            <div class="audience-chart">
                ${percentages.map((pct, idx) => `
                    <div class="audience-bar">
                        <div class="bar-container">
                            <div class="bar-fill" style="height: ${pct}%"></div>
                        </div>
                        <div class="bar-label">${['أ', 'ب', 'ج', 'د'][idx]}</div>
                        <div class="bar-value">${pct}%</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        this.showScreen('audience');
    }

    // عرض نتيجة الاتصال بالصديق
    showPhoneCallResult(message, confidence) {
        if (!this.elements.phoneModal) return;
        
        const phoneContent = document.getElementById('phone-call-content');
        if (!phoneContent) return;
        
        phoneContent.innerHTML = `
            <div class="phone-call-animation">
                <div class="phone-ring"></div>
                <div class="phone-ring"></div>
                <div class="phone-ring"></div>
                <div class="phone-icon">
                    <i class="fas fa-phone-alt"></i>
                </div>
            </div>
            <div class="friend-answer">
                <p>"${message}"</p>
            </div>
            <div class="confidence-meter">
                <div class="confidence-label">
                    <span>ثقة الصديق:</span>
                    <span>${confidence}%</span>
                </div>
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${confidence}%"></div>
                </div>
            </div>
        `;
        
        this.showScreen('phone');
    }

    // إعادة تعيين جميع العناصر
    reset() {
        this.clearOptions();
        
        if (this.elements.timerDisplay) {
            this.elements.timerDisplay.textContent = "30";
            this.elements.timerDisplay.classList.remove('warning', 'danger');
        }
        
        if (this.elements.scoreDisplay) {
            this.elements.scoreDisplay.textContent = "0";
        }
        
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = "6.66%";
        }
        
        if (this.elements.progressPercent) {
            this.elements.progressPercent.textContent = "6.66%";
        }
        
        if (this.elements.questionNumber) {
            this.elements.questionNumber.textContent = "1";
        }
        
        if (this.elements.currentPrize) {
            this.elements.currentPrize.textContent = "100";
        }
    }
}

// تصدير نسخة واحدة
export const domManager = new DOMManager();
