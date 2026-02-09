import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import { getSettings, saveSettings, exportWords, importWords } from '@/src/utils/storage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SettingsScreen() {
    const [delay, setDelay] = useState('5'); // default to 5s in UI

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

    const handleExport = async () => {
        try {
            await exportWords();
        } catch (e) {
            console.error(e);
            Alert.alert('Export Failed', 'An error occurred while exporting words.');
        }
    };

    const handleImport = async () => {
        try {
            const count = await importWords();
            if (count > 0) {
                Alert.alert('Import Successful', `Imported ${count} new words.`);
            } else {
                // User might have cancelled, so we don't necessarily need an alert here.
                // But if they selected a file and it had 0 valid words, maybe we should?
                // For now, let's just leave it silent on cancel/empty to avoid annoyance.
            }
        } catch (e) {
            console.error(e);
            Alert.alert('Import Failed', 'An error occurred while importing words.');
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>Settings</ThemedText>

            <View style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>General</ThemedText>
                <View style={styles.settingItem}>
                    <ThemedText style={styles.label}>Reveal Delay (seconds)</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={delay}
                        onChangeText={setDelay}
                        keyboardType="numeric"
                        placeholder="5"
                    />
                </View>
                <Button title="Save Settings" onPress={handleSave} />
            </View>

            <View style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>Data Management</ThemedText>
                <View style={styles.buttonContainer}>
                    <Button title="Export Vocabulary" onPress={handleExport} />
                </View>
                <View style={styles.buttonContainer}>
                    <Button title="Import Vocabulary" onPress={handleImport} />
                </View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        marginTop: 50,
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        marginBottom: 30,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 15,
        borderRadius: 10,
    },
    sectionTitle: {
        marginBottom: 15,
        fontSize: 18,
    },
    settingItem: {
        marginBottom: 15,
    },
    label: {
        marginBottom: 5,
        fontSize: 16,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        fontSize: 18,
        paddingVertical: 8,
        color: '#fff',
    },
    buttonContainer: {
        marginBottom: 10,
    },
});
