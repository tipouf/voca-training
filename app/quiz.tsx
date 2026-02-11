import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getWords, getSentences, getSettings } from '@/src/utils/storage';
import { Word, Sentence, QuizDirection, ContentType } from '@/src/types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, Typography, BorderRadius } from '@/src/constants/theme';

type QuizItem = Word | Sentence;

export default function QuizScreen() {
    const [items, setItems] = useState<QuizItem[]>([]);
    const [availableItems, setAvailableItems] = useState<QuizItem[]>([]);
    const [currentItem, setCurrentItem] = useState<QuizItem | null>(null);
    const [revealed, setRevealed] = useState(false);
    const [timer, setTimer] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [revealDelay, setRevealDelay] = useState(5000);
    const [currentIndex, setCurrentIndex] = useState(0);

    const params = useLocalSearchParams<{ direction?: string; contentType?: string }>();
    const direction: QuizDirection = (params.direction as QuizDirection) || 'forward';
    const contentType: ContentType = (params.contentType as ContentType) || 'vocabulary';

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: 'Quiz' });
        initQuiz();
        return () => clearTimer();
    }, []);

    const clearTimer = () => {
        if (timer) clearTimeout(timer);
    };

    const initQuiz = async () => {
        const settings = await getSettings();
        setRevealDelay(settings.revealDelay);

        const data = contentType === 'vocabulary' ? await getWords() : await getSentences();

        // Filter out items excluded from quiz
        const includedItems = data.filter(item => item.includeInQuiz !== false);

        if (includedItems.length === 0) {
            setLoading(false);
            return;
        }

        // Reset mastered status for all items
        const resetData = includedItems.map(item => ({ ...item, mastered: false }));
        setItems(resetData);
        setAvailableItems(resetData);
        pickRandomItem(resetData, settings.revealDelay);
        setLoading(false);
    };

    const pickRandomItem = (itemList: QuizItem[], delayMs: number) => {
        if (itemList.length === 0) {
            // All items mastered, reset and start over
            const resetData = items.map(item => ({ ...item, mastered: false }));
            setAvailableItems(resetData);
            itemList = resetData;
        }

        let candidates = itemList;
        if (itemList.length > 1 && currentItem) {
            candidates = itemList.filter(item => item.id !== currentItem.id);
        }

        const randomIndex = Math.floor(Math.random() * candidates.length);
        const selected = candidates[randomIndex];

        setCurrentItem(selected);
        setRevealed(false);
        startRevealTimer(delayMs);
    };

    const startRevealTimer = (delayMs: number) => {
        clearTimer();

        const id = setTimeout(() => {
            setRevealed(true);
        }, delayMs);

        // @ts-ignore
        setTimer(id);
    };

    const handleThumbsUp = () => {
        // Mark as mastered and remove from available items
        const updatedAvailable = availableItems.filter(item => item.id !== currentItem?.id);
        setAvailableItems(updatedAvailable);
        pickRandomItem(updatedAvailable, revealDelay);
        setCurrentIndex(prev => prev + 1);
    };

    const handleThumbsDown = () => {
        // Keep in rotation, just move to next
        pickRandomItem(availableItems, revealDelay);
        setCurrentIndex(prev => prev + 1);
    };

    const handleReveal = () => {
        clearTimer();
        setRevealed(true);
    };

    const getSourceText = (item: QuizItem): string => {
        if ('word' in item) {
            return direction === 'forward' ? item.word : item.translation;
        } else {
            return direction === 'forward' ? item.sentence : item.translation;
        }
    };

    const getTargetText = (item: QuizItem): string => {
        if ('word' in item) {
            return direction === 'forward' ? item.translation : item.word;
        } else {
            return direction === 'forward' ? item.translation : item.sentence;
        }
    };

    const getSourceLabel = (): string => {
        return direction === 'forward' ? 'Vietnamese' : 'English';
    };

    const getTargetLabel = (): string => {
        return direction === 'forward' ? 'English' : 'Vietnamese';
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary[500]} />
            </View>
        );
    }

    if (items.length === 0) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <LinearGradient
                    colors={[Colors.primary[500], Colors.secondary[500]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <ThemedText type="title" style={styles.headerTitle}>
                        Quiz
                    </ThemedText>
                </LinearGradient>
                <View style={styles.centered}>
                    <ThemedText style={styles.emptyTitle}>No items to practice!</ThemedText>
                    <ThemedText style={styles.emptySubtitle}>
                        Add some {contentType === 'vocabulary' ? 'words' : 'sentences'} first
                    </ThemedText>
                </View>
            </SafeAreaView>
        );
    }

    if (!currentItem) return null;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <LinearGradient
                colors={[Colors.primary[500], Colors.secondary[500]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <ThemedText type="title" style={styles.headerTitle}>
                    Quiz
                </ThemedText>
                <ThemedText style={styles.headerSubtitle}>
                    {contentType === 'vocabulary' ? 'Vocabulary' : 'Sentences'} • {getSourceLabel()} → {getTargetLabel()}
                </ThemedText>
            </LinearGradient>

            <ThemedView style={styles.content}>
                <Card elevation="lg" style={styles.quizCard}>
                    <View style={styles.badge}>
                        <ThemedText style={styles.badgeText}>#{currentIndex + 1}</ThemedText>
                    </View>

                    <ThemedText style={styles.label}>{getSourceLabel()}</ThemedText>
                    <ThemedText type="title" style={styles.sourceText} numberOfLines={0}>
                        {getSourceText(currentItem)}
                    </ThemedText>

                    <View style={styles.divider} />

                    <ThemedText style={styles.label}>{getTargetLabel()}</ThemedText>
                    {revealed ? (
                        <ThemedText type="title" style={styles.translationText} numberOfLines={0}>
                            {getTargetText(currentItem)}
                        </ThemedText>
                    ) : (
                        <View style={styles.hiddenContainer}>
                            <ThemedText style={styles.hiddenText}>...</ThemedText>
                            <Button title="Reveal Now" onPress={handleReveal} variant="outline" />
                        </View>
                    )}
                </Card>

                <View style={styles.footer}>
                    {revealed && (
                        <View style={styles.ratingButtons}>
                            <TouchableOpacity
                                style={[styles.ratingButton, styles.thumbsDownButton]}
                                onPress={handleThumbsDown}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="thumbs-down" size={32} color={Colors.white} />
                                <ThemedText style={styles.ratingButtonText}>Review Again</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.ratingButton, styles.thumbsUpButton]}
                                onPress={handleThumbsUp}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="thumbs-up" size={32} color={Colors.white} />
                                <ThemedText style={styles.ratingButtonText}>Mastered!</ThemedText>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.light,
    },
    header: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.base,
        paddingBottom: Spacing.xl,
    },
    headerTitle: {
        fontSize: Typography.fontSize['3xl'],
        fontWeight: Typography.fontWeight.bold,
        color: Colors.white,
        marginBottom: Spacing.xs,
    },
    headerSubtitle: {
        fontSize: Typography.fontSize.sm,
        color: Colors.white,
        opacity: 0.9,
    },
    content: {
        flex: 1,
        padding: Spacing.lg,
        justifyContent: 'center',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing['4xl'],
    },
    quizCard: {
        padding: Spacing.xl,
        alignItems: 'center',
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: Spacing.base,
        right: Spacing.base,
        backgroundColor: Colors.primary[100],
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
    },
    badgeText: {
        fontSize: Typography.fontSize.xs,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.primary[600],
    },
    label: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.light.secondary,
        marginBottom: Spacing.sm,
        marginTop: Spacing.lg,
        alignSelf: 'flex-start',
    },
    sourceText: {
        fontSize: Typography.fontSize['2xl'],
        fontWeight: Typography.fontWeight.bold,
        textAlign: 'center',
        color: Colors.text.light.primary,
        flexShrink: 1,
    },
    translationText: {
        fontSize: Typography.fontSize.xl,
        color: Colors.primary[600],
        textAlign: 'center',
        flexShrink: 1,
    },
    divider: {
        height: 1,
        width: '80%',
        backgroundColor: Colors.gray[200],
        marginVertical: Spacing.xl,
    },
    hiddenContainer: {
        alignItems: 'center',
        gap: Spacing.base,
        width: '100%',
    },
    hiddenText: {
        fontSize: Typography.fontSize['3xl'],
        color: Colors.gray[300],
    },
    footer: {
        marginTop: Spacing.xl,
    },
    ratingButtons: {
        flexDirection: 'row',
        gap: Spacing.md,
        width: '100%',
    },
    ratingButton: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.md,
        gap: Spacing.sm,
    },
    thumbsUpButton: {
        backgroundColor: Colors.success,
    },
    thumbsDownButton: {
        backgroundColor: Colors.error,
    },
    ratingButtonText: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.white,
    },
    emptyTitle: {
        fontSize: Typography.fontSize.xl,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.text.light.primary,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: Typography.fontSize.base,
        color: Colors.text.light.secondary,
        textAlign: 'center',
    },
});
