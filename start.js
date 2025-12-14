// start.js
import { CONFIG, MESSAGES } from './config.js';

class StartScreen {
    constructor() {
        this.playerNameInput = document.getElementById('player-name');
        this.startButton = document.getElementById('start-game-btn');
        this.modals = {
            instructions: document.getElementById('instructions-modal'),
            scores: document.getElementById('high-scores-modal'),
            credits: document.getElementById('credits-modal')
        };
        
        this.buttons = {
            soundToggle: document.getElementById('sound-toggle'),
            instructions: document.getElementById('instructions-btn'),
            scores: document.getElementById('high-scores-btn'),
            credits: document.getElementById('credits-btn'),
            closeInstructions: document.getElementById('close-instructions'),
            closeScores: document.getElementById('close-scores'),
            closeCredits: document.getElementById('close-credits'),
            understandBtn: document.getElementById('understand-btn')
        };
        
        this.soundEnabled = true;
        this.init();
    }
    
    init() {
        this.loadHighScores();
        this.setupEventListeners();
        this.animateElements();
        this.setupInstructions();
        this.setupCredits();
        this.focusPlayerName();
        
        // إضافة مؤثرات جسيمات للزر
        this.createButtonParticles();
    }
    
    loadHighScores() {
        // تحميل النتائج من localStorage
        try {
            this.highScores = JSON.parse(localStorage.getItem('millionaireHighScores')) || [];
        } catch (e) {
            this.highScores = [];
            localStorage.setItem('millionaireHighScores', JSON.stringify([]));
        }
        this.updateScoresDisplay();
    }
    
