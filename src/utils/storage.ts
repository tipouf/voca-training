import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Word, AppSettings, DEFAULT_SETTINGS } from '../types';

const STORAGE_KEYS = {
    WORDS: '@vocabulary_app_words',
    SETTINGS: '@vocabulary_app_settings',
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
