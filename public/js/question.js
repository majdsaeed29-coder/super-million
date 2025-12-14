// question.js
export const QUESTIONS = [
    // المستوى 1 (أسئلة سهلة)
    {
        id: 1,
        question: "ما هي عاصمة فرنسا؟",
        options: ["لندن", "برلين", "باريس", "مدريد"],
        correct: 2,
        level: 1,
        category: "جغرافيا",
        difficulty: "سهل"
    },
    {
        id: 2,
        question: "كم عدد أيام الأسبوع؟",
        options: ["5", "6", "7", "8"],
        correct: 2,
        level: 1,
        category: "معلومات عامة",
        difficulty: "سهل"
    },
    {
        id: 3,
        question: "ما هو الكوكب الأحمر؟",
        options: ["الزهرة", "المريخ", "المشتري", "زحل"],
        correct: 1,
        level: 1,
        category: "علوم",
        difficulty: "سهل"
    },
    {
        id: 4,
        question: "ما هو لون التفاحة الناضجة؟",
        options: ["أخضر", "أصفر", "أحمر", "بنفسجي"],
        correct: 2,
        level: 1,
        category: "معلومات عامة",
        difficulty: "سهل"
    },
    {
        id: 5,
        question: "كم عدد أحرف اللغة العربية؟",
        options: ["26", "28", "30", "32"],
        correct: 1,
        level: 1,
        category: "لغة",
        difficulty: "سهل"
    },
    
    // المستوى 2
    {
        id: 6,
        question: "من هو مؤسس الدولة الأموية؟",
        options: ["معاوية بن أبي سفيان", "عمر بن الخطاب", "علي بن أبي طالب", "عثمان بن عفان"],
        correct: 0,
        level: 2,
        category: "تاريخ",
        difficulty: "متوسط"
    },
    {
        id: 7,
        question: "ما هو العنصر الكيميائي برمزه 'O'؟",
        options: ["ذهب", "أكسجين", "فضة", "نحاس"],
        correct: 1,
        level: 2,
        category: "علوم",
        difficulty: "متوسط"
    },
    {
        id: 8,
        question: "في أي دولة تقع برج إيفل؟",
        options: ["إيطاليا", "فرنسا", "إسبانيا", "ألمانيا"],
        correct: 1,
        level: 2,
        category: "جغرافيا",
        difficulty: "متوسط"
    },
    {
        id: 9,
        question: "ما هو الحيوان الوطني لأستراليا؟",
        options: ["الكنغر", "الدب", "الأسد", "النمر"],
        correct: 0,
        level: 2,
        category: "معلومات عامة",
        difficulty: "متوسط"
    },
    {
        id: 10,
        question: "من كتب رواية 'البؤساء'؟",
        options: ["فيكتور هوغو", "شارل ديكنز", "ليو تولستوي", "جورج أورويل"],
        correct: 0,
        level: 2,
        category: "أدب",
        difficulty: "متوسط"
    },
    
    // المستوى 3
    {
        id: 11,
        question: "كم عدد غرف البيت الأبيض؟",
        options: ["132", "147", "156", "168"],
        correct: 0,
        level: 3,
        category: "معلومات عامة",
        difficulty: "صعب"
    },
    {
        id: 12,
        question: "ما هو أسرع حيوان بري؟",
        options: ["الفهد", "الأسد", "النمر", "الذئب"],
        correct: 0,
        level: 3,
        category: "علوم",
        difficulty: "صعب"
    },
    {
        id: 13,
        question: "من هو مخترع الهاتف؟",
        options: ["غراهام بيل", "توماس إديسون", "نيكولا تيسلا", "ألكسندر بوبوف"],
        correct: 0,
        level: 3,
        category: "تاريخ",
        difficulty: "صعب"
    },
    {
        id: 14,
        question: "ما هي أكبر صحراء في العالم؟",
        options: ["الصحراء الكبرى", "صحراء الربع الخالي", "صحراء جوبي", "صحراء أنتاركتيكا"],
        correct: 3,
        level: 3,
        category: "جغرافيا",
        difficulty: "صعب"
    },
    {
        id: 15,
        question: "كم عدد عظام جسم الإنسان البالغ؟",
        options: ["206", "214", "198", "220"],
        correct: 0,
        level: 3,
        category: "علوم",
        difficulty: "صعب"
    }
];

export function getQuestionsByLevel(level) {
    return QUESTIONS.filter(q => q.level === level);
}

export function getRandomQuestion(level, usedIds = []) {
    const availableQuestions = QUESTIONS.filter(q => 
        q.level === level && !usedIds.includes(q.id)
    );
    
    if (availableQuestions.length === 0) {
        // إذا كل الأسئلة استخدمت، نعيد أي سؤال من المستوى
        const allLevelQuestions = QUESTIONS.filter(q => q.level === level);
        if (allLevelQuestions.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * allLevelQuestions.length);
        return allLevelQuestions[randomIndex];
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    return availableQuestions[randomIndex];
        }
