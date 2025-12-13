// قاعدة الأسئلة الكاملة
export const QUESTIONS = [
    // المستوى 1
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
    // ... يمكنك إضافة المزيد من الأسئلة
    // سأضيف 5 أسئلة لكل مستوى كمثال
];

// دالة للحصول على أسئلة حسب المستوى
export function getQuestionsByLevel(level) {
    return QUESTIONS.filter(q => q.level === level);
}

// دالة للحصول على سؤال عشوائي حسب المستوى
export function getRandomQuestion(level, usedIds = []) {
    const availableQuestions = QUESTIONS.filter(q => 
        q.level === level && !usedIds.includes(q.id)
    );
    
    if (availableQuestions.length === 0) {
        return QUESTIONS.find(q => q.level === level);
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    return availableQuestions[randomIndex];
}

// فئات الأسئلة
export const CATEGORIES = [
    "جغرافيا", "تاريخ", "علوم", "رياضة", "فن", 
    "أدب", "تكنولوجيا", "معلومات عامة", "ثقافة"
];