    updateScoresDisplay() {
        const scoresContent = document.querySelector('.scores-content');
        if (!scoresContent) return;
        
        if (this.highScores.length === 0) {
            scoresContent.innerHTML = `
                <div class="empty-scores">
                    <i class="fas fa-trophy" style="font-size: 3rem; color: var(--accent-color); margin-bottom: 20px;"></i>
                    <h4 style="color: white; margin-bottom: 10px;">لا توجد نتائج سابقة</h4>
                    <p style="color: rgba(255, 255, 255, 0.7);">كن أول من يفوز بالمليون!</p>
                </div>
            `;
            return;
        }
        
        scoresContent.innerHTML = `
            <div class="scores-list">
                ${this.highScores.slice(0, 10).map((score, index) => `
                    <div class="score-item ${index < 3 ? 'top-three' : ''}">
                        <div class="score-rank">${index + 1}</div>
                        <div class="score-name">${score.name}</div>
                        <div class="score-prize">${score.prize.toLocaleString()} $</div>
                        <div class="score-date">${new Date(score.date).toLocaleDateString('ar-EG')}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    setupInstructions() {
        const instructionsContent = document.querySelector('.instructions-content');
        instructionsContent.innerHTML = `
            <style>
                .instructions-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .instruction-item {
                    display: flex;
                    gap: 15px;
                    align-items: flex-start;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 15px;
                    border-radius: 10px;
                    border-right: 4px solid var(--accent-color);
                }
                
                .instruction-icon {
                    width: 50px;
                    height: 50px;
                    background: rgba(255, 215, 0, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                
                .instruction-icon i {
                    font-size: 1.5rem;
                    color: var(--accent-color);
                }
                
                .instruction-text h4 {
                    color: white;
                    margin-bottom: 8px;
                    font-size: 1.1rem;
                }
                
                .instruction-text p, .instruction-text li {
                    color: rgba(255, 255, 255, 0.8);
                    line-height: 1.6;
                }
                
                .instruction-text ul {
                    padding-right: 20px;
                    margin-top: 10px;
                }
                
                .instruction-text li {
                    margin-bottom: 5px;
                }
            </style>
            <div class="instructions-list">
                <div class="instruction-item">
                    <div class="instruction-icon">
                        <i class="fas fa-gamepad"></i>
                    </div>
                    <div class="instruction-text">
                        <h4>هدف اللعبة</h4>
                        <p>أجب على 15 سؤالاً متدرج الصعوبة للفوز بمليون دولار</p>
                    </div>
                </div>
                
                <div class="instruction-item">
                    <div class="instruction-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <div class="instruction-text">
                        <h4>خطوط الأمان</h4>
                        <p>عند السؤال 5 و 10، تكون الجائزة مضمونة حتى إذا أخطأت</p>
                    </div>
                </div>
                
                <div class="instruction-item">
                    <div class="instruction-icon">
                        <i class="fas fa-life-ring"></i>
                    </div>
                    <div class="instruction-text">
                        <h4>المساعدات</h4>
                        <p>لديك ثلاث مساعدات يمكن استخدامها مرة واحدة لكل منها:</p>
                        <ul>
                            <li><strong>50:50</strong> - إزالة إجابتين خاطئتين</li>
                            <li><strong>سؤال الجمهور</strong> - استطلاع رأي المشاهدين</li>
                            <li><strong>الاتصال بصديق</strong> - استشارة خبير لمدة 30 ثانية</li>
                        </ul>
                    </div>
                </div>
                
                <div class="instruction-item">
                    <div class="instruction-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="instruction-text">
                        <h4>المؤقت</h4>
                        <p>لديك 30 ثانية للإجابة على كل سؤال</p>
                    </div>
                </div>
                
                <div class="instruction-item">
                    <div class="instruction-icon">
                        <i class="fas fa-hand-holding-usd"></i>
                    </div>
                    <div class="instruction-text">
                        <h4>الانسحاب الآمن</h4>
                        <p>يمكنك الانسحاب بأي وقت وأخذ الجائزة الحالية</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupCredits() {
        const creditsContent = document.querySelector('.credits-content');
        creditsContent.innerHTML = `
            <style>
                .credits-info {
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
                }
                
                .developer-card {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 20px;
                    border-radius: 10px;
                }
                
                .developer-avatar {
                    width: 70px;
                    height: 70px;
                    background: linear-gradient(135deg, var(--accent-color), var(--accent-dark));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .developer-avatar i {
                    font-size: 2rem;
                    color: var(--dark-color);
                }
                
                .developer-info h4 {
                    color: white;
                    margin-bottom: 5px;
                    font-size: 1.3rem;
                }
                
                .developer-info p {
                    color: rgba(255, 255, 255, 0.7);
                }
                
                .game-info {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 20px;
                    border-radius: 10px;
                }
                
                .info-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 12px;
                    color: rgba(255, 255, 255, 0.8);
                }
                
                .info-item i {
                    color: var(--accent-color);
                    font-size: 1.2rem;
                    width: 25px;
                }
                
                .features-list {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 20px;
                    border-radius: 10px;
                }
                
                .features-list h4 {
                    color: white;
                    margin-bottom: 15px;
                    font-size: 1.2rem;
                }
                
                .features-list ul {
                    padding-right: 20px;
                }
                
                .features-list li {
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 8px;
                    line-height: 1.5;
                }
                
                .footer-credits {
                    text-align: center;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .footer-credits p {
                    color: rgba(255, 255, 255, 0.6);
                    margin-bottom: 5px;
                }
            </style>
            <div class="credits-info">
                <div class="developer-card">
                    <div class="developer-avatar">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="developer-info">
                        <h4>المليونير الذهبي</h4>
                        <p>لعبة "من سيربح المليون" الإصدار الذهبي</p>
                    </div>
                </div>
                
                <div class="game-info">
                    <div class="info-item">
                        <i class="fas fa-code"></i>
                        <span>تم التطوير باستخدام HTML5, CSS3, JavaScript</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-palette"></i>
                        <span>تصميم واجهة مستخدم متقدمة</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-music"></i>
                        <span>مؤثرات صوتية وبصرية</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-mobile-alt"></i>
                        <span>متوافق مع جميع الأجهزة</span>
                    </div>
                </div>
                
                <div class="features-list">
                    <h4>مميزات الإصدار:</h4>
                    <ul>
                        <li>15 سؤالاً متدرج الصعوبة</li>
                        <li>3 مساعدات خاصة</li>
                        <li>نظام توقيت</li>
                        <li>تسجيل النتائج</li>
                        <li>واجهة مستخدم تفاعلية</li>
                    </ul>
                </div>
                
                <div class="footer-credits">
                    <p>© 2024 - جميع الحقوق محفوظة</p>
                    <p>تم التطوير بكل ❤️ للمتعة والتعلم</p>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        // زر بدء اللعبة
        this.startButton.addEventListener('click', () => this.startGame());
        
        // إدخال الاسم عند الضغط على Enter
        this.playerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startGame();
            }
        });
        
