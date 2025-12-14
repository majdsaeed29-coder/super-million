// config.js
export const CONFIG = {
    APP_NAME: "المليونير الذهبي",
    VERSION: "2.0.0",
    TOTAL_QUESTIONS: 15,
    TIME_PER_QUESTION: 30,
    SAFE_HAVEN_LEVELS: [5, 10],
    LIFELINES_COUNT: 3
};

export const PRIZES = [
    100, 200, 300, 500, 1000,
    2000, 4000, 8000, 16000, 32000,
    64000, 125000, 250000, 500000, 1000000
];

export const COLORS = {
    PRIMARY: "#0c2461",
    SECONDARY: "#1e3799",
    ACCENT: "#ffd700",
    SUCCESS: "#27ae60",
    ERROR: "#e74c3c",
    WARNING: "#f39c12"
};

export const STORAGE_KEYS = {
    PLAYER_NAME: "millionairePlayerName",
    SOUND_ENABLED: "millionaireSoundEnabled",
    HIGH_SCORES: "millionaireHighScores",
    GAME_STATE: "millionaireGameState"
};
