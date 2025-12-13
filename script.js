// قائمة الجوائز
const PRIZES = [
    100, 200, 300, 500, 1000, // الخط الآمن الأول
    2000, 4000, 8000, 16000, 32000, // الخط الآمن الثاني
    64000, 125000, 250000, 500000, 1000000 // المليون
];

// قاعدة الأسئلة الموسعة
const QUESTIONS = [
    // المستوى 1 (أسئلة سهلة)
    {
        question: "ما هي عاصمة فرنسا؟",
        options: ["لندن", "برلين", "باريس", "مدريد"],
        correct: 2,
        level: 1,
        category: "جغرافيا"
    },
    {
        question: "كم عدد أيام الأسبوع؟",
        options: ["5", "6", "7", "8"],
        correct: 2,
        level: 1,
        category: "معلومات عامة"
    },
    {
        question: "ما هو الكوكب الأحمر؟",
        options: ["الزهرة", "المريخ", "المشتري", "زحل"],
        correct: 1,
        level: 1,
        category: "علوم"
    },
    {
        question: "ما هو لون دم الحوت؟",
        options: ["أزرق", "أحمر", "أخضر", "أصفر"],
        correct: 1,
        level: 1,
        category: "حيوانات"
    },
    {
        question: "ما هو أسرع حيوان بري؟",
        options: ["الأسد", "الفهد", "النمر", "الغزال"],
        correct: 1,
        level: 1,
        category: "حيوانات"
    },
    // المستوى 2 (أسئلة متوسطة)
    {
        question: "من هو مؤلف مسرحية 'هاملت'؟",
        options: ["تشارلز ديكنز", "ويليام شكسبير", "مارك توين", "أرنست همينغوي"],
        correct: 1,
        level: 2,
        category: "أدب"
    },
    {
        question: "ما هو أطول نهر في العالم؟",
        options: ["النيل", "الأمازون", "يانغتسي", "المسيسبي"],
        correct: 0,
        level: 2,
        category: "جغرافيا"
    },
    {
        question: "ما هي أكبر قارة في العالم؟",
        options: ["أفريقيا", "أوروبا", "آسيا", "أمريكا الشمالية"],
        correct: 2,
        level: 2,
        category: "جغرافيا"
    },
    {
        question: "كم عدد أحرف اللغة العربية؟",
        options: ["26", "28", "30", "32"],
        correct: 1,
        level: 2,
        category: "لغة"
    },
    {
        question: "ما هو أقدم نادي كرة قدم في العالم؟",
        options: ["ريال مدريد", "مانشستر يونايتد", "شيفيلد يونايتد", "برشلونة"],
        correct: 2,
        level: 2,
        category: "رياضة"
    },
    // المستوى 3 (أسئلة صعبة)
    {
        question: "في أي عام هبط الإنسان على القمر لأول مرة؟",
        options: ["1965", "1969", "1972", "1975"],
        correct: 1,
        level: 3,
        category: "تاريخ"
    },
    {
        question: "ما هو العنصر الكيميائي الذي رمزه 'Au'؟",
        options: ["فضة", "ذهب", "ألومنيوم", "حديد"],
        correct: 1,
        level: 3,
        category: "علوم"
    },
    {
        question: "من رسم لوحة 'الموناليزا'؟",
        options: ["فان جوخ", "بيكاسو", "ليوناردو دا فينشي", "رمبرانت"],
        correct: 2,
        level: 3,
        category: "فن"
    },
    {
        question: "ما هو أصل كلمة 'ألجبرا'؟",
        options: ["يوناني", "فارسي", "عربي", "لاتيني"],
        correct: 2,
        level: 3,
        category: "تاريخ"
    },
    {
        question: "كم عدد عضلات جسم الإنسان؟",
        options: ["520", "620", "720", "820"],
        correct: 1,
        level: 3,
        category: "علوم"
    },
    // المستوى 4 (أسئلة أصعب)
    {
        question: "ما هي أصغر دولة في العالم؟",
        options: ["موناكو", "ناورو", "الفاتيكان", "سان مارينو"],
        correct: 2,
        level: 4,
        category: "جغرافيا"
    },
    {
        question: "ما هو الغاز الأكثر وفرة في الغلاف الجوي للأرض؟",
        options: ["الأكسجين", "الهيدروجين", "النيتروجين", "ثاني أكسيد الكربون"],
        correct: 2,
        level: 4,
        category: "علوم"
    },
    {
        question: "من هو مخترع المصباح الكهربائي؟",
        options: ["نيكولا تسلا", "توماس إديسون", "ألكسندر جراهام بيل", "ماري كوري"],
        correct: 1,
        level: 4,
        category: "تاريخ"
    },
    {
        question: "ما هو أطول جسر في العالم؟",
        options: ["جسر ميلاو", "جسر أكاشي كايكيو", "جسر دانيانغ-كونشان", "جسر هامبر"],
        correct: 2,
        level: 4,
        category: "جغرافيا"
    },
    {
        question: "ما هو المعدن السائل في درجة حرارة الغرفة؟",
        options: ["الرصاص", "القصدير", "الزئبق", "الفضة"],
        correct: 2,
        level: 4,
        category: "علوم"
    },
    // المستوى 5 (أسئلة الخبير)
    {
        question: "ما هي أقدم حضارة في العالم؟",
        options: ["الحضارة المصرية", "حضارة بلاد الرافدين", "الحضارة الصينية", "حضارة وادي السند"],
        correct: 1,
        level: 5,
        category: "تاريخ"
    },
    {
        question: "من هو مؤلف كتاب 'أصل الأنواع'؟",
        options: ["آينشتاين", "داروين", "نيوتن", "جاليلو"],
        correct: 1,
        level: 5,
        category: "تاريخ"
    },
    {
        question: "كم عدد عظام جسم الإنسان البالغ؟",
        options: ["206", "208", "210", "212"],
        correct: 0,
        level: 5,
        category: "علوم"
    },
    {
        question: "ما هي لغة البرمجة التي طورتها شركة مايكروسوفت؟",
        options: ["جافا", "بايثون", "سي شارب", "جافا سكريبت"],
        correct: 2,
        level: 5,
        category: "تكنولوجيا"
    },
    {
        question: "من هو أول رائد فضاء عربي؟",
        options: ["سلطان بن سلمان", "محمد فارس", "عبد الأحد مومند", "مشعل الشميمري"],
        correct: 0,
        level: 5,
        category: "تاريخ"
    }
];

