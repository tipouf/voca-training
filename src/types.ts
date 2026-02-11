export interface Word {
    id: string;
    word: string;
    translation: string;
    language?: string; // Optional, for future use (e.g. 'vi', 'fr')
    createdAt: number;
    mastered?: boolean; // Track if mastered in current quiz session
    includeInQuiz?: boolean; // Whether to include in quiz (default: true)
}

export interface Sentence {
    id: string;
    sentence: string;
    translation: string;
    createdAt: number;
    mastered?: boolean; // Track if mastered in current quiz session
    includeInQuiz?: boolean; // Whether to include in quiz (default: true)
}

export type QuizDirection = 'forward' | 'reverse';
export type ContentType = 'vocabulary' | 'sentences';

export interface QuizPreferences {
    direction: QuizDirection;
    contentType: ContentType;
}

export interface AppSettings {
    revealDelay: number; // in milliseconds
}

export const DEFAULT_SETTINGS: AppSettings = {
    revealDelay: 5000,
};

export const DEFAULT_QUIZ_PREFERENCES: QuizPreferences = {
    direction: 'forward',
    contentType: 'vocabulary',
};
