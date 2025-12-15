export const CONFIG = {
    APP_NAME: "المليونير الذهبي",
    VERSION: "3.0",
    TOTAL_QUESTIONS: 15,
    TIME_PER_QUESTION: 30,
    SAFE_HAVEN_LEVELS: [5, 10],
    LIFELINES_COUNT: 3,
    DEFAULT_VOLUME: 70,
    QUESTION_TYPES: {
        ALL: "all",
        GENERAL: "general",
        SCIENCE: "science",
        HISTORY: "history",
        SPORTS: "sports"
    },
    DIFFICULTY_LEVELS: {
        EASY: "easy",
        MEDIUM: "medium",
        HARD: "hard"
    },
    SOUND_EFFECTS: {
        CORRECT: "https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3",
        WRONG: "https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3",
        CLICK: "https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3",
        TIMER: "https://assets.mixkit.co/sfx/preview/mixkit-fast-clock-ticking-1020.mp3",
        WIN: "https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3",
        LOSE: "https://assets.mixkit.co/sfx/preview/mixkit-losing-bleeps-2026.mp3",
        LIFELINE: "https://assets.mixkit.co/sfx/preview/mixkit-magic-sparkles-3000.mp3"
    }
};

export const PRIZES = [
    100, 200, 300, 500, 1000,
    2000, 4000, 8000, 16000, 32000,
    64000, 125000, 250000, 500000, 1000000
];

export const QUESTION_CATEGORIES = {
    GENERAL: {
        name: "معلومات عامة",
        color: "#3498db",
        icon: "fas fa-globe"
    },
    SCIENCE: {
        name: "علوم وتكنولوجيا",
        color: "#2ecc71",
        icon: "fas fa-flask"
    },
    HISTORY: {
        name: "تاريخ",
        color: "#e74c3c",
        icon: "fas fa-landmark"
    },
    GEOGRAPHY: {
        name: "جغرافيا",
        color: "#9b59b6",
        icon: "fas fa-globe-asia"
    },
    SPORTS: {
        name: "رياضة",
        color: "#f39c12",
        icon: "fas fa-football-ball"
    },
    ARTS: {
        name: "فنون وأدب",
        color: "#1abc9c",
        icon: "fas fa-palette"
    }
};