// حالة اللعبة
let gameState = {
    playerName: '',
    currentQuestion: 0,
    score: 0,
    lifelines: {
        fiftyFifty: true,
        askAudience: true,
        phoneFriend: true
    },
    usedQuestions: new Set(),
    gameActive: false,
    timer: null,
    timeLeft: 30,
    selectedOption: null
};

// عناصر DOM
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const playerNameInput = document.getElementById('player-name');
const startBtn = document.getElementById('start-btn');
const currentPlayerSpan = document.getElementById('current-player');
const currentPrizeSpan = document.getElementById('current-prize');
const questionNumberSpan = document.getElementById('q-number');
const questionText = document.getElementById('question-text');
const optionA = document.getElementById('option-a');
const optionB = document.getElementById('option-b');
const optionC = document.getElementById('option-c');
const optionD = document.getElementById('option-d');
const optionButtons = document.querySelectorAll('.option-btn');
const nextBtn = document.getElementById('next-btn');
const withdrawBtn = document.getElementById('withdraw-btn');
const fiftyFiftyBtn = document.getElementById('fifty-fifty');
const askAudienceBtn = document.getElementById('ask-audience');
const phoneFriendBtn = document.getElementById('phone-friend');
const prizesList = document.querySelector('.prizes-list');
const resultTitle = document.getElementById('result-title');
const finalPrize = document.getElementById('final-prize');
const resultPlayerName = document.getElementById('result-player-name');
const questionsAnswered = document.getElementById('questions-answered');
const lifelinesLeft = document.getElementById('lifelines-left');
const playAgainBtn = document.getElementById('play-again-btn');
const helpModal = document.getElementById('help-modal');
const helpTitle = document.getElementById('help-title');
const helpText = document.getElementById('help-text');
const closeHelp = document.getElementById('close-help');
const withdrawModal = document.getElementById('withdraw-modal');
const withdrawAmount = document.getElementById('withdraw-amount');
const confirmWithdraw = document.getElementById('confirm-withdraw');
const cancelWithdraw = document.getElementById('cancel-withdraw');

// تهيئة قائمة الجوائز
function initializePrizes() {
    prizesList.innerHTML = '';
    PRIZES.forEach((prize, index) => {
        const prizeItem = document.createElement('div');
        prizeItem.className = 'prize-item';
        prizeItem.dataset.prize = prize;
        prizeItem.innerHTML = `
            <div class="prize-rank">${15 - index}</div>
            <div class="prize-amount">${prize.toLocaleString()} <span class="currency">جنيه</span></div>
            ${index === 4 || index === 9 ? '<div class="safe-line">خط أمان</div>' : ''}
        `;
        
        // تحديد خطوط الأمان
        if (index === 4 || index === 9) {
            prizeItem.classList.add('safe');
        }
        
        prizesList.appendChild(prizeItem);
    });
}

