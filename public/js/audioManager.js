// audioManager.js
export class AudioManager {
    constructor() {
        this.enabled = true;
        this.init();
    }

    init() {
        this.enabled = localStorage.getItem('millionaireSoundEnabled') !== 'false';
    }

    play(soundName) {
        if (!this.enabled) return;
        
        // أصوات افتراضية
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch(soundName) {
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
                case 'click':
                    oscillator.frequency.value = 800;
                    gainNode.gain.value = 0.1;
                    oscillator.start();
                    setTimeout(() => oscillator.stop(), 100);
                    break;
            }
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('millionaireSoundEnabled', this.enabled);
        return this.enabled;
    }
}

export const audioManager = new AudioManager();
