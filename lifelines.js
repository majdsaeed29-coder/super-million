import { gameState } from './gameState.js';
import { domManager } from './domManager.js';

class Lifelines {
    // مساعدة 50:50
    useFiftyFifty() {
        if (!gameState.lifelines.fiftyFifty) return false;
        
        const currentQuestion = gameLogic.currentQuestion;
        if (!currentQuestion) return false;
        
        const correctIndex = currentQuestion.correct;
        let wrongOptions = [0, 1, 2, 3].filter(idx => idx !== correctIndex);
        
        // اختيار إجابتين خاطئتين عشوائياً
        wrongOptions.sort(() => Math.random() - 0.5);
        const toRemove = wrongOptions.slice(0, 2);
        
        // إخفاء الإجابتين
        toRemove.forEach(idx => {
            const button = domManager.elements.optionButtons[idx];
            button.style.opacity = '0.3';
            button.disabled = true;
        });
        
        // تحديث حالة المساعدة
        gameState.useLifeline('fiftyFifty');
        domManager.setButtonState('fiftyFifty', true);
        
        return true;
    }

    // مساعدة سؤال الجمهور
    useAskAudience() {
        if (!gameState.lifelines.askAudience) return false;
        
        const currentQuestion = gameLogic.currentQuestion;
        if (!currentQuestion) return false;
        
        const correctIndex = currentQuestion.correct;
        let percentages = [0, 0, 0, 0];
        percentages[correctIndex] = 50 + Math.floor(Math.random() * 30);
        
        let remaining = 100 - percentages[correctIndex];
        for (let i = 0; i < 4; i++) {
            if (i !== correctIndex) {
                percentages[i] = Math.floor(Math.random() * remaining);
                remaining -= percentages[i];
            }
        }
        
        // عرض النتيجة
        this.showAudienceResult(percentages);
        
        // تحديث حالة المساعدة
        gameState.useLifeline('askAudience');
        domManager.setButtonState('askAudience', true);
        
        return true;
    }

    // عرض نتيجة تصويت الجمهور
    showAudienceResult(percentages) {
        const resultHTML = `
            <div class="audience-result">
                <h3>نتيجة تصويت الجمهور:</h3>
                <div class="audience-bars">
                    ${percentages.map((pct, idx) => `
                        <div class="audience-bar">
                            <div class="bar-label">${['أ', 'ب', 'ج', 'د'][idx]}</div>
                            <div class="bar-container">
                                <div class="bar-fill" style="height: ${pct}%"></div>
                            </div>
                            <div class="bar-value">${pct}%</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        domManager.showNotification(resultHTML, 'info');
    }

    // مساعدة الاتصال بصديق
    usePhoneFriend() {
        if (!gameState.lifelines.phoneFriend) return false;
        
        const currentQuestion = gameLogic.currentQuestion;
        if (!currentQuestion) return false;
        
        const correctIndex = currentQuestion.correct;
        const confidence = Math.random() * 100;
        
        let friendAnswer;
        if (confidence > 70) {
            friendAnswer = `أعتقد أن الإجابة الصحيحة هي ${['أ', 'ب', 'ج', 'د'][correctIndex]} (${confidence.toFixed(0)}% متأكد)`;
        } else {
            const randomOption = Math.floor(Math.random() * 4);
            friendAnswer = `أعتقد أن الإجابة هي ${['أ', 'ب', 'ج', 'د'][randomOption]} (${confidence.toFixed(0)}% متأكد)`;
        }
        
        // عرض المكالمة
        this.showPhoneCall(friendAnswer);
        
        // تحديث حالة المساعدة
        gameState.useLifeline('phoneFriend');
        domManager.setButtonState('phoneFriend', true);
        
        return true;
    }

    // عرض مكالمة الصديق
    showPhoneCall(message) {
        const callHTML = `
            <div class="phone-call">
                <div class="call-header">
                    <i class="fas fa-phone"></i>
                    <span>مكالمة مع الصديق...</span>
                </div>
                <div class="call-message">
                    "${message}"
                </div>
            </div>
        `;
        
        domManager.showNotification(callHTML, 'info');
    }

    // إعادة تعيين المساعدات
    resetLifelines() {
        gameState.lifelines = {
            fiftyFifty: true,
            askAudience: true,
            phoneFriend: true
        };
        
        // تحديث الأزرار
        ['fiftyFifty', 'askAudience', 'phoneFriend'].forEach(btn => {
            domManager.setButtonState(btn, false);
        });
    }
}

export const lifelines = new Lifelines();
