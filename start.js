class StartPage {
    constructor() {
        this.init();
    }

    init() {
        console.log('المليونير الذهبي - صفحة البداية');
        
        this.setupTabs();
        this.setupForms();
        this.setupEventListeners();
        this.loadUserPreferences();
        
        // تشغيل موسيقى الخلفية
        this.playBackgroundMusic();
    }

    setupTabs() {
        const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        });

        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        });
    }

    setupForms() {
        // نموذج تسجيل الدخول
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // نموذج إنشاء حساب
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistration();
        });
    }

    setupEventListeners() {
        // زر الدخول كزائر
        document.getElementById('play-as-guest').addEventListener('click', () => {
            this.playAsGuest();
        });

        // زر البدء السريع
        document.getElementById('quick-start').addEventListener('click', () => {
            this.quickStart();
        });

        // إعدادات المؤقت
        document.getElementById('timer-toggle').addEventListener('change', (e) => {
            this.saveSetting('timerEnabled', e.target.checked);
        });

        // نوع الأسئلة
        document.getElementById('question-type').addEventListener('change', (e) => {
            this.saveSetting('questionType', e.target.value);
        });

        // مستوى الصعوبة
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.saveSetting('difficulty', e.target.value);
        });

        // مستوى الصوت
        document.getElementById('volume').addEventListener('change', (e) => {
            this.saveSetting('volume', e.target.value);
            this.updateMusicVolume(e.target.value);
        });
    }

    loadUserPreferences() {
        // تحميل الإعدادات المحفوظة
        const timerEnabled = localStorage.getItem('timerEnabled') !== 'false';
        const questionType = localStorage.getItem('questionType') || 'all';
        const difficulty = localStorage.getItem('difficulty') || 'medium';
        const volume = localStorage.getItem('volume') || '70';

        // تعيين القيم
        document.getElementById('timer-toggle').checked = timerEnabled;
        document.getElementById('question-type').value = questionType;
        document.getElementById('difficulty').value = difficulty;
        document.getElementById('volume').value = volume;

        // تحميل بيانات المستخدم
        const lastUser = localStorage.getItem('lastUser');
        if (lastUser) {
            document.getElementById('login-username').value = lastUser;
        }
    }

    saveSetting(key, value) {
        localStorage.setItem(key, value);
    }

    async handleLogin() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const rememberMe = document.getElementById('remember-me').checked;

        if (!username || !password) {
            this.showNotification('يرجى ملء جميع الحقول', 'error');
            return;
        }

        try {
            // محاكاة تسجيل الدخول
            this.showLoading(true);
            
            // التحقق من المستخدم في localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                // حفظ بيانات الجلسة
                const sessionData = {
                    username: user.username,
                    email: user.email,
                    level: user.level || 1,
                    score: user.score || 0,
                    gamesPlayed: user.gamesPlayed || 0,
                    lastLogin: new Date().toISOString()
                };

                localStorage.setItem('currentUser', JSON.stringify(sessionData));
                
                if (rememberMe) {
                    localStorage.setItem('lastUser', username);
                }

                this.showNotification('تم تسجيل الدخول بنجاح!', 'success');
                await this.delay(1000);
                
                this.startGame(sessionData);
            } else {
                this.showNotification('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
            }
        } catch (error) {
            this.showNotification('حدث خطأ أثناء تسجيل الدخول', 'error');
            console.error(error);
        } finally {
            this.showLoading(false);
        }
    }

    async handleRegistration() {
        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value.trim();
        const confirmPassword = document.getElementById('register-confirm').value.trim();

        // التحقق من صحة البيانات
        if (!username || !email || !password || !confirmPassword) {
            this.showNotification('يرجى ملء جميع الحقول', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('كلمة المرور غير متطابقة', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }

        try {
            this.showLoading(true);

            // تحميل المستخدمين الحاليين
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // التحقق من عدم وجود المستخدم مسبقاً
            if (users.some(u => u.username === username)) {
                this.showNotification('اسم المستخدم موجود مسبقاً', 'error');
                return;
            }

            if (users.some(u => u.email === email)) {
                this.showNotification('البريد الإلكتروني موجود مسبقاً', 'error');
                return;
            }

            // إضافة المستخدم الجديد
            const newUser = {
                username,
                email,
                password, // في الواقع يجب تشفير كلمة المرور
                createdAt: new Date().toISOString(),
                level: 1,
                score: 0,
                gamesPlayed: 0
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // تسجيل الدخول تلقائياً
            const sessionData = {
                username: newUser.username,
                email: newUser.email,
                level: newUser.level,
                score: newUser.score,
                gamesPlayed: newUser.gamesPlayed,
                lastLogin: new Date().toISOString()
            };

            localStorage.setItem('currentUser', JSON.stringify(sessionData));
            localStorage.setItem('lastUser', username);

            this.showNotification('تم إنشاء الحساب بنجاح!', 'success');
            await this.delay(1000);
            
            this.startGame(sessionData);
        } catch (error) {
            this.showNotification('حدث خطأ أثناء إنشاء الحساب', 'error');
            console.error(error);
        } finally {
            this.showLoading(false);
        }
    }

    playAsGuest() {
        const guestUser = {
            username: 'زائر_' + Math.floor(Math.random() * 10000),
            isGuest: true,
            level: 1,
            score: 0,
            gamesPlayed: 0,
            lastLogin: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(guestUser));
        this.showNotification('مرحباً بك كزائر!', 'info');
        
        setTimeout(() => {
            this.startGame(guestUser);
        }, 1000);
    }

    quickStart() {
        const timerEnabled = document.getElementById('timer-toggle').checked;
        const questionType = document.getElementById('question-type').value;
        const difficulty = document.getElementById('difficulty').value;
        
        const settings = {
            timerEnabled,
            questionType,
            difficulty,
            quickStart: true
        };

        localStorage.setItem('gameSettings', JSON.stringify(settings));
        
        if (!localStorage.getItem('currentUser')) {
            this.playAsGuest();
        } else {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            this.startGame(user);
        }
    }

    startGame(user) {
        // حفظ إحصائيات اللاعب
        this.savePlayerStats(user);
        
        // تشغيل صوت البدء
        this.playStartSound();
        
        // الانتقال إلى صفحة اللعبة
        setTimeout(() => {
            window.location.href = 'game.html';
        }, 500);
    }

    savePlayerStats(user) {
        const stats = JSON.parse(localStorage.getItem('gameStats') || '{}');
        
        if (!stats.totalPlayers) stats.totalPlayers = 0;
        if (!stats.totalGames) stats.totalGames = 0;
        
        stats.totalPlayers++;
        stats.lastPlayer = user.username;
        stats.lastLogin = new Date().toISOString();
        
        localStorage.setItem('gameStats', JSON.stringify(stats));
    }

    playBackgroundMusic() {
        // يمكن إضافة موسيقى خلفية هنا
        const volume = document.getElementById('volume').value;
        this.updateMusicVolume(volume);
    }

    updateMusicVolume(volume) {
        // تحديث مستوى صوت الموسيقى
        const normalizedVolume = parseInt(volume) / 100;
        console.log(`مستوى الصوت: ${normalizedVolume}`);
        
        // يمكن إضافة رمز للتحكم بالموسيقى هنا
    }

    playStartSound() {
        // تشغيل صوت البدء
        try {
            const audio = new Audio();
            audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-game-ball-tap-2073.mp3';
            audio.volume = 0.3;
            audio.play();
        } catch (error) {
            console.log('لم يتمكن من تشغيل الصوت');
        }
    }

    showNotification(message, type = 'info') {
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;

        // إضافة الإشعار للصفحة
        document.body.appendChild(notification);

        // إضافة التصميم
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #1e3799, #0c2461);
                border-radius: 10px;
                padding: 15px 20px;
                border-right: 5px solid;
                border-color: #ffd700;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 1000;
                animation: slideIn 0.5s ease;
            }
            
            .notification.success {
                border-color: #27ae60;
            }
            
            .notification.error {
                border-color: #e74c3c;
            }
            
            .notification.info {
                border-color: #3498db;
            }
            
            .notification i {
                font-size: 1.5rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.7);
                cursor: pointer;
                padding: 0;
                margin-right: auto;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        // إزالة الإشعار بعد 5 ثوان
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 5000);

        // إغلاق الإشعار يدوياً
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
            style.remove();
        });
    }

    showLoading(show) {
        const buttons = document.querySelectorAll('button');
        
        if (show) {
            buttons.forEach(btn => {
                btn.disabled = true;
                btn.classList.add('loading');
            });
        } else {
            buttons.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('loading');
            });
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// بدء تشغيل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const startPage = new StartPage();
});
