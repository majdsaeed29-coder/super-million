
// start.js - ملف شاشة البداية المنفصلة
class StartScreen {
    constructor() {
        this.init();
    }

    init() {
        console.log('Start Screen Initialized');
        this.cacheElements();
        this.setupEventListeners();
        this.loadSavedData();
        this.animateBackground();
    }

    cacheElements() {
        this.playerNameInput = document.getElementById('player-name');
        this.startButton = document.getElementById('start-game-btn');
        this.soundToggle = document.getElementById('sound-toggle');
        this.instructionsBtn = document.getElementById('instructions-btn');
        this.highScoresBtn = document.getElementById('high-scores-btn');
        this.creditsBtn = document.getElementById('credits-btn');
        
        this.modals = {
            instructions: document.getElementById('instructions-modal'),
            scores: document.getElementById('high-scores-modal'),
            credits: document.getElementById('credits-modal')
        };
    }

    setupEventListeners() {
        // زر بدء اللعبة
        this.startButton.addEventListener('click', () => this.startGame());
        
        // Enter للبدء
        this.playerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startGame();
        });
        
        // الإعدادات
        this.soundToggle.addEventListener('click', () => this.toggleSound());
        this.instructionsBtn.addEventListener('click', () => this.openModal('instructions'));
        this.highScoresBtn.addEventListener('click', () => this.openModal('scores'));
        this.creditsBtn.addEventListener('click', () => this.openModal('credits'));
        
        // إغلاق النوافذ
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) modal.classList.remove('active');
            });
        });
        
        // إغلاق بالنقر خارج النافذة
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay')) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    loadSavedData() {
        // تحميل اسم اللاعب السابق
        const savedName = localStorage.getItem('millionairePlayerName');
        if (savedName) {
            this.playerNameInput.value = savedName;
        }
        
        // تحميل إعداد الصوت
        const soundEnabled = localStorage.getItem('millionaireSoundEnabled') !== 'false';
        this.updateSoundButton(soundEnabled);
        
        // تحميل النتائج العالية
        this.loadHighScores();
    }

    loadHighScores() {
        const scores = JSON.parse(localStorage.getItem('millionaireHighScores')) || [];
        const scoresContent = document.querySelector('.scores-content');
        
        if (scores.length === 0) {
            scoresContent.innerHTML = '<p class="empty">لا توجد نتائج سابقة</p>';
            return;
        }
        
        scoresContent.innerHTML = scores.slice(0, 10).map((score, index) => `
            <div class="score-item">
                <span class="rank">${index + 1}</span>
                <span class="name">${score.name}</span>
                <span class="prize">${score.prize.toLocaleString()} $</span>
            </div>
        `).join('');
    }

    toggleSound() {
        const current = localStorage.getItem('millionaireSoundEnabled') !== 'false';
        const newState = !current;
        localStorage.setItem('millionaireSoundEnabled', newState);
        this.updateSoundButton(newState);
    }

    updateSoundButton(isEnabled) {
        const icon = this.soundToggle.querySelector('i');
        const text = this.soundToggle.querySelector('.setting-text');
        
        if (isEnabled) {
            icon.className = 'fas fa-volume-up';
            text.textContent = 'الصوت';
        } else {
            icon.className = 'fas fa-volume-mute';
            text.textContent = 'كتم';
        }
    }

    openModal(modalName) {
        this.modals[modalName].classList.add('active');
    }

    startGame() {
        const playerName = this.playerNameInput.value.trim();
        
        if (!playerName) {
            this.showError('الرجاء إدخال اسمك');
            this.playerNameInput.focus();
            return;
        }
        
        if (playerName.length < 2) {
            this.showError('الاسم يجب أن يكون على الأقل حرفين');
            this.playerNameInput.focus();
            return;
        }
        
        // حفظ اسم اللاعب
        localStorage.setItem('millionairePlayerName', playerName);
        
        // عرض تأثير التحميل
        this.showLoading();
        
        // الانتقال للعبة بعد 1.5 ثانية
        setTimeout(() => {
            window.location.href = 'game.html';
        }, 1500);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        document.querySelector('.player-section').appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    showLoading() {
        const originalContent = this.startButton.innerHTML;
        this.startButton.innerHTML = `
            <div class="loading-spinner"></div>
            <span>جاري التحميل...</span>
        `;
        this.startButton.disabled = true;
        
        // إضافة تأثير تمويه
        document.querySelector('.start-container').style.filter = 'blur(2px)';
    }

    animateBackground() {
        // إضافة نجوم متحركة
        const stars = document.querySelector('.stars');
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3}px;
                height: ${Math.random() * 3}px;
                background: white;
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.5 + 0.5};
                animation: twinkle ${Math.random() * 3 + 2}s infinite alternate;
            `;
            stars.appendChild(star);
        }
        
        // إضافة CSS للنجوم
        const style = document.createElement('style');
        style.textContent = `
            @keyframes twinkle {
                0% { opacity: 0.2; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

// بدء شاشة البداية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const startScreen = new StartScreen();
});
