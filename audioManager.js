export class AudioManager {
    constructor() {
        this.enabled = true;
        this.volume = 0.7;
        this.sounds = {};
        this.init();
    }

    init() {
        this.enabled = localStorage.getItem('soundEnabled') !== 'false';
        this.volume = parseFloat(localStorage.getItem('volume')) || 0.7;
        
        // تحميل الأصوات
        this.loadSounds();
    }

    loadSounds() {
        const sounds = {
            correct: 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3',
            wrong: 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3',
            click: 'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3',
            timer: 'https://assets.mixkit.co/sfx/preview/mixkit-fast-clock-ticking-1020.mp3',
            win: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
            lose: 'https://assets.mixkit.co/sfx/preview/mixkit-losing-bleeps-2026.mp3',
            lifeline: 'https://assets.mixkit.co/sfx/preview/mixkit-magic-sparkles-3000.mp3',
            start: 'https://assets.mixkit.co/sfx/preview/mixkit-game-ball-tap-2073.mp3',
            background: 'https://assets.mixkit.co/music/preview/mixkit-game-show-suspense-waiting-667.mp3'
        };

        Object.entries(sounds).forEach(([key, url]) => {
            this.sounds[key] = new Audio(url);
            this.sounds[key].volume = this.volume;
        });
    }

    play(soundName) {
        if (!this.enabled) return;
        
        try {
            if (this.sounds[soundName]) {
                const sound = this.sounds[soundName].cloneNode();
                sound.volume = this.volume;
                sound.play().catch(e => console.log('خطأ في تشغيل الصوت:', e));
            }
        } catch (error) {
            console.log('لم يتمكن من تشغيل الصوت:', error);
        }
    }

    stop(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].pause();
            this.sounds[soundName].currentTime = 0;
        }
    }

    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    setVolume(volume) {
        this.volume = volume;
        Object.values(this.sounds).forEach(sound => {
            sound.volume = volume;
        });
        localStorage.setItem('volume', volume);
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
        if (this.enabled && this.sounds.background) {
            this.sounds.background.loop = true;
            this.sounds.background.volume = this.volume * 0.5;
            this.sounds.background.play().catch(e => console.log('خطأ في تشغيل موسيقى الخلفية'));
        }
    }

    stopBackgroundMusic() {
        if (this.sounds.background) {
            this.sounds.background.pause();
            this.sounds.background.currentTime = 0;
        }
    }
}

// تصدير نسخة واحدة
export const audioManager = new AudioManager();
