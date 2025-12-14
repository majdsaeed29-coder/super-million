// إدارة عناصر الـ DOM
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
        
        // الخيارات
        this.elements.optionA = document.getElementById('option-a');
        this.elements.optionB = document.getElementById('option-b');
        this.elements.optionC = document.getElementById('option-c');
        this.elements.optionD = document.getElementById('option-d');
        this.elements.optionButtons = document.querySelectorAll('.option-btn');
        
        // أزرار التحكم
        this.elements.nextBtn = document.getElementById('next-btn');
        this.elements.withdrawBtn = document.getElementById('withdraw-btn');
        
        // المساعدات
        this.elements.fiftyFiftyBtn = document.getElementById('fifty-fifty');
        this.elements.askAudienceBtn = document.getElementById('ask-audience');
        this.elements.phoneFriendBtn = document.getElementById('phone-friend');
        
        // قائمة الجوائز
        this.elements.prizesList = document.querySelector('.prizes-list');
        
        // شاشة النتائج
        this.elements.resultTitle = document.getElementById('result-title');
        this.elements.finalPrize = document.getElementById('final-prize');
        this.elements.resultPlayerName = document.getElementById('result-player-name');
        this.elements.questionsAnswered = document.getElementById('questions-answered');
        this.elements.lifelinesLeft = document.getElementById('lifelines-left');
        this.elements.playAgainBtn = document.getElementById('play-again-btn');
        
        // النوافذ المنبثقة
        this.elements.helpModal = document.getElementById('help-modal');
        this.elements.withdrawModal = document.getElementById('withdraw-modal');
    }

    // تبديل الشاشات
    showScreen(screenName) {
        // إخفاء جميع الشاشات
        Object.keys(this.elements).forEach(key => {
            if (key.includes('Screen') && this.elements[key]) {
                this.elements[key].classList.remove('active');
            }
        });
        
        // عرض الشاشة المطلوبة
        const screen = this.elements[`${screenName}Screen`];
        if (screen) {
            screen.classList.add('active');
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
            this.elements.currentPrize.textContent = `الجائزة الحالية: ${amount.toLocaleString()} جنيه`;
        }
    }

    // تحديث رقم السؤال
    updateQuestionNumber(number, total) {
        if (this.elements.questionNumber) {
            this.elements.questionNumber.textContent = number;
        }
    }

    // تعطيل/تمكين الأزرار
    setButtonState(buttonId, disabled) {
        const button = this.elements[`${buttonId}Btn`];
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
            }
            
            if ([4, 9].includes(index)) {
                prizeItem.classList.add('safe');
            }
            
            prizeItem.innerHTML = `
                <div>${index + 1}</div>
                <div>${prize.toLocaleString()} جنيه</div>
            `;
            
            this.elements.prizesList.appendChild(prizeItem);
        });
    }

    // عرض الإشعار
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // تنظيف الخيارات
    clearOptions() {
        this.elements.optionButtons.forEach(btn => {
            btn.classList.remove('correct', 'wrong', 'selected');
            btn.disabled = false;
            btn.style.opacity = '1';
        });
    }
}

// تصدير نسخة واحدة
export const domManager = new DOMManager();