// الحصول على سؤال عشوائي
function getRandomQuestion() {
    let availableQuestions = QUESTIONS.filter((_, index) => !gameState.usedQuestions.has(index));
    
    // إذا استخدمنا كل الأسئلة، نعيد استخدامها
    if (availableQuestions.length === 0) {
        gameState.usedQuestions.clear();
        availableQuestions = QUESTIONS;
    }
    
    // فلترة الأسئلة حسب المستوى
    const currentLevel = Math.min(Math.ceil((gameState.currentQuestion + 1) / 3), 5);
    const levelQuestions = availableQuestions.filter(q => q.level === currentLevel);
    
    const questionPool = levelQuestions.length > 0 ? levelQuestions : availableQuestions;
    const randomIndex = Math.floor(Math.random() * questionPool.length);
    const question = questionPool[randomIndex];
    
    // إيجاد الفهرس الأصلي
    const originalIndex = QUESTIONS.findIndex(q => q === question);
    gameState.usedQuestions.add(originalIndex);
    
    return question;
}

// بدء المؤقت
function startTimer() {
    clearInterval(gameState.timer);
    gameState.timeLeft = 30;
    
    // إنشاء أو تحديث عرض المؤقت
    let timerDisplay = document.querySelector('.timer-display');
    if (!timerDisplay) {
        timerDisplay = document.createElement('div');
        timerDisplay.className = 'timer-display';
        document.querySelector('.question-container').appendChild(timerDisplay);
    }
    
    timerDisplay.innerHTML = `
        <div class="timer-circle">
            <svg width="60" height="60">
                <circle class="timer-bg" cx="30" cy="30" r="27"></circle>
                <circle class="timer-progress" cx="30" cy="30" r="27"></circle>
            </svg>
            <div class="timer-text">${gameState.timeLeft}</div>
        </div>
    `;
    
    const progressCircle = timerDisplay.querySelector('.timer-progress');
    const circumference = 2 * Math.PI * 27;
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        
        // تحديث المؤقت البصري
        const progress = (30 - gameState.timeLeft) / 30;
        const offset = circumference - (progress * circumference);
        progressCircle.style.strokeDashoffset = offset;
        
        timerDisplay.querySelector('.timer-text').textContent = gameState.timeLeft;
        
        // تغيير اللون مع اقتراب الوقت للنفاد
        if (gameState.timeLeft <= 10) {
            timerDisplay.classList.add('warning');
        }
        
        if (gameState.timeLeft <= 5) {
            timerDisplay.classList.add('danger');
        }
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            timeUp();
        }
    }, 1000);
}

// انتهاء الوقت
function timeUp() {
    const question = QUESTIONS[Array.from(gameState.usedQuestions).pop()];
    const correctIndex = question.correct;
    
    // تعطيل جميع الأزرار
    optionButtons.forEach(btn => {
        btn.disabled = true;
    });
    
    // تلوين الإجابة الصحيحة
    optionButtons[correctIndex].style.background = '#27ae60';
    optionButtons[correctIndex].style.borderColor = '#229954';
    
    // اهتزاز الشاشة
    document.body.classList.add('shake');
    setTimeout(() => {
        document.body.classList.remove('shake');
    }, 500);
    
    setTimeout(() => {
        // الانتقال للسؤال التالي أو نهاية اللعبة
        if (gameState.currentQuestion < 14) {
            gameState.currentQuestion++;
            displayQuestion();
        } else {
            endGame(true);
        }
    }, 3000);
}

// عرض السؤال
function displayQuestion() {
    const question = getRandomQuestion();
    
    questionNumberSpan.textContent = gameState.currentQuestion + 1;
    questionText.innerHTML = `
        <span class="question-category">${question.category}</span>
        ${question.question}
    `;
    
    optionA.textContent = question.options[0];
    optionB.textContent = question.options[1];
    optionC.textContent = question.options[2];
    optionD.textContent = question.options[3];
    
    // إضافة مؤشر الصعوبة
    const difficultyStars = '★'.repeat(question.level) + '☆'.repeat(5 - question.level);
    const difficultyElement = document.createElement('div');
    difficultyElement.className = 'difficulty';
    difficultyElement.innerHTML = `الصعوبة: ${difficultyStars}`;
    
    // تحديث الجائزة الحالية
    currentPrizeSpan.textContent = `الجائزة الحالية: ${PRIZES[gameState.currentQuestion].toLocaleString()} جنيه`;
    
    // تحديث قائمة الجوائز
    updatePrizesList();
    
    // إعادة تعيين الأزرار
    optionButtons.forEach(btn => {
        btn.disabled = false;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.opacity = '1';
        btn.style.transform = '';
        btn.classList.remove('selected', 'correct', 'wrong');
    });
    
    // تعطيل زر التالي
    nextBtn.classList.add('disabled');
    nextBtn.disabled = true;
    
    // إعادة تعليمات المساعدات
    fiftyFiftyBtn.disabled = !gameState.lifelines.fiftyFifty;
    askAudienceBtn.disabled = !gameState.lifelines.askAudience;
    phoneFriendBtn.disabled = !gameState.lifelines.phoneFriend;
    
    // بدء المؤقت
    startTimer();
    
    // إضافة تأثير ظهور
    document.querySelector('.question-container').classList.add('pulse');
    setTimeout(() => {
        document.querySelector('.question-container').classList.remove('pulse');
    }, 1000);
}

