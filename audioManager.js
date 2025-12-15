// audioManager.js
export class AudioManager {
    constructor() {
        this.enabled = true;
        this.volume = 0.7;
        this.sounds = new Map();
        this.audioContext = null;
        this.init();
    }

    init() {
        this.enabled = localStorage.getItem('soundEnabled') !== 'false';
        this.volume = parseFloat(localStorage.getItem('volume')) || 0.7;
        
        // محاولة إنشاء سياق الصوت
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API غير مدعومة في هذا المتصفح');
        }
    }

    createSound(frequency, duration, type = 'sine') {
        if (!this.enabled || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = type;
            oscillator.frequency.value = frequency;
            gainNode.gain.value = this.volume * 0.3;
            
            oscillator.start();
            
            // إيقاف الصوت بعد المدة المحددة
            setTimeout(() => {
                oscillator.stop();
            }, duration);
            
        } catch (error) {
            console.log('خطأ في إنشاء الصوت:', error);
        }
    }

    play(soundName) {
        if (!this.enabled) return;
        
        switch(soundName) {
            case 'correct':
                this.createSound(1200, 300); // صوت عالي للنصر
                break;
            case 'wrong':
                this.createSound(400, 500); // صوت منخفض للخطأ
                break;
            case 'click':
                this.createSound(800, 100); // صوت قصير للنقر
                break;
            case 'timer':
                this.createSound(600, 100); // صوت المؤقت
                break;
            case 'win':
                // تسلسل نغمات النجاح
                setTimeout(() => this.createSound(659.25, 200), 0);   // E
                setTimeout(() => this.createSound(783.99, 200), 200); // G
                setTimeout(() => this.createSound(1046.50, 400), 400); // C
                break;
            case 'lose':
                this.createSound(300, 800); // صوت طويل للخسارة
                break;
            case 'lifeline':
                this.createSound(1000, 300); // صوت سحري للمساعدة
                break;
            case 'start':
                this.createSound(523.25, 200); // C5
                break;
        }
    }

    stopAll() {
        // إعادة إنشاء سياق الصوت لإيقاف جميع الأصوات
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('volume', this.volume);
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('soundEnabled', this.enabled);
        return this.enabled;
    }

    isEnabled() {
        return this.enabled;
    }

    playBackgroundMusic() {
        // يمكن إضافة موسيقى خلفية هنا إذا لزم الأمر
        // نستخدم Web Audio API لإنشاء موسيقى خلفية بسيطة
        if (!this.enabled || !this.audioContext) return;
        
        try {
            // إنشاء نغمة خلفية بسيطة
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.value = 261.63; // C4
            gainNode.gain.value = this.volume * 0.1;
            
            // تشغيل النغمة بشكل متقطع
            const playTone = () => {
                gainNode.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2);
                
                setTimeout(() => {
                    if (this.enabled) {
                        oscillator.frequency.value = 261.63 + Math.random() * 100;
                        playTone();
                    }
                }, 3000 + Math.random() * 2000);
            };
            
            oscillator.start();
            playTone();
            
            // حفظ المرجع لإيقافه لاحقاً
            this.backgroundOscillator = oscillator;
            this.backgroundGain = gainNode;
            
        } catch (error) {
            console.log('خطأ في تشغيل موسيقى الخلفية:', error);
        }
    }

    stopBackgroundMusic() {
        if (this.backgroundOscillator) {
            this.backgroundOscillator.stop();
            this.backgroundOscillator = null;
            this.backgroundGain = null;
        }
    }
}

// تصدير نسخة واحدة
export const audioManager = new AudioManager();
