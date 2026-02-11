import React, { useState } from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { saveSentence } from '@/src/utils/storage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, Typography, BorderRadius } from '@/src/constants/theme';
import * as Crypto from 'expo-crypto';

export default function AddSentenceScreen() {
    const [sentence, setSentence] = useState('');
    const [translation, setTranslation] = useState('');

    const handleSave = async () => {
        if (!sentence.trim() || !translation.trim()) {
            Alert.alert('Error', 'Please enter both sentence and translation');
            return;
        }

        const newSentence = {
            id: Crypto.randomUUID(),
            sentence: sentence.trim(),
            translation: translation.trim(),
            createdAt: Date.now(),
        };

        await saveSentence(newSentence);
        setSentence('');
        setTranslation('');
        Alert.alert('Success', 'Sentence added!');
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
                    Add Sentence
                </ThemedText>
                <ThemedText style={styles.headerSubtitle}>
                    Build your sentence collection
                </ThemedText>
            </LinearGradient>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.content}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <Card elevation="md" style={styles.formCard}>
                            <ThemedText style={styles.label}>Vietnamese Sentence</ThemedText>
                            <TextInput
                                style={styles.input}
                                placeholder="Type sentence here..."
                                placeholderTextColor={Colors.gray[400]}
                                value={sentence}
                                onChangeText={setSentence}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />

                            <ThemedText style={styles.label}>English Translation</ThemedText>
                            <TextInput
                                style={styles.input}
                                placeholder="Type translation here..."
                                placeholderTextColor={Colors.gray[400]}
                                value={translation}
                                onChangeText={setTranslation}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </Card>

                        <View style={styles.buttonContainer}>
                            <Button title="Save Sentence" onPress={handleSave} size="large" fullWidth />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
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
    formCard: {
        marginBottom: Spacing.xl,
    },
    label: {
        marginTop: Spacing.base,
        marginBottom: Spacing.sm,
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.text.light.primary,
    },
    input: {
        minHeight: 100,
        borderWidth: 1,
        borderColor: Colors.gray[300],
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        fontSize: Typography.fontSize.base,
        backgroundColor: Colors.white,
        color: Colors.text.light.primary,
        marginBottom: Spacing.base,
    },
    buttonContainer: {
        marginTop: Spacing.base,
    },
});
