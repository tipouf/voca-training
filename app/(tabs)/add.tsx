import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Button, Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { saveWord } from '@/src/utils/storage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as Crypto from 'expo-crypto';

export default function AddWordScreen() {
    const [word, setWord] = useState('');
    const [translation, setTranslation] = useState('');
    const router = useRouter();

    const handleSave = async () => {
        if (!word.trim() || !translation.trim()) {
            Alert.alert('Error', 'Please enter both word and translation');
            return;
        }

        const newWord = {
            id: Crypto.randomUUID(),
            word: word.trim(),
            translation: translation.trim(),
            createdAt: Date.now(),
        };

        await saveWord(newWord);
        setWord('');
        setTranslation('');
        Alert.alert('Success', 'Word added!');
        // Optional: Navigate back or stay to add more
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ThemedView style={styles.inner}>
                    <ThemedText type="title" style={styles.title}>Add New Word</ThemedText>

                    <ThemedText style={styles.label}>Word (e.g. Vietnamese)</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="Type word here..."
                        placeholderTextColor="#888"
                        value={word}
                        onChangeText={setWord}
                    />

                    <ThemedText style={styles.label}>Translation</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="Type translation here..."
                        placeholderTextColor="#888"
                        value={translation}
                        onChangeText={setTranslation}
                    />

                    <View style={styles.buttonContainer}>
                        <Button title="Save Word" onPress={handleSave} />
                    </View>
                </ThemedView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        marginBottom: 30,
        textAlign: 'center',
    },
    label: {
        marginTop: 15,
        marginBottom: 5,
        fontSize: 16,
        fontWeight: '600',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fff',
        // minimal light mode optimization, ideally use themed colors
    },
    buttonContainer: {
        marginTop: 30,
    },
});
