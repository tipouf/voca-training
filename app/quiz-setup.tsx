import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/src/constants/theme';
import { getQuizPreferences, saveQuizPreferences, getWords, getSentences } from '@/src/utils/storage';
import { QuizDirection, ContentType } from '@/src/types';

export default function QuizSetupScreen() {
    const [direction, setDirection] = useState<QuizDirection>('forward');
    const [contentType, setContentType] = useState<ContentType>('vocabulary');
    const [wordCount, setWordCount] = useState(0);
    const [sentenceCount, setSentenceCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        loadPreferences();
        loadCounts();
    }, []);

    const loadPreferences = async () => {
        const prefs = await getQuizPreferences();
        setDirection(prefs.direction);
        setContentType(prefs.contentType);
    };

    const loadCounts = async () => {
        const words = await getWords();
        const sentences = await getSentences();
        // Only count items included in quiz
        setWordCount(words.filter(w => w.includeInQuiz !== false).length);
        setSentenceCount(sentences.filter(s => s.includeInQuiz !== false).length);
    };

    const handleStartQuiz = async () => {
        // Save preferences
        await saveQuizPreferences({ direction, contentType });

        // Navigate to quiz with params
        router.push({
            pathname: '/quiz',
            params: { direction, contentType },
        });
    };

    const canStartQuiz = () => {
        if (contentType === 'vocabulary') {
            return wordCount > 0;
        } else {
            return sentenceCount > 0;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <LinearGradient
                colors={[Colors.primary[500], Colors.secondary[500]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <ThemedText type="title" style={styles.headerTitle}>
                    Quiz Setup
                </ThemedText>
                <ThemedText style={styles.headerSubtitle}>
                    Choose your preferences
                </ThemedText>
            </LinearGradient>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                {/* Content Type Selection */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Content Type</ThemedText>
                    <ThemedText style={styles.sectionDescription}>
                        What would you like to practice?
                    </ThemedText>

                    <View style={styles.optionsRow}>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => setContentType('vocabulary')}
                            activeOpacity={0.7}
                        >
                            <Card
                                elevation={contentType === 'vocabulary' ? 'md' : 'sm'}
                                gradient={contentType === 'vocabulary' ? Colors.gradients.primary : undefined}
                                style={[
                                    styles.optionCard,
                                    contentType === 'vocabulary' && styles.selectedCard,
                                ]}
                            >
                                <Ionicons
                                    name="book"
                                    size={32}
                                    color={contentType === 'vocabulary' ? Colors.white : Colors.primary[500]}
                                />
                                <ThemedText
                                    style={[
                                        styles.optionTitle,
                                        contentType === 'vocabulary' && styles.selectedText,
                                    ]}
                                >
                                    Vocabulary
                                </ThemedText>
                                <ThemedText
                                    style={[
                                        styles.optionCount,
                                        contentType === 'vocabulary' && styles.selectedSubtext,
                                    ]}
                                >
                                    {wordCount} words
                                </ThemedText>
                            </Card>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => setContentType('sentences')}
                            activeOpacity={0.7}
                        >
                            <Card
                                elevation={contentType === 'sentences' ? 'md' : 'sm'}
                                gradient={contentType === 'sentences' ? Colors.gradients.primary : undefined}
                                style={[
                                    styles.optionCard,
                                    contentType === 'sentences' && styles.selectedCard,
                                ]}
                            >
                                <Ionicons
                                    name="chatbubbles"
                                    size={32}
                                    color={contentType === 'sentences' ? Colors.white : Colors.primary[500]}
                                />
                                <ThemedText
                                    style={[
                                        styles.optionTitle,
                                        contentType === 'sentences' && styles.selectedText,
                                    ]}
                                >
                                    Sentences
                                </ThemedText>
                                <ThemedText
                                    style={[
                                        styles.optionCount,
                                        contentType === 'sentences' && styles.selectedSubtext,
                                    ]}
                                >
                                    {sentenceCount} sentences
                                </ThemedText>
                            </Card>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Direction Selection */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Quiz Direction</ThemedText>
                    <ThemedText style={styles.sectionDescription}>
                        Which direction do you want to practice?
                    </ThemedText>

                    <TouchableOpacity
                        style={styles.directionOption}
                        onPress={() => setDirection('forward')}
                        activeOpacity={0.7}
                    >
                        <Card
                            elevation={direction === 'forward' ? 'md' : 'sm'}
                            style={styles.directionCard}
                        >
                            <View style={styles.directionRow}>
                                <View style={styles.directionIconContainer}>
                                    <Ionicons
                                        name={direction === 'forward' ? 'radio-button-on' : 'radio-button-off'}
                                        size={24}
                                        color={direction === 'forward' ? Colors.primary[500] : Colors.gray[400]}
                                    />
                                </View>
                                <View style={styles.directionContent}>
                                    <ThemedText style={styles.directionTitle}>
                                        Vietnamese → English
                                    </ThemedText>
                                    <ThemedText style={styles.directionSubtitle}>
                                        Practice translating from Vietnamese to English
                                    </ThemedText>
                                </View>
                            </View>
                        </Card>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.directionOption}
                        onPress={() => setDirection('reverse')}
                        activeOpacity={0.7}
                    >
                        <Card
                            elevation={direction === 'reverse' ? 'md' : 'sm'}
                            style={styles.directionCard}
                        >
                            <View style={styles.directionRow}>
                                <View style={styles.directionIconContainer}>
                                    <Ionicons
                                        name={direction === 'reverse' ? 'radio-button-on' : 'radio-button-off'}
                                        size={24}
                                        color={direction === 'reverse' ? Colors.primary[500] : Colors.gray[400]}
                                    />
                                </View>
                                <View style={styles.directionContent}>
                                    <ThemedText style={styles.directionTitle}>
                                        English → Vietnamese
                                    </ThemedText>
                                    <ThemedText style={styles.directionSubtitle}>
                                        Practice translating from English to Vietnamese
                                    </ThemedText>
                                </View>
                            </View>
                        </Card>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Start Quiz"
                        onPress={handleStartQuiz}
                        size="large"
                        fullWidth
                        disabled={!canStartQuiz()}
                    />
                    {!canStartQuiz() && (
                        <ThemedText style={styles.warningText}>
                            No {contentType === 'vocabulary' ? 'words' : 'sentences'} available. Please add some first.
                        </ThemedText>
                    )}
                </View>
            </ScrollView>
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
        ...Shadows.md,
    },
    headerTitle: {
        fontSize: Typography.fontSize['3xl'],
        fontWeight: Typography.fontWeight.bold,
        color: Colors.white,
        marginBottom: Spacing.xs,
    },
    headerSubtitle: {
        fontSize: Typography.fontSize.base,
        color: Colors.white,
        opacity: 0.9,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.lg,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: Typography.fontSize.xl,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.text.light.primary,
        marginBottom: Spacing.xs,
    },
    sectionDescription: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.light.secondary,
        marginBottom: Spacing.base,
    },
    optionsRow: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    optionButton: {
        width: '48%',
    },
    optionCard: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xl,
        paddingHorizontal: Spacing.md,
        minHeight: 140,
        width: '100%',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedCard: {
        // Border stays transparent, only gradient/background color shows selection
    },
    optionTitle: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.semibold,
        marginTop: Spacing.md,
        color: Colors.text.light.primary,
    },
    optionCount: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.light.secondary,
        marginTop: Spacing.xs,
    },
    selectedText: {
        color: Colors.white,
    },
    selectedSubtext: {
        color: Colors.white,
        opacity: 0.9,
    },
    directionOption: {
        marginBottom: Spacing.md,
    },
    directionCard: {
        padding: 0,
    },
    directionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.base,
    },
    directionIconContainer: {
        marginRight: Spacing.base,
    },
    directionContent: {
        flex: 1,
    },
    directionTitle: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.text.light.primary,
        marginBottom: Spacing.xs,
    },
    directionSubtitle: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.light.secondary,
    },
    buttonContainer: {
        marginTop: Spacing.lg,
    },
    warningText: {
        fontSize: Typography.fontSize.sm,
        color: Colors.warning,
        textAlign: 'center',
        marginTop: Spacing.md,
    },
});