// تحديث قائمة الجوائز
function updatePrizesList() {
    const prizeItems = document.querySelectorAll('.prize-item');
    prizeItems.forEach((item, index) => {
        item.classList.remove('current', 'passed');
        
        if (index === gameState.currentQuestion) {
            item.classList.add('current');
            // تأثير تنبيه للجائزة الحالية
            item.classList.add('highlight');
            setTimeout(() => {
                item.classList.remove('highlight');
            }, 2000);
        } else if (index < gameState.currentQuestion) {
            item.classList.add('passed');
        }
    });
}

// التحقق من الإجابة
function checkAnswer(selectedOption) {
    clearInterval(gameState.timer);
    
    const question = QUESTIONS[Array.from(gameState.usedQuestions).pop()];
    const correctIndex = question.correct;
    const options = ['A', 'B', 'C', 'D'];
    const selectedIndex = options.indexOf(selectedOption);
    
    gameState.selectedOption = selectedIndex;
    
    // تعطيل جميع الأزرار
    optionButtons.forEach(btn => {
        btn.disabled = true;
    });
    
    // إضافة تأثير الاختيار
    optionButtons[selectedIndex].classList.add('selected');
    
    // تأخير ثم عرض النتيجة
    setTimeout(() => {
        if (selectedIndex !== correctIndex) {
            // الإجابة خاطئة
            optionButtons[selectedIndex].classList.add('wrong');
            optionButtons[correctIndex].classList.add('correct');
            
            // تأثيرات صوتية وبصرية
            playSound('wrong');
            document.body.classList.add('shake');
            
            setTimeout(() => {
                document.body.classList.remove('shake');
                endGame(false);
            }, 2000);
        } else {
            // الإجابة صحيحة
            optionButtons[correctIndex].classList.add('correct');
            
            // تأثيرات صوتية وبصرية
            playSound('correct');
            document.querySelector('.question-container').classList.add('celebrate');
            
            // زيادة النقاط
            gameState.score = PRIZES[gameState.currentQuestion];
            
            // مؤشر الجائزة
            showPrizeAnimation();
            
            setTimeout(() => {
                document.querySelector('.question-container').classList.remove('celebrate');
                
                // تمكين زر التالي إذا لم يكن السؤال الأخير
                if (gameState.currentQuestion < 14) {
                    nextBtn.classList.remove('disabled');
                    nextBtn.disabled = false;
                    nextBtn.classList.add('pulse');
                } else {
                    // الفوز بالمليون
                    setTimeout(() => endGame(true), 1500);
                }
            }, 2000);
        }
    }, 1000);
}

