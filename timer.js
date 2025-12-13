import { CONFIG } from './config.js';
import { domManager } from './domManager.js';

class Timer {
    constructor() {
        this.timeLeft = CONFIG.TIME_PER_QUESTION;
        this.interval = null;
        this.isRunning = false;
        this.onTimeUp = null;
    }

    start() {
        this.reset();
        this.isRunning = true;
        
        this.interval = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.stop();
                if (this.onTimeUp) this.onTimeUp();
            }
        }, 1000);
    }

    stop() {
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    pause() {
        if (this.isRunning) {
            this.stop();
        }
    }

    resume() {
        if (!this.isRunning && this.timeLeft > 0) {
            this.start();
        }
    }

    reset() {
        this.stop();
        this.timeLeft = CONFIG.TIME_PER_QUESTION;
        this.updateDisplay();
    }

    updateDisplay() {
        // تحديث عرض المؤقت في الواجهة
        const timerElement = document.querySelector('.timer-display');
        if (timerElement) {
            timerElement.textContent = this.timeLeft;
            
            // تغيير اللون عند اقتراب الوقت للنفاد
            if (this.timeLeft <= 10) {
                timerElement.classList.add('warning');
            }
            if (this.timeLeft <= 5) {
                timerElement.classList.add('danger');
            }
        }
    }

    getTime() {
        return this.timeLeft;
    }
}

export const timer = new Timer();
