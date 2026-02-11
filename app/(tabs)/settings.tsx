import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    getSettings,
    saveSettings,
    exportWords,
    importWords,
    exportSentences,
    importSentences,
    getWords,
    getSentences,
    updateWord,
    updateSentence,
} from '@/src/utils/storage';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, Typography, BorderRadius } from '@/src/constants/theme';

export default function SettingsScreen() {
    const [delay, setDelay] = useState('5');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const settings = await getSettings();
        setDelay((settings.revealDelay / 1000).toString());
    };

    const handleSave = async () => {
        const delayNum = parseFloat(delay);
        if (isNaN(delayNum) || delayNum < 0) {
            Alert.alert('Invalid Input', 'Please enter a valid positive number');
            return;
        }

        await saveSettings({ revealDelay: delayNum * 1000 });
        Alert.alert('Saved', 'Settings updated successfully');
    };

    const handleExportWords = async () => {
        try {
            await exportWords();
        } catch (e) {
            console.error(e);
            Alert.alert('Export Failed', 'An error occurred while exporting vocabulary.');
        }
    };

    const handleImportWords = async () => {
        try {
            const count = await importWords();
            if (count > 0) {
                Alert.alert('Import Successful', `Imported ${count} new words.`);
            }
        } catch (e) {
            console.error(e);
            Alert.alert('Import Failed', 'An error occurred while importing vocabulary.');
        }
    };

    const handleExportSentences = async () => {
        try {
            await exportSentences();
        } catch (e) {
            console.error(e);
            Alert.alert('Export Failed', 'An error occurred while exporting sentences.');
        }
    };

    const handleImportSentences = async () => {
        try {
            const count = await importSentences();
            if (count > 0) {
                Alert.alert('Import Successful', `Imported ${count} new sentences.`);
            }
        } catch (e) {
            console.error(e);
            Alert.alert('Import Failed', 'An error occurred while importing sentences.');
        }
    };

    const handleResetQuizInclusion = async () => {
        Alert.alert(
            'Reset Quiz Inclusion',
            'This will re-include all words and sentences in the quiz. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const words = await getWords();
                            const sentences = await getSentences();

                            // Re-include all words
                            for (const word of words) {
                                if (word.includeInQuiz === false) {
                                    await updateWord(word.id, { includeInQuiz: true });
                                }
                            }

                            // Re-include all sentences
                            for (const sentence of sentences) {
                                if (sentence.includeInQuiz === false) {
                                    await updateSentence(sentence.id, { includeInQuiz: true });
                                }
                            }

                            Alert.alert('Success', 'All items have been re-included in the quiz!');
                        } catch (e) {
                            console.error(e);
                            Alert.alert('Error', 'Failed to reset quiz inclusion.');
                        }
                    },
                },
            ]
        );
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
                    Settings
                </ThemedText>
                <ThemedText style={styles.headerSubtitle}>
                    Customize your learning experience
                </ThemedText>
            </LinearGradient>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                {/* General Settings */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>General</ThemedText>
                    <Card elevation="sm">
                        <ThemedText style={styles.label}>Reveal Delay (seconds)</ThemedText>
                        <TextInput
                            style={styles.input}
                            value={delay}
                            onChangeText={setDelay}
                            keyboardType="numeric"
                            placeholder="5"
                            placeholderTextColor={Colors.gray[400]}
                        />
                        <Button title="Save Settings" onPress={handleSave} variant="secondary" fullWidth />
                    </Card>
                </View>

                {/* Vocabulary Data */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Vocabulary Data</ThemedText>
                    <Card elevation="sm">
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Export Vocabulary"
                                onPress={handleExportWords}
                                variant="outline"
                                fullWidth
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Import Vocabulary"
                                onPress={handleImportWords}
                                variant="outline"
                                fullWidth
                            />
                        </View>
                    </Card>
                </View>

                {/* Sentence Data */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Sentence Data</ThemedText>
                    <Card elevation="sm">
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Export Sentences"
                                onPress={handleExportSentences}
                                variant="outline"
                                fullWidth
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Import Sentences"
                                onPress={handleImportSentences}
                                variant="outline"
                                fullWidth
                            />
                        </View>
                    </Card>
                </View>

                {/* Quiz Management */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Quiz Management</ThemedText>
                    <Card elevation="sm">
                        <ThemedText style={styles.label}>Reset Quiz Inclusion</ThemedText>
                        <ThemedText style={styles.description}>
                            Re-include all words and sentences that were excluded from the quiz.
                        </ThemedText>
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Reset All to Included"
                                onPress={handleResetQuizInclusion}
                                variant="outline"
                                fullWidth
                            />
                        </View>
                    </Card>
                </View>

                {/* App Info */}
                <View style={styles.section}>
                    <Card elevation="sm" style={styles.infoCard}>
                        <ThemedText style={styles.appName}>Jenny's English</ThemedText>
                        <ThemedText style={styles.appVersion}>Version 1.0.0</ThemedText>
                    </Card>
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
        marginBottom: Spacing.md,
    },
    label: {
        marginBottom: Spacing.sm,
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.medium,
        color: Colors.text.light.primary,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: Colors.gray[300],
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.base,
        fontSize: Typography.fontSize.base,
        backgroundColor: Colors.white,
        color: Colors.text.light.primary,
        marginBottom: Spacing.base,
    },
    buttonContainer: {
        marginBottom: Spacing.md,
    },
    infoCard: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
    },
    appName: {
        fontSize: Typography.fontSize.xl,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.primary[600],
        marginBottom: Spacing.xs,
    },
    appVersion: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.light.secondary,
    },
    description: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.light.secondary,
        marginBottom: Spacing.base,
        lineHeight: Typography.fontSize.sm * Typography.lineHeight.relaxed,
    },
});
