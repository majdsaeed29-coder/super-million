// uiEffects.js
class UIEffects {
    init() {
        // تهيئة المؤثرات
    }

    reset() {
        // إعادة تعيين المؤثرات
    }

    showCorrectEffect() {
        this.createParticles('correct');
        this.pulseElement('.question-card', '#27ae60');
    }

    showWrongEffect() {
        this.createParticles('wrong');
        this.pulseElement('.question-card', '#e74c3c');
    }

    createParticles(type) {
        const container = document.querySelector('.game-container') || document.body;
        const colors = {
            correct: '#27ae60',
            wrong: '#e74c3c',
            default: '#ffd700'
        };
        
        const color = colors[type] || colors.default;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            const startX = window.innerWidth / 2;
            const startY = window.innerHeight / 2;
            
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            
            container.appendChild(particle);
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 3;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let posX = startX;
            let posY = startY;
            let opacity = 1;
            
            const animate = () => {
                posX += vx;
                posY += vy;
                opacity -= 0.02;
                
                particle.style.left = `${posX}px`;
                particle.style.top = `${posY}px`;
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            animate();
        }
    }

    pulseElement(selector, color) {
        const element = document.querySelector(selector);
        if (!element) return;
        
        const originalBorder = element.style.borderColor;
        const originalBoxShadow = element.style.boxShadow;
        
        element.style.borderColor = color;
        element.style.boxShadow = `0 0 20px ${color}`;
        
        setTimeout(() => {
            element.style.borderColor = originalBorder;
            element.style.boxShadow = originalBoxShadow;
        }, 1000);
    }

    showConfetti() {
        const container = document.querySelector('.game-container') || document.body;
        const colors = ['#ffd700', '#27ae60', '#3498db', '#e74c3c', '#9b59b6'];
        
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                border-radius: 0;
                z-index: 1000;
                pointer-events: none;
            `;
            
            const side = Math.random() > 0.5 ? 'left' : 'right';
            const startX = side === 'left' ? 
                Math.random() * window.innerWidth / 2 : 
                window.innerWidth / 2 + Math.random() * window.innerWidth / 2;
            
            confetti.style.left = `${startX}px`;
            
            container.appendChild(confetti);
            
            const animation = confetti.animate([
                { 
                    transform: 'translateY(0) rotate(0deg)', 
                    opacity: 1 
                },
                { 
                    transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, 
                    opacity: 0 
                }
            ], {
                duration: 2000 + Math.random() * 3000,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            });
            
            animation.onfinish = () => confetti.remove();
        }
    }

    shakeElement(selector) {
        const element = document.querySelector(selector);
        if (!element) return;
        
        element.classList.add('shake');
        setTimeout(() => element.classList.remove('shake'), 500);
    }
}

export const uiEffects = new UIEffects();
