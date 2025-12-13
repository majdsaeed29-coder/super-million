// إعدادات اللعبة الأساسية
export const CONFIG = {
    APP_NAME: "المليونير الذهبي",
    VERSION: "1.0.0",
    TOTAL_QUESTIONS: 15,
    TIME_PER_QUESTION: 30,
    SAFE_HAVEN_LEVELS: [5, 10], // خطوط الأمان عند السؤال 5 و 10
    LIFELINES_COUNT: 3
};

// قائمة الجوائز
export const PRIZES = [
    100, 200, 300, 500, 1000, // الخط الآمن الأول
    2000, 4000, 8000, 16000, 32000, // الخط الآمن الثاني
    64000, 125000, 250000, 500000, 1000000 // المليون
];

// ألوان اللعبة
export const COLORS = {
    PRIMARY: "#0c2461",
    SECONDARY: "#1e3799",
    GOLD: "#ffd700",
    CORRECT: "#27ae60",
    WRONG: "#e74c3c",
    WARNING: "#f39c12"
};

// رسائل اللعبة
export const MESSAGES = {
    WELCOME: "مرحباً بك في المليونير الذهبي!",
    TIMES_UP: "انتهى الوقت!",
    WIN: "مبروك! فزت بالمليون!",
    GAME_OVER: "انتهت اللعبة",
    SAFE_WITHDRAW: "انسحاب آمن"
};