// مؤثر صوتي
function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (type === 'correct') {
        // صوت الإجابة الصحيحة
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    } else if (type === 'wrong') {
        // صوت الإجابة الخاطئة
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
        oscillator.frequency.setValueAtTime(196, audioContext.currentTime + 0.2); // G3
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

// عرض مؤشر الجائزة
function showPrizeAnimation() {
    const prizeAmount = PRIZES[gameState.currentQuestion];
    const prizeElement = document.createElement('div');
    prizeElement.className = 'prize-popup';
    prizeElement.innerHTML = `
        <div class="prize-popup-content">
            <i class="fas fa-coins"></i>
            <div class="prize-amount">+${prizeAmount.toLocaleString()} جنيه</div>
        </div>
    `;
    
    document.querySelector('.game-content').appendChild(prizeElement);
    
    // إزالة المؤثر بعد 3 ثواني
    setTimeout(() => {
        prizeElement.remove();
    }, 3000);
}

// مساعدة 50:50
function useFiftyFifty() {
    if (!gameState.lifelines.fiftyFifty) return;
    
    const question = QUESTIONS[Array.from(gameState.usedQuestions).pop()];
    const correctIndex = question.correct;
    let wrongOptions = [0, 1, 2, 3].filter(idx => idx !== correctIndex);
    
    // اختيار إجابتين خاطئتين عشوائياً
    wrongOptions.sort(() => Math.random() - 0.5);
    const toRemove = wrongOptions.slice(0, 2);
    
    // إخفاء الإجابتين مع تأثير
    toRemove.forEach((idx, i) => {
        setTimeout(() => {
            optionButtons[idx].style.opacity = '0.3';
            optionButtons[idx].disabled = true;
            optionButtons[idx].style.transform = 'scale(0.95)';
        }, i * 200);
    });
    
    gameState.lifelines.fiftyFifty = false;
    fiftyFiftyBtn.disabled = true;
    fiftyFiftyBtn.innerHTML = '<i class="fas fa-ban"></i> مستخدمة';
    fiftyFiftyBtn.classList.add('used');
    
    // إشعار باستخدام المساعدة
    showNotification('تم استخدام مساعدة 50:50');
}

// مساعدة سؤال الجمهور
function useAskAudience() {
    if (!gameState.lifelines.askAudience) return;
    
    const question = QUESTIONS[Array.from(gameState.usedQuestions).pop()];
    const correctIndex = question.correct;
    
    // محاكاة تصويت الجمهور
    let percentages = [0, 0, 0, 0];
    percentages[correctIndex] = 50 + Math.floor(Math.random() * 30);
    
    let remaining = 100 - percentages[correctIndex];
    for (let i = 0; i < 4; i++) {
        if (i !== correctIndex) {
            percentages[i] = Math.floor(Math.random() * remaining);
            remaining -= percentages[i];
        }
    }
    
    // إنشاء مخطط أعمدة
    const barsHTML = `
        <div class="audience-chart">
            <div class="chart-bar" style="height: ${percentages[0]}%">
                <span>أ: ${percentages[0]}%</span>
            </div>
            <div class="chart-bar" style="height: ${percentages[1]}%">
                <span>ب: ${percentages[1]}%</span>
            </div>
            <div class="chart-bar" style="height: ${percentages[2]}%">
                <span>ج: ${percentages[2]}%</span>
            </div>
            <div class="chart-bar" style="height: ${percentages[3]}%">
                <span>د: ${percentages[3]}%</span>
            </div>
        </div>
    `;
    
    showHelpModal('سؤال الجمهور', 
        `نتيجة تصويت الجمهور:<br><br>
        ${barsHTML}`);
    
    gameState.lifelines.askAudience = false;
    askAudienceBtn.disabled = true;
    askAudienceBtn.innerHTML = '<i class="fas fa-ban"></i> مستخدمة';
    askAudienceBtn.classList.add('used');
    
    // إشعار باستخدام المساعدة
    showNotification('تم استخدام مساعدة سؤال الجمهور');
}

// مساعدة الاتصال بصديق
function usePhoneFriend() {
    if (!gameState.lifelines.phoneFriend) return;
    
    const question = QUESTIONS[Array.from(gameState.usedQuestions).pop()];
    const correctIndex = question.correct;
    const confidence = Math.random() * 100;
    
    let friendAnswer;
    if (confidence > 70) {
        friendAnswer = `أعتقد أن الإجابة الصحيحة هي ${['أ', 'ب', 'ج', 'د'][correctIndex]} (${confidence.toFixed(0)}% متأكد)`;
    } else {
        const randomOption = Math.floor(Math.random() * 4);
        friendAnswer = `أعتقد أن الإجابة هي ${['أ', 'ب', 'ج', 'د'][randomOption]} لكن لست متأكداً (${confidence.toFixed(0)}% متأكد)`;
    }
    
    // محاكاة مكالمة هاتفية
    const callHTML = `
        <div class="phone-call">
            <div class="call-header">
                <i class="fas fa-phone-alt"></i>
                <span>مكالمة مع صديق...</span>
            </div>
            <div class="call-content">
                <div class="friend-message">
                    <div class="bubble">${friendAnswer}</div>
                    <div class="friend-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showHelpModal('الاتصال بصديق', callHTML);
    
    gameState.lifelines.phoneFriend = false;
    phoneFriendBtn.disabled = true;
    phoneFriendBtn.innerHTML = '<i class="fas fa-ban"></i> مستخدمة';
    phoneFriendBtn.classList.add('used');
    
    // إشعار باستخدام المساعدة
    showNotification('تم استخدام مساعدة الاتصال بصديق');
}

// عرض نافذة المساعدة
function showHelpModal(title, text) {
    helpTitle.textContent = title;
    helpText.innerHTML = text;
    helpModal.classList.add('active');
    
    // إيقاف المؤقت أثناء عرض المساعدة
    clearInterval(gameState.timer);
}

// عرض إشعار
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 3 ثواني
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// إنهاء اللعبة
function endGame(isWin) {
    clearInterval(gameState.timer);
    gameState.gameActive = false;
    
    // تحديث شاشة النتائج
    updateResultScreen(isWin);
    
    // الانتقال لشاشة النتائج مع تأخير
    setTimeout(() => {
        gameScreen.classList.remove('active');
        resultScreen.classList.add('active');
        
        // مؤثرات النصر
        if (isWin && gameState.score === 1000000) {
            celebrateMillion();
        }
    }, 2000);
}

// تحديث شاشة النتائج
function updateResultScreen(isWin) {
    if (isWin && gameState.currentQuestion === 14) {
        gameState.score = 1000000;
        resultTitle.innerHTML = '<i class="fas fa-trophy"></i> مبروك! فزت بالمليون!';
        document.querySelector('.result-icon').style.color = 'gold';
    } else if (!isWin) {
        // الحصول على آخر جائزة آمنة
        let safePrize = 0;
        for (let i = Math.min(gameState.currentQuestion, 14); i >= 0; i--) {
            if (i === 4 || i === 9 || i === 0) {
                safePrize = PRIZES[i];
                break;
            }
        }
        gameState.score = safePrize;
        
        if (gameState.currentQuestion === 0) {
            resultTitle.textContent = 'انتهت اللعبة مبكراً';
        } else if (gameState.currentQuestion <= 4) {
            resultTitle.textContent = 'وصلت للخط الآمن الأول';
        } else if (gameState.currentQuestion <= 9) {
            resultTitle.textContent = 'وصلت للخط الآمن الثاني';
        } else {
            resultTitle.textContent = 'وصلت بعيداً!';
        }
    }
    
    finalPrize.textContent = `${gameState.score.toLocaleString()} جنيه`;
    resultPlayerName.textContent = gameState.playerName;
    questionsAnswered.textContent = gameState.currentQuestion;
    
    // حساب المساعدات المتبقية
    const remainingLifelines = Object.values(gameState.lifelines).filter(v => v).length;
    lifelinesLeft.textContent = remainingLifelines;
    
    // عرض إحصائيات إضافية
    const accuracy = gameState.currentQuestion > 0 ? 
        Math.round((gameState.currentQuestion / (gameState.currentQuestion + 1)) * 100) : 0;
    
    document.querySelector('.result-details').innerHTML += `
        <p>دقة الإجابات: <span>${accuracy}%</span></p>
        <p>الوقت المستغرق: <span>${Math.round((30 - gameState.timeLeft) * gameState.currentQuestion)} ثانية</span></p>
    `;
}

// احتفالية الفوز بالمليون
function celebrateMillion() {
    const colors = ['gold', '#ffd700', '#ffed4e', '#fff9c4'];
    
    // إضافة الألعاب النارية
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createFirework();
        }, i * 100);
    }
    
    // مؤثرات صوتية
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((note, index) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(note, audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        }, index * 200);
    });
}

// إنشاء لعبة نارية
function createFirework() {
    const firework = document.createElement('div');
    firework.className = 'firework';
    
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    const size = Math.random() * 10 + 5;
    firework.style.width = `${size}px`;
    firework.style.height = `${size}px`;
    
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    firework.style.left = `${x}px`;
    firework.style.top = `${y}px`;
    
    document.body.appendChild(firework);
    
    // إزالة اللعبة النارية بعد الانتهاء
    setTimeout(() => {
        firework.remove();
    }, 1000);
}

// بدء لعبة جديدة
function startNewGame() {
    const name = playerNameInput.value.trim();
    if (!name) {
        showNotification('الرجاء إدخال اسمك!');
        playerNameInput.classList.add('error');
        setTimeout(() => {
            playerNameInput.classList.remove('error');
        }, 1000);
        return;
    }
    
    gameState = {
        playerName: name,
        currentQuestion: 0,
        score: 0,
        lifelines: {
            fiftyFifty: true,
            askAudience: true,
            phoneFriend: true
        },
        usedQuestions: new Set(),
        gameActive: true,
        timer: null,
        timeLeft: 30,
        selectedOption: null
    };
    
    // تحديث واجهة اللاعب
    currentPlayerSpan.innerHTML = `<i class="fas fa-user"></i> اللاعب: ${name}`;
    
    // إعادة تعليمات المساعدات
    fiftyFiftyBtn.disabled = false;
    fiftyFiftyBtn.innerHTML = '<i class="fas fa-balance-scale"></i> 50:50';
    fiftyFiftyBtn.classList.remove('used');
    askAudienceBtn.disabled = false;
    askAudienceBtn.innerHTML = '<i class="fas fa-users"></i> الجمهور';
    askAudienceBtn.classList.remove('used');
    phoneFriendBtn.disabled = false;
    phoneFriendBtn.innerHTML = '<i class="fas fa-phone-alt"></i> صديق';
    phoneFriendBtn.classList.remove('used');
    
    // الانتقال لشاشة اللعبة مع تأثير
    startScreen.classList.add('fade-out');
    setTimeout(() => {
        startScreen.classList.remove('active', 'fade-out');
        gameScreen.classList.add('active');
        resultScreen.classList.remove('active');
        
        // عرض السؤال الأول
        displayQuestion();
    }, 500);
}

// عرض نافذة الانسحاب
function showWithdrawModal() {
    const currentPrize = PRIZES[gameState.currentQuestion];
    withdrawAmount.textContent = currentPrize.toLocaleString();
    withdrawModal.classList.add('active');
    
    // إيقاف المؤقت أثناء عرض نافذة الانسحاب
    clearInterval(gameState.timer);
}

// تنفيذ الانسحاب
function performWithdraw() {
    gameState.score = PRIZES[gameState.currentQuestion];
    withdrawModal.classList.remove('active');
    endGame(false);
}

// إضافة أنماط CSS ديناميكية
function addDynamicStyles() {
    const styles = `
        /* أنماط إضافية */
        .timer-display {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 100;
        }
        
        .timer-circle {
            position: relative;
            width: 60px;
            height: 60px;
        }
        
        .timer-bg {
            fill: none;
            stroke: rgba(255, 255, 255, 0.1);
            stroke-width: 4;
        }
        
        .timer-progress {
            fill: none;
            stroke: #27ae60;
            stroke-width: 4;
            stroke-linecap: round;
            transform: rotate(-90deg);
            transform-origin: 50% 50%;
            transition: stroke-dashoffset 1s linear;
        }
        
        .timer-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 1.2rem;
            font-weight: bold;
            color: white;
        }
        
        .timer-display.warning .timer-progress {
            stroke: #f39c12;
        }
        
        .timer-display.danger .timer-progress {
            stroke: #e74c3c;
        }
        
        .question-category {
            display: inline-block;
            background: rgba(255, 215, 0, 0.2);
            padding: 5px 15px;
            border-radius: 20px;
            margin-bottom: 10px;
            font-size: 0.9rem;
            color: gold;
        }
        
        .difficulty {
            text-align: left;
            color: #ddd;
            font-size: 0.9rem;
            margin-top: 10px;
        }
        
        .option-btn.selected {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }
        
        .option-btn.correct {
            background: #27ae60 !important;
            border-color: #229954 !important;
            animation: pulse 0.5s ease infinite;
        }
        
        .option-btn.wrong {
            background: #e74c3c !important;
            border-color: #c0392b !important;
            animation: shake 0.5s ease;
        }
        
        .prize-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            animation: popup 1s ease;
        }
        
        .prize-popup-content {
            background: linear-gradient(135deg, gold, #ffd700);
            padding: 20px 40px;
            border-radius: 15px;
            color: #0c2461;
            font-size: 2rem;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 0 30px gold;
        }
        
        .audience-chart {
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
            height: 200px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            margin: 20px 0;
        }
        
        .chart-bar {
            width: 50px;
            background: linear-gradient(to top, gold, #ffd700);
            border-radius: 5px 5px 0 0;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding-top: 10px;
            color: #0c2461;
            font-weight: bold;
        }
        
        .phone-call {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
        }
        
        .call-header {
            display: flex;
            align-items: center;
            gap: 10px;
            color: gold;
            margin-bottom: 20px;
        }
        
        .friend-message {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .bubble {
            background: gold;
            color: #0c2461;
            padding: 15px;
            border-radius: 20px;
            max-width: 80%;
        }
        
        .friend-avatar {
            font-size: 2rem;
            color: #ddd;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 215, 0, 0.9);
            color: #0c2461;
            padding: 15px 25px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            animation: slideIn 0.5s ease;
        }
        
        .notification.fade-out {
            animation: fadeOut 0.5s ease forwards;
        }
        
        .prize-item.highlight {
            animation: highlight 2s ease;
        }
        
        .lifeline-btn.used {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .firework {
            position: fixed;
            border-radius: 50%;
            animation: explode 1s ease-out forwards;
            z-index: 9999;
        }
        
        /* الرسوم المتحركة */
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        
        @keyframes popup {
            0% { transform: translate(-50%, -50%) scale(0); }
            50% { transform: translate(-50%, -50%) scale(1.2); }
            100% { transform: translate(-50%, -50%) scale(1); }
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes highlight {
            0%, 100% { box-shadow: none; }
            50% { box-shadow: 0 0 20px gold; }
        }
        
        @keyframes explode {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(10); opacity: 0; }
        }
        
        body.shake {
            animation: shake 0.5s ease;
        }
        
        .question-container.pulse {
            animation: pulse 1s ease;
        }
        
        .question-container.celebrate {
            animation: pulse 0.5s ease infinite;
        }
        
        .fade-out {
            animation: fadeOut 0.5s ease forwards;
        }
        
        .next-btn.pulse {
            animation: pulse 1s ease infinite;
        }
        
        input.error {
            border-color: #e74c3c !important;
            animation: shake 0.5s ease;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// أحداث المستخدم
startBtn.addEventListener('click', startNewGame);
playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startNewGame();
});

optionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!gameState.gameActive || nextBtn.disabled === false) return;
        checkAnswer(btn.dataset.option);
    });
});

