import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Button, ActivityIndicator } from 'react-native';
import { getWords, getSettings } from '@/src/utils/storage';
import { Word } from '@/src/types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useNavigation } from 'expo-router';

export default function QuizScreen() {
    const [words, setWords] = useState<Word[]>([]);
    const [currentWord, setCurrentWord] = useState<Word | null>(null);
    const [revealed, setRevealed] = useState(false);
    const [timer, setTimer] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [revealDelay, setRevealDelay] = useState(5000);

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: 'Quiz' });
        initQuiz();
        return () => clearTimer(); // Cleanup on unmount
    }, []);

    const clearTimer = () => {
        if (timer) clearTimeout(timer);
    };

    const initQuiz = async () => {
        const data = await getWords();
        const settings = await getSettings();
        setRevealDelay(settings.revealDelay);

        if (data.length === 0) {
            setLoading(false);
            return;
        }

        setWords(data);
        pickRandomWord(data, settings.revealDelay);
        setLoading(false);
    };

    const pickRandomWord = (wordList: Word[], delayMs: number) => {
        if (wordList.length === 0) return;

        let candidates = wordList;
        if (wordList.length > 1 && currentWord) {
            candidates = wordList.filter(w => w.id !== currentWord.id);
        }

        const randomIndex = Math.floor(Math.random() * candidates.length);
        const selected = candidates[randomIndex];

        setCurrentWord(selected);
        setRevealed(false);
        startRevealTimer(delayMs);
    };

    const startRevealTimer = (delayMs: number) => {
        clearTimer();
        setTimeLeft(delayMs / 1000);

        // Countdown for UI (optional, but good for UX)
        // For simplicity, we just use setTimeout for the reveal action
        // But to show a countdown, we'd need an interval. 
        // Let's sticking to the "after 5 seconds... revealed" requirement.

        const id = setTimeout(() => {
            setRevealed(true);
        }, delayMs);

        // @ts-ignore
        setTimer(id);
    };

    const handleNext = () => {
        pickRandomWord(words, revealDelay);
    };

    const handleReveal = () => {
        clearTimer();
        setRevealed(true);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (words.length === 0) {
        return (
            <View style={styles.centered}>
                <ThemedText>No words to practice!</ThemedText>
            </View>
        );
    }

    if (!currentWord) return null;

    return (
        <ThemedView style={styles.container}>
            <View style={styles.card}>
                <ThemedText style={styles.label}>Vietnamese</ThemedText>
                <ThemedText type="title" style={styles.wordText}>{currentWord.word}</ThemedText>

                <View style={styles.divider} />

                <ThemedText style={styles.label}>Translation</ThemedText>
                {revealed ? (
                    <ThemedText type="title" style={styles.translationText}>{currentWord.translation}</ThemedText>
                ) : (
                    <View style={styles.hiddenContainer}>
                        <ThemedText style={styles.hiddenText}>...</ThemedText>
                        <Button title="Reveal Now" onPress={handleReveal} />
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                {revealed && <Button title="Next Word" onPress={handleNext} />}
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '100%',
        padding: 30,
        backgroundColor: '#fff',
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#eee',
    },
    label: {
        fontSize: 14,
        color: '#888',
        marginBottom: 8,
        marginTop: 20,
    },
    wordText: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    translationText: {
        fontSize: 28,
        color: '#2e78b7',
        textAlign: 'center',
    },
    divider: {
        height: 1,
        width: '80%',
        backgroundColor: '#eee',
        marginVertical: 20,
    },
    hiddenContainer: {
        alignItems: 'center',
        gap: 10,
    },
    hiddenText: {
        fontSize: 24,
        color: '#ccc',
    },
    footer: {
        marginTop: 40,
        height: 50,
    }
});