        // تبديل الصوت
        this.buttons.soundToggle.addEventListener('click', () => this.toggleSound());
        
        // فتح النوافذ
        this.buttons.instructions.addEventListener('click', () => this.openModal('instructions'));
        this.buttons.scores.addEventListener('click', () => this.openModal('scores'));
        this.buttons.credits.addEventListener('click', () => this.openModal('credits'));
        
        // إغلاق النوافذ
        this.buttons.closeInstructions.addEventListener('click', () => this.closeModal('instructions'));
        this.buttons.closeScores.addEventListener('click', () => this.closeModal('scores'));
        this.buttons.closeCredits.addEventListener('click', () => this.closeModal('credits'));
        this.buttons.understandBtn.addEventListener('click', () => this.closeModal('instructions'));
        
        // إغلاق النوافذ عند النقر خارجها
        Object.keys(this.modals).forEach(modal => {
            this.modals[modal].addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay')) {
                    this.closeModal(modal);
                }
            });
        });
        
        // تأثيرات hover على البطاقات الإحصائية
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('mouseenter', () => this.animateStatCard(card));
        });
    }
    
    animateElements() {
        // إضافة تأثيرات للبطاقات الإحصائية
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
        
        // إضافة تأثيرات لبطاقات المميزات
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1 + 0.3}s`;
        });
        
        // إضافة توهج دوري للتاج
        this.addCrownPulse();
    }
    
    addCrownPulse() {
        const crown = document.querySelector('.logo-icon i');
        setInterval(() => {
            crown.style.filter = 'drop-shadow(0 0 25px rgba(255, 215, 0, 0.8))';
            setTimeout(() => {
                crown.style.filter = 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.5))';
            }, 500);
        }, 3000);
    }
    
    createButtonParticles() {
        const particlesContainer = document.querySelector('.button-particles');
        
        // إنشاء جسيمات ذهبية
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: radial-gradient(circle, var(--accent-color), var(--accent-dark));
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.3};
                pointer-events: none;
                animation: particleFloat ${Math.random() * 3 + 2}s infinite ease-in-out;
                animation-delay: ${Math.random() * 2}s;
            `;
            
            // وضع عشوائي داخل الزر
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            
            particlesContainer.appendChild(particle);
        }
        
        // إضافة أنماط CSS للجسيمات
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% { 
                    transform: translate(0, 0) scale(1); 
                    opacity: 0.3;
                }
                50% { 
                    transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(1.2); 
                    opacity: 0.8;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    animateStatCard(card) {
        const icon = card.querySelector('.stat-icon i');
        icon.style.transition = 'transform 0.3s ease';
        icon.style.transform = 'rotate(15deg) scale(1.2)';
        
        setTimeout(() => {
            icon.style.transform = 'rotate(0) scale(1)';
        }, 300);
    }
    
    focusPlayerName() {
        // تركيز المؤشر على حقل الاسم بعد تأخير بسيط
        setTimeout(() => {
            this.playerNameInput.focus();
            
            // إضافة تأثير اهتزاز بسيط لجذب الانتباه
            this.playerNameInput.animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0)' }
            ], {
                duration: 500,
                iterations: 1
            });
        }, 1000);
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const icon = this.buttons.soundToggle.querySelector('i');
        const text = this.buttons.soundToggle.querySelector('.setting-text');
        
        if (this.soundEnabled) {
            icon.className = 'fas fa-volume-up';
            text.textContent = 'الصوت';
            this.showNotification('تم تشغيل الصوت', 'success');
        } else {
            icon.className = 'fas fa-volume-mute';
            text.textContent = 'كتم';
            this.showNotification('تم كتم الصوت', 'warning');
        }
        
        // حفظ الإعداد
        localStorage.setItem('millionaireSoundEnabled', this.soundEnabled);
    }
    
    openModal(modalName) {
        this.modals[modalName].classList.add('active');
        
        // تحريك المؤشر للنافذة المفتوحة
        setTimeout(() => {
            const closeBtn = this.modals[modalName].querySelector('.modal-close');
            if (closeBtn) closeBtn.focus();
        }, 100);
    }
    
    closeModal(modalName) {
        this.modals[modalName].classList.remove('active');
        
        // إعادة التركيز على زر الإدخال
        setTimeout(() => {
            this.playerNameInput.focus();
        }, 100);
    }
    
    startGame() {
        const playerName = this.playerNameInput.value.trim();
        
        if (!playerName) {
            this.showNotification('الرجاء إدخال اسمك أولاً!', 'error');
            this.playerNameInput.focus();
            return;
        }
        
        if (playerName.length < 2) {
            this.showNotification('الاسم يجب أن يكون على الأقل حرفين', 'error');
            this.playerNameInput.focus();
            return;
        }
        
        // عرض رسالة التحميل
        this.showLoading();
        
        // حفظ اسم اللاعب في localStorage
        localStorage.setItem('millionairePlayerName', playerName);
        
        // الانتقال للعبة بعد تأخير بسيط
        setTimeout(() => {
            this.transitionToGame(playerName);
        }, 1500);
    }
    
    showLoading() {
        // تغيير نص الزر وإضافة تأثير التحميل
        const buttonContent = this.startButton.querySelector('.button-content');
        const originalContent = buttonContent.innerHTML;
        
        buttonContent.innerHTML = `
            <div class="loading-spinner"></div>
            <span class="button-text">جاري التحضير...</span>
        `;
        
        this.startButton.disabled = true;
        this.startButton.style.opacity = '0.8';
        
        // إضافة أنماط CSS لل spinner
        const style = document.createElement('style');
        style.textContent = `
            .loading-spinner {
                width: 20px;
                height: 20px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-top-color: var(--dark-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // إضافة تأثير تمويه للصفحة
        document.body.style.filter = 'blur(2px)';
        document.body.style.transition = 'filter 0.5s ease';
        
        // استعادة الزر بعد تأخير
        setTimeout(() => {
            buttonContent.innerHTML = originalContent;
            this.startButton.disabled = false;
            this.startButton.style.opacity = '1';
            document.body.style.filter = 'none';
        }, 1500);
    }
    
    transitionToGame(playerName) {
        // تأثيرات الخروج
        const startContainer = document.querySelector('.start-container');
        startContainer.style.animation = 'fadeOut 0.5s ease forwards';
        
        // عرض رسالة نجاح
        this.showNotification(`مرحباً ${playerName}! جاهز للعب؟`, 'success');
        
        // بعد انتهاء المؤثر، تحميل صفحة اللعبة
        setTimeout(() => {
            window.location.href = 'game.html'; // سيتم إنشاء game.html بعد قليل
        }, 1000);
    }
    
    showNotification(message, type = 'info') {
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 
                                  type === 'warning' ? 'exclamation-triangle' : 
                                  type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // إضافة أنماط CSS للإشعارات
        const style = document.createElement('style');
        style.textContent = `
            .notification-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .notification-content i {
                font-size: 1.5rem;
            }
            
            .notification.success {
                border-right-color: var(--success-color);
            }
            
            .notification.error {
                border-right-color: var(--error-color);
            }
            
            .notification.warning {
                border-right-color: var(--warning-color);
            }
            
            .notification-content span {
                flex: 1;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.5);
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: var(--transition);
            }
            
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                to {
                    opacity: 0;
                    transform: translateY(-20px);
                }
            }
        `;
        if (!document.querySelector('#notification-styles')) {
            style.id = 'notification-styles';
            document.head.appendChild(style);
        }
        
        // إضافة الإشعار للصفحة
        document.body.appendChild(notification);
        
        // إضافة مستمع حدث للإغلاق
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'fadeOut 0.5s ease forwards';
            setTimeout(() => {
                notification.remove();
            }, 500);
        });
        
        // إزالة الإشعار تلقائياً بعد 5 ثوانٍ
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'fadeOut 0.5s ease forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 5000);
    }
}

// تهيئة شاشة البداية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const startScreen = new StartScreen();
    console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION} - Start Screen Loaded`);
    
    // تحميل إعدادات الصوت المحفوظة
    const savedSound = localStorage.getItem('millionaireSoundEnabled');
    if (savedSound !== null) {
        startScreen.soundEnabled = savedSound === 'true';
        const icon = startScreen.buttons.soundToggle.querySelector('i');
        const text = startScreen.buttons.soundToggle.querySelector('.setting-text');
        
        if (!startScreen.soundEnabled) {
            icon.className = 'fas fa-volume-mute';
            text.textContent = 'كتم';
        }
    }
});
