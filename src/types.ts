export interface Word {
    id: string;
    word: string;
    translation: string;
    language?: string; // Optional, for future use (e.g. 'vi', 'fr')
    createdAt: number;
}

export interface AppSettings {
    revealDelay: number; // in milliseconds
}

export const DEFAULT_SETTINGS: AppSettings = {
    revealDelay: 5000,
};