nextBtn.addEventListener('click', () => {
    if (nextBtn.disabled) return;
    
    nextBtn.classList.remove('pulse');
    gameState.currentQuestion++;
    if (gameState.currentQuestion >= 15) {
        endGame(true);
    } else {
        displayQuestion();
    }
});

withdrawBtn.addEventListener('click', showWithdrawModal);
fiftyFiftyBtn.addEventListener('click', useFiftyFifty);
askAudienceBtn.addEventListener('click', useAskAudience);
phoneFriendBtn.addEventListener('click', usePhoneFriend);

playAgainBtn.addEventListener('click', () => {
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
    playerNameInput.value = gameState.playerName;
    playerNameInput.focus();
});

closeHelp.addEventListener('click', () => {
    helpModal.classList.remove('active');
    // إعادة تشغيل المؤقت
    if (gameState.gameActive) {
        startTimer();
    }
});

confirmWithdraw.addEventListener('click', performWithdraw);
cancelWithdraw.addEventListener('click', () => {
    withdrawModal.classList.remove('active');
    // إعادة تشغيل المؤقت
    if (gameState.gameActive) {
        startTimer();
    }
});

// إغلاق النوافذ عند النقر خارجها
window.addEventListener('click', (e) => {
    if (e.target === helpModal) {
        helpModal.classList.remove('active');
        if (gameState.gameActive) {
            startTimer();
        }
    }
    if (e.target === withdrawModal) {
        withdrawModal.classList.remove('active');
        if (gameState.gameActive) {
            startTimer();
        }
    }
});

