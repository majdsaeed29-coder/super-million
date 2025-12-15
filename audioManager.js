// audioManager.js - النسخة المحسنة مع موسيقى حماسية
export class AudioManager {
    constructor() {
        this.enabled = true;
        this.volume = 0.7;
        this.sounds = new Map();
        this.audioContext = null;
        this.activeSounds = new Set();
        this.backgroundMusic = null;
        this.init();
    }

    init() {
        this.enabled = localStorage.getItem('soundEnabled') !== 'false';
        this.volume = parseFloat(localStorage.getItem('volume')) || 0.7;
        
        // إنشاء سياق الصوت
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('✅ نظام الصوت جاهز');
        } catch (e) {
            console.log('⚠️ Web Audio API غير مدعومة');
        }
        
        // تحميل الأصوات الأساسية
        this.loadBaseSounds();
    }

    loadBaseSounds() {
        // هنا يمكنك إضافة روابط لملفات MP3 حقيقية
        // لكن سنستخدم Web Audio API لإنشاء أصوات أجمل
    }

    // موسيقى الخلفية الحماسية
    playBackgroundMusic(type = 'menu') {
        if (!this.enabled || !this.audioContext) return;
        
        this.stopBackgroundMusic();
        
        try {
            // إنشاء موسيقى حماسية باستخدام Web Audio API
            const oscillator1 = this.audioContext.createOscillator();
            const oscillator2 = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            // توصيل كل شيء
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // إعداد الأوسيلاتورات
            oscillator1.type = 'sine';
            oscillator2.type = 'triangle';
            
            // التسلسل الموسيقي الحماسي
            const notes = [
                { freq: 523.25, duration: 0.5 },  // C5
                { freq: 587.33, duration: 0.5 },  // D5
                { freq: 659.25, duration: 0.5 },  // E5
                { freq: 698.46, duration: 0.5 },  // F5
                { freq: 783.99, duration: 0.5 },  // G5
                { freq: 880.00, duration: 0.5 },  // A5
                { freq: 987.77, duration: 0.5 },  // B5
                { freq: 1046.50, duration: 1.0 }  // C6
            ];
            
            const currentTime = this.audioContext.currentTime;
            let scheduleTime = currentTime;
            
            // جدولة النوتات
            notes.forEach((note, index) => {
                // تغيير الترددات تدريجياً
                oscillator1.frequency.setValueAtTime(note.freq, scheduleTime);
                oscillator2.frequency.setValueAtTime(note.freq * 0.5, scheduleTime);
                
                // تغيير مستوى الصوت
                gainNode.gain.setValueAtTime(this.volume * 0.1, scheduleTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, scheduleTime + note.duration);
                
                scheduleTime += note.duration;
            });
            
            // البدء والتوقف
            oscillator1.start(currentTime);
            oscillator2.start(currentTime);
            
            // التكرار
            const loopInterval = setInterval(() => {
                if (!this.enabled) {
                    clearInterval(loopInterval);
                    return;
                }
                
                const newTime = this.audioContext.currentTime;
                let newScheduleTime = newTime;
                
                notes.forEach((note, index) => {
                    oscillator1.frequency.setValueAtTime(note.freq, newScheduleTime);
                    oscillator2.frequency.setValueAtTime(note.freq * 0.5, newScheduleTime);
                    newScheduleTime += note.duration;
                });
            }, 4000); // 4 ثواني لكل جملة موسيقية
            
            // حفظ المرجع للتعديل لاحقاً
            this.backgroundMusic = {
                oscillator1,
                oscillator2,
                gainNode,
                loopInterval
            };
            
        } catch (error) {
            console.log('❌ خطأ في موسيقى الخلفية:', error);
        }
    }

    // موسيقى اللعبة (أكثر إثارة)
    playGameMusic() {
        if (!this.enabled || !this.audioContext) return;
        
        this.stopBackgroundMusic();
        
        try {
            // مؤثرات موسيقية للعبة
            const oscillators = [];
            const gainNodes = [];
            
            // إنشاء 3 طبقات صوتية
            for (let i = 0; i < 3; i++) {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.type = i === 0 ? 'sine' : i === 1 ? 'triangle' : 'sawtooth';
                
                oscillators.push(oscillator);
                gainNodes.push(gainNode);
            }
            
            // تسلسل نغمات حماسية للعبة
            const gameNotes = [
                { freqs: [392.00, 523.25, 783.99], duration: 0.3 },  // G4, C5, G5
                { freqs: [440.00, 587.33, 880.00], duration: 0.3 },  // A4, D5, A5
                { freqs: [493.88, 659.25, 987.77], duration: 0.3 },  // B4, E5, B5
                { freqs: [523.25, 783.99, 1046.50], duration: 0.6 }  // C5, G5, C6
            ];
            
            const playSequence = () => {
                if (!this.enabled) return;
                
                const currentTime = this.audioContext.currentTime;
                let scheduleTime = currentTime;
                
                gameNotes.forEach((note, index) => {
                    // تعيين الترددات لكل طبقة
                    oscillators.forEach((osc, oscIndex) => {
                        osc.frequency.setValueAtTime(note.freqs[oscIndex] || note.freqs[0], scheduleTime);
                    });
                    
                    // تعيين مستوى الصوت
                    gainNodes.forEach((gain, gainIndex) => {
                        gain.gain.setValueAtTime(this.volume * (0.08 - (gainIndex * 0.02)), scheduleTime);
                        gain.gain.exponentialRampToValueAtTime(0.001, scheduleTime + note.duration);
                    });
                    
                    scheduleTime += note.duration;
                });
                
                // تكرار التسلسل
                setTimeout(playSequence, 2000);
            };
            
            // بدء الأوسيلاتورات
            oscillators.forEach(osc => osc.start());
            
            // بدء التسلسل
            playSequence();
            
            // حفظ المرجع
            this.backgroundMusic = {
                oscillators,
                gainNodes,
                playSequence
            };
            
        } catch (error) {
            console.log('❌ خطأ في موسيقى اللعبة:', error);
        }
    }

    // موسيقى النتائج (نصر)
    playVictoryMusic() {
        if (!this.enabled || !this.audioContext) return;
        
        this.stopBackgroundMusic();
        
        try {
            // نغمات النصر الحماسية
            const victoryNotes = [
                { freq: 659.25, duration: 0.2 },  // E5
                { freq: 783.99, duration: 0.2 },  // G5
                { freq: 1046.50, duration: 0.4 }, // C6
                { freq: 1174.66, duration: 0.2 }, // D6
                { freq: 1318.51, duration: 0.2 }, // E6
                { freq: 1567.98, duration: 0.4 }  // G6
            ];
            
            // إنشاء عدة طبقات للثراء الصوتي
            for (let layer = 0; layer < 2; layer++) {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.type = layer === 0 ? 'sine' : 'triangle';
                
                const currentTime = this.audioContext.currentTime + (layer * 0.05);
                let scheduleTime = currentTime;
                
                // جدولة النوتات
                victoryNotes.forEach((note, index) => {
                    oscillator.frequency.setValueAtTime(
                        note.freq * (layer === 1 ? 0.5 : 1), 
                        scheduleTime
                    );
                    
                    gainNode.gain.setValueAtTime(0, scheduleTime);
                    gainNode.gain.linearRampToValueAtTime(
                        this.volume * (0.15 - (layer * 0.05)), 
                        scheduleTime + 0.01
                    );
                    gainNode.gain.exponentialRampToValueAtTime(
                        0.001, 
                        scheduleTime + note.duration
                    );
                    
                    scheduleTime += note.duration;
                });
                
                oscillator.start(currentTime);
                oscillator.stop(scheduleTime);
                
                // إضافة للتتبع
                this.activeSounds.add(oscillator);
                oscillator.onended = () => this.activeSounds.delete(oscillator);
            }
            
            // إضافة طبقة إيقاعية
            setTimeout(() => {
                if (!this.enabled) return;
                
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.type = 'square';
                oscillator.frequency.value = 65.41; // C2 منخفض
                
                const now = this.audioContext.currentTime;
                
                // نمط إيقاعي
                for (let i = 0; i < 8; i++) {
                    gainNode.gain.setValueAtTime(this.volume * 0.1, now + (i * 0.15));
                    gainNode.gain.setValueAtTime(0, now + (i * 0.15) + 0.1);
                }
                
                oscillator.start(now);
                oscillator.stop(now + 1.2);
                
                this.activeSounds.add(oscillator);
                oscillator.onended = () => this.activeSounds.delete(oscillator);
                
            }, 300);
            
        } catch (error) {
            console.log('❌ خطأ في موسيقى النصر:', error);
        }
    }

    // موسيقى الخسارة (تشويق)
    playLossMusic() {
        if (!this.enabled || !this.audioContext) return;
        
        this.stopBackgroundMusic();
        
        try {
            // نغمات درامية للخسارة
            const lossNotes = [
                { freq: 523.25, duration: 0.4 },  // C5
                { freq: 493.88, duration: 0.4 },  // B4
                { freq: 440.00, duration: 0.6 },  // A4
                { freq: 392.00, duration: 0.8 }   // G4
            ];
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            
            const currentTime = this.audioContext.currentTime;
            let scheduleTime = currentTime;
            
            lossNotes.forEach((note, index) => {
                oscillator.frequency.setValueAtTime(note.freq, scheduleTime);
                
                gainNode.gain.setValueAtTime(0, scheduleTime);
                gainNode.gain.linearRampToValueAtTime(
                    this.volume * 0.12, 
                    scheduleTime + 0.05
                );
                gainNode.gain.exponentialRampToValueAtTime(
                    0.001, 
                    scheduleTime + note.duration
                );
                
                scheduleTime += note.duration;
            });
            
            oscillator.start(currentTime);
            oscillator.stop(scheduleTime);
            
            this.activeSounds.add(oscillator);
            oscillator.onended = () => this.activeSounds.delete(oscillator);
            
        } catch (error) {
            console.log('❌ خطأ في موسيقى الخسارة:', error);
        }
    }

    // صوت الإجابة الصحيحة (لطيف)
    playCorrect() {
        if (!this.enabled || !this.audioContext) return;
        
        try {
            // نغمة فرحة لطيفة
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            
            // تسلسل نغمات مبهجة
            const frequencies = [659.25, 830.61, 1046.50]; // E5, G#5, C6
            const durations = [0.15, 0.15, 0.3];
            
            const currentTime = this.audioContext.currentTime;
            let scheduleTime = currentTime;
            
            frequencies.forEach((freq, index) => {
                oscillator.frequency.setValueAtTime(freq, scheduleTime);
                
                gainNode.gain.setValueAtTime(0, scheduleTime);
                gainNode.gain.linearRampToValueAtTime(
                    this.volume * 0.15, 
                    scheduleTime + 0.01
                );
                gainNode.gain.exponentialRampToValueAtTime(
                    0.001, 
                    scheduleTime + durations[index]
                );
                
                scheduleTime += durations[index];
            });
            
            oscillator.start(currentTime);
            oscillator.stop(scheduleTime);
            
            this.activeSounds.add(oscillator);
            oscillator.onended = () => this.activeSounds.delete(oscillator);
            
        } catch (error) {
            console.log('❌ خطأ في صوت الإجابة الصحيحة:', error);
        }
    }

    // صوت الإجابة الخاطئة (غير مزعج)
    playWrong() {
        if (!this.enabled || !this.audioContext) return;
        
        try {
            // نغمة ناعمة للخطأ
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'triangle'; // نغمة أنعم
            
            // نغمة تنازلية لطيفة
            oscillator.frequency.setValueAtTime(349.23, this.audioContext.currentTime); // F4
            oscillator.frequency.exponentialRampToValueAtTime(
                261.63, // C4
                this.audioContext.currentTime + 0.4
            );
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
                this.volume * 0.08, 
                this.audioContext.currentTime + 0.05
            );
            gainNode.gain.exponentialRampToValueAtTime(
                0.001, 
                this.audioContext.currentTime + 0.4
            );
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.45);
            
            this.activeSounds.add(oscillator);
            oscillator.onended = () => this.activeSounds.delete(oscillator);
            
        } catch (error) {
            console.log('❌ خطأ في صوت الإجابة الخاطئة:', error);
        }
    }

    // صوت النقر (لطيف)
    playClick() {
        if (!this.enabled || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.value = 1046.50; // C6
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
                this.volume * 0.05, 
                this.audioContext.currentTime + 0.01
            );
            gainNode.gain.exponentialRampToValueAtTime(
                0.001, 
                this.audioContext.currentTime + 0.05
            );
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.06);
            
            this.activeSounds.add(oscillator);
            oscillator.onended = () => this.activeSounds.delete(oscillator);
            
        } catch (error) {
            console.log('❌ خطأ في صوت النقر:', error);
        }
    }

    // صوت المؤقت (تشويق)
    playTimer() {
        if (!this.enabled || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            
            // نغمة متصاعدة للتوتر
            oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
            oscillator.frequency.exponentialRampToValueAtTime(
                1046.50, // C6
                this.audioContext.currentTime + 0.2
            );
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
                this.volume * 0.06, 
                this.audioContext.currentTime + 0.01
            );
            gainNode.gain.exponentialRampToValueAtTime(
                0.001, 
                this.audioContext.currentTime + 0.2
            );
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.22);
            
            this.activeSounds.add(oscillator);
            oscillator.onended = () => this.activeSounds.delete(oscillator);
            
        } catch (error) {
            console.log('❌ خطأ في صوت المؤقت:', error);
        }
    }

    // صوت المساعدة (سحري)
    playLifeline() {
        if (!this.enabled || !this.audioContext) return;
        
        try {
            // نغمة سحرية
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.type = 'triangle';
                    
                    // نغمات عالية سحرية
                    const freq = 2093.00 + (i * 200); // C7 وأعلى
                    oscillator.frequency.value = freq;
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(
                        this.volume * (0.04 - (i * 0.01)), 
                        this.audioContext.currentTime + 0.05
                    );
                    gainNode.gain.exponentialRampToValueAtTime(
                        0.001, 
                        this.audioContext.currentTime + 0.2
                    );
                    
                    oscillator.start();
                    oscillator.stop(this.audioContext.currentTime + 0.25);
                    
                    this.activeSounds.add(oscillator);
                    oscillator.onended = () => this.activeSounds.delete(oscillator);
                }, i * 80);
            }
            
        } catch (error) {
            console.log('❌ خطأ في صوت المساعدة:', error);
        }
    }

    // صوت الانسحاب (تشويق)
    playWithdraw() {
        if (!this.enabled || !this.audioContext) return;
        
        try {
            // نغمة قرار مصيري
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sawtooth';
            
            // نغمة تنازلية درامية
            oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime); // E5
            oscillator.frequency.exponentialRampToValueAtTime(
                164.81, // E3
                this.audioContext.currentTime + 0.8
            );
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
                this.volume * 0.1, 
                this.audioContext.currentTime + 0.1
            );
            gainNode.gain.exponentialRampToValueAtTime(
                0.001, 
                this.audioContext.currentTime + 0.8
            );
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.85);
            
            this.activeSounds.add(oscillator);
            oscillator.onended = () => this.activeSounds.delete(oscillator);
            
        } catch (error) {
            console.log('❌ خطأ في صوت الانسحاب:', error);
        }
    }

    // صوت البداية (حماسي)
    playStart() {
        if (!this.enabled || !this.audioContext) return;
        
        try {
            // ثلاث نغمات حماسية للبداية
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.type = 'sine';
                    
                    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
                    oscillator.frequency.value = frequencies[i];
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(
                        this.volume * 0.12, 
                        this.audioContext.currentTime + 0.05
                    );
                    gainNode.gain.exponentialRampToValueAtTime(
                        0.001, 
                        this.audioContext.currentTime + 0.25
                    );
                    
                    oscillator.start();
                    oscillator.stop(this.audioContext.currentTime + 0.3);
                    
                    this.activeSounds.add(oscillator);
                    oscillator.onended = () => this.activeSounds.delete(oscillator);
                }, i * 100);
            }
            
        } catch (error) {
            console.log('❌ خطأ في صوت البداية:', error);
        }
    }

    // إيقاف جميع الأصوات
    stopAll() {
        // إيقاف الموسيقى الخلفية
        this.stopBackgroundMusic();
        
        // إيقاف جميع الأصوات النشطة
        this.activeSounds.forEach(sound => {
            try {
                if (sound.stop) sound.stop();
            } catch (e) {}
        });
        this.activeSounds.clear();
    }

    // إيقاف موسيقى الخلفية
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            try {
                if (this.backgroundMusic.oscillator1) this.backgroundMusic.oscillator1.stop();
                if (this.backgroundMusic.oscillator2) this.backgroundMusic.oscillator2.stop();
                if (this.backgroundMusic.oscillators) {
                    this.backgroundMusic.oscillators.forEach(osc => osc.stop());
                }
                if (this.backgroundMusic.loopInterval) {
                    clearInterval(this.backgroundMusic.loopInterval);
                }
            } catch (e) {}
            this.backgroundMusic = null;
        }
    }

    // التحكم بمستوى الصوت
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('volume', this.volume);
    }

    // تشغيل/إيقاف الصوت
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('soundEnabled', this.enabled);
        
        if (!this.enabled) {
            this.stopAll();
        }
        
        return this.enabled;
    }

    isEnabled() {
        return this.enabled;
    }

    // طريقة شاملة للعب جميع الأصوات
    play(soundName) {
        switch(soundName) {
            case 'correct':
                this.playCorrect();
                break;
            case 'wrong':
                this.playWrong();
                break;
            case 'click':
                this.playClick();
                break;
            case 'timer':
                this.playTimer();
                break;
            case 'win':
                this.playVictoryMusic();
                break;
            case 'lose':
                this.playLossMusic();
                break;
            case 'lifeline':
                this.playLifeline();
                break;
            case 'start':
                this.playStart();
                break;
            case 'withdraw':
                this.playWithdraw();
                break;
            case 'background_menu':
                this.playBackgroundMusic('menu');
                break;
            case 'background_game':
                this.playGameMusic();
                break;
        }
    }
}

// تصدير نسخة واحدة
export const audioManager = new AudioManager();
