import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Word, Sentence, AppSettings, QuizPreferences, DEFAULT_SETTINGS, DEFAULT_QUIZ_PREFERENCES } from '../types';

const STORAGE_KEYS = {
    WORDS: '@vocabulary_app_words',
    SENTENCES: '@vocabulary_app_sentences',
    SETTINGS: '@vocabulary_app_settings',
    QUIZ_PREFERENCES: '@vocabulary_app_quiz_preferences',
};

export const saveWord = async (word: Word): Promise<void> => {
    try {
        const existingWords = await getWords();
        const newWords = [...existingWords, word];
        await AsyncStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(newWords));
    } catch (e) {
        console.error('Error saving word', e);
    }
};

export const getWords = async (): Promise<Word[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.WORDS);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error reading words', e);
        return [];
    }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
        console.error('Error saving settings', e);
    }
};

export const getSettings = async (): Promise<AppSettings> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
        return jsonValue != null ? JSON.parse(jsonValue) : DEFAULT_SETTINGS;
    } catch (e) {
        console.error('Error reading settings', e);
        return DEFAULT_SETTINGS;
    }
};

export const clearAll = async (): Promise<void> => {
    try {
        await AsyncStorage.clear();
    } catch (e) {
        console.error('Error clearing storage', e);
    }
};

export const exportWords = async (): Promise<void> => {
    try {
        const words = await getWords();
        const content = words.map(w => `${w.word}|${w.translation}`).join('\n');
        const date = new Date().toISOString().split('T')[0];
        const fileUri = FileSystem.documentDirectory + `vocabulary_export_${date}.txt`;
        await FileSystem.writeAsStringAsync(fileUri, content);

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
        } else {
            alert('Sharing is not available on this device');
        }
    } catch (e) {
        console.error('Error exporting words', e);
        throw e;
    }
};

export const importWords = async (): Promise<number> => {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'text/plain',
            copyToCacheDirectory: true,
        });

        if (result.canceled) {
            return 0;
        }

        const fileUri = result.assets[0].uri;
        const content = await FileSystem.readAsStringAsync(fileUri);
        const lines = content.split('\n');

        const existingWords = await getWords();
        let newCount = 0;
        const newWords: Word[] = [];

        for (const line of lines) {
            const parts = line.split('|');
            if (parts.length >= 2) {
                const word = parts[0].trim();
                const translation = parts[1].trim();

                if (word && translation) {
                    newWords.push({
                        id: Date.now().toString() + Math.random().toString(), // Simple ID generation
                        word,
                        translation,
                        createdAt: Date.now(),
                    });
                    newCount++;
                }
            }
        }

        if (newCount > 0) {
            const finalWords = [...existingWords, ...newWords];
            await AsyncStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(finalWords));
        }

        return newCount;
    } catch (e) {
        console.error('Error importing words', e);
        throw e;
    }
};

// Sentence storage functions
export const saveSentence = async (sentence: Sentence): Promise<void> => {
    try {
        const existingSentences = await getSentences();
        const newSentences = [...existingSentences, sentence];
        await AsyncStorage.setItem(STORAGE_KEYS.SENTENCES, JSON.stringify(newSentences));
    } catch (e) {
        console.error('Error saving sentence', e);
    }
};

export const getSentences = async (): Promise<Sentence[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SENTENCES);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error reading sentences', e);
        return [];
    }
};

export const exportSentences = async (): Promise<void> => {
    try {
        const sentences = await getSentences();
        const content = sentences.map(s => `${s.sentence}|${s.translation}`).join('\n');
        const date = new Date().toISOString().split('T')[0];
        const fileUri = FileSystem.documentDirectory + `sentences_export_${date}.txt`;
        await FileSystem.writeAsStringAsync(fileUri, content);

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
        } else {
            alert('Sharing is not available on this device');
        }
    } catch (e) {
        console.error('Error exporting sentences', e);
        throw e;
    }
};

export const importSentences = async (): Promise<number> => {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'text/plain',
            copyToCacheDirectory: true,
        });

        if (result.canceled) {
            return 0;
        }

        const fileUri = result.assets[0].uri;
        const content = await FileSystem.readAsStringAsync(fileUri);
        const lines = content.split('\n');

        const existingSentences = await getSentences();
        let newCount = 0;
        const newSentences: Sentence[] = [];

        for (const line of lines) {
            const parts = line.split('|');
            if (parts.length >= 2) {
                const sentence = parts[0].trim();
                const translation = parts[1].trim();

                if (sentence && translation) {
                    newSentences.push({
                        id: Date.now().toString() + Math.random().toString(),
                        sentence,
                        translation,
                        createdAt: Date.now(),
                    });
                    newCount++;
                }
            }
        }

        if (newCount > 0) {
            const finalSentences = [...existingSentences, ...newSentences];
            await AsyncStorage.setItem(STORAGE_KEYS.SENTENCES, JSON.stringify(finalSentences));
        }

        return newCount;
    } catch (e) {
        console.error('Error importing sentences', e);
        throw e;
    }
};