// إضافة صوتيات عند التمرير
window.addEventListener('scroll', () => {
    if (gameState.gameActive) {
        // صوت تمرير خفيف
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    }
});

// تهيئة اللعبة عند التحميل
window.addEventListener('DOMContentLoaded', () => {
    initializePrizes();
    addDynamicStyles();
    playerNameInput.focus();
    
    // إضافة تأثيرات للشعار
    const logoIcon = document.querySelector('.logo i');
    logoIcon.style.animation = 'pulse 2s infinite';
    
    // إضافة رسالة ترحيب
    setTimeout(() => {
        showNotification('مرحباً بك في المليونير الذهبي! أدخل اسمك وابدأ اللعب');
    }, 1000);
    
    // إضافة تأثيرات للخلفية
    createBackgroundEffects();
});

// إنشاء تأثيرات للخلفية
function createBackgroundEffects() {
    const container = document.querySelector('.container');
    
    // إضافة نجوم متحركة
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(star);
    }
    
    // إضافة أنماط للنجوم
    const starStyles = `
        .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            animation: twinkle 3s infinite;
        }
        
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = starStyles;
    document.head.appendChild(styleSheet);
}

// إضافة زر للصوت
function addSoundToggle() {
    const soundToggle = document.createElement('button');
    soundToggle.id = 'sound-toggle';
    soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    soundToggle.className = 'sound-btn';
    
    document.querySelector('.game-header').appendChild(soundToggle);
    
    let soundOn = true;
    
    soundToggle.addEventListener('click', () => {
        soundOn = !soundOn;
        soundToggle.innerHTML = soundOn ? 
            '<i class="fas fa-volume-up"></i>' : 
            '<i class="fas fa-volume-mute"></i>';
        
        // يمكنك هنا التحكم في إيقاف/تشغيل جميع الأصوات
        showNotification(soundOn ? 'الصوت مفعل' : 'الصوت معطل');
    });
}

// تهيئة إضافية بعد تحميل الصفحة
setTimeout(() => {
    addSoundToggle();
}, 500);
