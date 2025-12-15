export const QUESTIONS = {
    GENERAL: [
        {
            id: 1,
            question: "ما هي عاصمة فرنسا؟",
            options: ["لندن", "برلين", "باريس", "مدريد"],
            correct: 2,
            category: "جغرافيا",
            difficulty: "easy",
            hint: "مدينة النور"
        },
        {
            id: 2,
            question: "كم عدد أيام الأسبوع؟",
            options: ["5", "6", "7", "8"],
            correct: 2,
            category: "معلومات عامة",
            difficulty: "easy",
            hint: "بداية من السبت"
        },
        {
            id: 3,
            question: "ما هو الكوكب الأحمر؟",
            options: ["الزهرة", "المريخ", "المشتري", "زحل"],
            correct: 1,
            category: "علوم",
            difficulty: "easy",
            hint: "سمي بلونه المميز"
        }
    ],
    
    SCIENCE: [
        {
            id: 4,
            question: "ما هو العنصر الكيميائي برمزه 'O'؟",
            options: ["ذهب", "أكسجين", "فضة", "نحاس"],
            correct: 1,
            category: "علوم",
            difficulty: "medium",
            hint: "ضروري للتنفس"
        },
        {
            id: 5,
            question: "كم عدد الكروموسومات في الخلية البشرية؟",
            options: ["23", "46", "32", "64"],
            correct: 1,
            category: "علوم",
            difficulty: "hard",
            hint: "عدد زوجي"
        }
    ],
    
    HISTORY: [
        {
            id: 6,
            question: "من هو مؤسس الدولة الأموية؟",
            options: ["معاوية بن أبي سفيان", "عمر بن الخطاب", "علي بن أبي طالب", "عثمان بن عفان"],
            correct: 0,
            category: "تاريخ",
            difficulty: "medium",
            hint: "ابن أبي سفيان"
        }
    ],
    
    SPORTS: [
        {
            id: 7,
            question: "كم لاعب في فريق كرة القدم؟",
            options: ["10", "11", "12", "13"],
            correct: 1,
            category: "رياضة",
            difficulty: "easy",
            hint: "بما فيهم حارس المرمى"
        }
    ]
};

export function getQuestionsByType(type, difficulty) {
    let allQuestions = [];
    
    if (type === 'all') {
        Object.values(QUESTIONS).forEach(category => {
            allQuestions = allQuestions.concat(category);
        });
    } else if (QUESTIONS[type.toUpperCase()]) {
        allQuestions = QUESTIONS[type.toUpperCase()];
    } else {
        allQuestions = QUESTIONS.GENERAL;
    }
    
    // تصفية حسب الصعوبة
    if (difficulty !== 'all') {
        allQuestions = allQuestions.filter(q => q.difficulty === difficulty);
    }
    
    // خلط الأسئلة
    return shuffleArray(allQuestions).slice(0, 15);
}

export function getQuestionById(id) {
    for (const category of Object.values(QUESTIONS)) {
        const question = category.find(q => q.id === id);
        if (question) return question;
    }
    return null;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export const QUESTION_BANK = {
    getRandomQuestions(count = 15) {
        const allQuestions = Object.values(QUESTIONS).flat();
        return shuffleArray(allQuestions).slice(0, count);
    },
    
    getQuestionsByCategory(category, count = 15) {
        const questions = QUESTIONS[category] || [];
        return shuffleArray(questions).slice(0, count);
    },
    
    getQuestionsByDifficulty(difficulty, count = 15) {
        const allQuestions = Object.values(QUESTIONS).flat();
        const filtered = allQuestions.filter(q => q.difficulty === difficulty);
        return shuffleArray(filtered).slice(0, count);
    }
};
