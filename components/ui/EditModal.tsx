import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface EditModalProps {
    visible: boolean;
    title: string;
    firstLabel: string;
    secondLabel: string;
    firstValue: string;
    secondValue: string;
    onSave: (firstValue: string, secondValue: string) => void;
    onCancel: () => void;
}

export function EditModal({
    visible,
    title,
    firstLabel,
    secondLabel,
    firstValue,
    secondValue,
    onSave,
    onCancel,
}: EditModalProps) {
    const [first, setFirst] = useState(firstValue);
    const [second, setSecond] = useState(secondValue);

    useEffect(() => {
        if (visible) {
            setFirst(firstValue);
            setSecond(secondValue);
        }
    }, [visible, firstValue, secondValue]);

    const handleSave = () => {
        if (first.trim() && second.trim()) {
            onSave(first.trim(), second.trim());
            setFirst('');
            setSecond('');
        }
    };

    const handleCancel = () => {
        setFirst('');
        setSecond('');
        onCancel();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleCancel}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={handleCancel}
                />
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <ThemedText style={styles.title}>{title}</ThemedText>
                        <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={Colors.gray[600]} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        <View style={styles.inputGroup}>
                            <ThemedText style={styles.label}>{firstLabel}</ThemedText>
                            <TextInput
                                style={styles.input}
                                value={first}
                                onChangeText={setFirst}
                                placeholder={`Enter ${firstLabel.toLowerCase()}`}
                                placeholderTextColor={Colors.gray[400]}
                                autoFocus
                                multiline
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <ThemedText style={styles.label}>{secondLabel}</ThemedText>
                            <TextInput
                                style={styles.input}
                                value={second}
                                onChangeText={setSecond}
                                placeholder={`Enter ${secondLabel.toLowerCase()}`}
                                placeholderTextColor={Colors.gray[400]}
                                multiline
                            />
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={handleCancel}
                        >
                            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={handleSave}
                        >
                            <ThemedText style={styles.saveButtonText}>Save</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        maxWidth: 500,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        ...Shadows.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray[200],
    },
    title: {
        fontSize: Typography.fontSize.xl,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.text.light.primary,
    },
    closeButton: {
        padding: Spacing.xs,
    },
    content: {
        padding: Spacing.lg,
        gap: Spacing.lg,
    },
    inputGroup: {
        gap: Spacing.sm,
    },
    label: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.medium,
        color: Colors.text.light.secondary,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.gray[300],
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: Typography.fontSize.base,
        color: Colors.text.light.primary,
        minHeight: 50,
        maxHeight: 120,
    },
    footer: {
        flexDirection: 'row',
        padding: Spacing.lg,
        gap: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.gray[200],
    },
    button: {
        flex: 1,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.gray[100],
    },
    cancelButtonText: {
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.gray[700],
    },
    saveButton: {
        backgroundColor: Colors.primary[500],
    },
    saveButtonText: {
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.white,
    },
});
