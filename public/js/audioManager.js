// audioManager.js
class AudioManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.initializeSounds();
    }

    initialize() {
        this.enabled = localStorage.getItem('millionaireSoundEnabled') !== 'false';
    }

    initializeSounds() {
        // يمكنك إضافة ملفات صوتية حقيقية هنا
        this.sounds = {
            click: this.createSound('click'),
            correct: this.createSound('correct'),
            wrong: this.createSound('wrong'),
            timer: this.createSound('timer'),
            win: this.createSound('win'),
            lose: this.createSound('lose')
        };
    }

    createSound(type) {
        // إنشاء أصوات افتراضية
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        return {
            play: () => {
                if (!this.enabled) return;
                
                try {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    switch(type) {
                        case 'click':
                            oscillator.frequency.value = 800;
                            gainNode.gain.value = 0.1;
                            oscillator.start();
                            setTimeout(() => oscillator.stop(), 100);
                            break;
                        case 'correct':
                            oscillator.frequency.value = 1200;
                            gainNode.gain.value = 0.2;
                            oscillator.start();
                            setTimeout(() => oscillator.stop(), 300);
                            break;
                        case 'wrong':
                            oscillator.frequency.value = 400;
                            gainNode.gain.value = 0.2;
                            oscillator.start();
                            setTimeout(() => oscillator.stop(), 500);
                            break;
                    }
                } catch (e) {
                    console.log('Audio not supported');
                }
            }
        };
    }

    play(soundName) {
        if (this.sounds[soundName] && this.enabled) {
            this.sounds[soundName].play();
        }
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        localStorage.setItem('millionaireSoundEnabled', enabled);
    }

    toggle() {
        this.setEnabled(!this.enabled);
        return this.enabled;
    }

    isEnabled() {
        return this.enabled;
    }
}

export const audioManager = new AudioManager();