// Quiz preferences storage
export const saveQuizPreferences = async (preferences: QuizPreferences): Promise<void> => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.QUIZ_PREFERENCES, JSON.stringify(preferences));
    } catch (e) {
        console.error('Error saving quiz preferences', e);
    }
};

export const getQuizPreferences = async (): Promise<QuizPreferences> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.QUIZ_PREFERENCES);
        return jsonValue != null ? JSON.parse(jsonValue) : DEFAULT_QUIZ_PREFERENCES;
    } catch (e) {
        console.error('Error reading quiz preferences', e);
        return DEFAULT_QUIZ_PREFERENCES;
    }
};

// Delete and update functions for words
export const deleteWord = async (id: string): Promise<void> => {
    try {
        const existingWords = await getWords();
        const filteredWords = existingWords.filter(word => word.id !== id);
        await AsyncStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(filteredWords));
    } catch (e) {
        console.error('Error deleting word', e);
        throw e;
    }
};

export const updateWord = async (id: string, updatedWord: Partial<Word>): Promise<void> => {
    try {
        const existingWords = await getWords();
        const updatedWords = existingWords.map(word =>
            word.id === id ? { ...word, ...updatedWord } : word
        );
        await AsyncStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(updatedWords));
    } catch (e) {
        console.error('Error updating word', e);
        throw e;
    }
};

// Delete and update functions for sentences
export const deleteSentence = async (id: string): Promise<void> => {
    try {
        const existingSentences = await getSentences();
        const filteredSentences = existingSentences.filter(sentence => sentence.id !== id);
        await AsyncStorage.setItem(STORAGE_KEYS.SENTENCES, JSON.stringify(filteredSentences));
    } catch (e) {
        console.error('Error deleting sentence', e);
        throw e;
    }
};

export const updateSentence = async (id: string, updatedSentence: Partial<Sentence>): Promise<void> => {
    try {
        const existingSentences = await getSentences();
        const updatedSentences = existingSentences.map(sentence =>
            sentence.id === id ? { ...sentence, ...updatedSentence } : sentence
        );
        await AsyncStorage.setItem(STORAGE_KEYS.SENTENCES, JSON.stringify(updatedSentences));
    } catch (e) {
        console.error('Error updating sentence', e);
        throw e;
    }
};

// Load default data from asset files
const DEFAULTS_LOADED_KEY = '@vocabulary_app_defaults_loaded';

export const loadDefaultVocabulary = async (): Promise<Word[]> => {
    try {
        const vocabularyFile = require('../../assets/data/vocabulary.txt');
        const response = await fetch(vocabularyFile);
        const text = await response.text();

        const words: Word[] = [];
        const lines = text.split('\n').filter(line => line.trim());

        for (const line of lines) {
            const [word, translation] = line.split('|').map(s => s.trim());
            if (word && translation) {
                words.push({
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    word,
                    translation,
                    createdAt: Date.now(),
                    includeInQuiz: true,
                });
            }
        }

        return words;
    } catch (e) {
        console.error('Error loading default vocabulary', e);
        return [];
    }
};

export const loadDefaultSentences = async (): Promise<Sentence[]> => {
    try {
        const sentencesFile = require('../../assets/data/sentences.txt');
        const response = await fetch(sentencesFile);
        const text = await response.text();

        const sentences: Sentence[] = [];
        const lines = text.split('\n').filter(line => line.trim());

        for (const line of lines) {
            const [sentence, translation] = line.split('|').map(s => s.trim());
            if (sentence && translation) {
                sentences.push({
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    sentence,
                    translation,
                    createdAt: Date.now(),
                    includeInQuiz: true,
                });
            }
        }

        return sentences;
    } catch (e) {
        console.error('Error loading default sentences', e);
        return [];
    }
};

export const initializeDefaultData = async (): Promise<void> => {
    try {
        // Check if defaults have already been loaded
        const defaultsLoaded = await AsyncStorage.getItem(DEFAULTS_LOADED_KEY);
        if (defaultsLoaded === 'true') {
            return; // Already loaded, don't reload
        }

        // Check if user already has data
        const existingWords = await getWords();
        const existingSentences = await getSentences();

        if (existingWords.length === 0 && existingSentences.length === 0) {
            // First launch - load defaults
            const defaultWords = await loadDefaultVocabulary();
            const defaultSentences = await loadDefaultSentences();

            if (defaultWords.length > 0) {
                await AsyncStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(defaultWords));
            }

            if (defaultSentences.length > 0) {
                await AsyncStorage.setItem(STORAGE_KEYS.SENTENCES, JSON.stringify(defaultSentences));
            }

            // Mark defaults as loaded
            await AsyncStorage.setItem(DEFAULTS_LOADED_KEY, 'true');

            console.log(`Loaded ${defaultWords.length} default words and ${defaultSentences.length} default sentences`);
        } else {
            // User already has data, just mark as loaded to avoid checking again
            await AsyncStorage.setItem(DEFAULTS_LOADED_KEY, 'true');
        }
    } catch (e) {
        console.error('Error initializing default data', e);
    }
};
