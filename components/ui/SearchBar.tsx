import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    TextInputProps,
    ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/src/constants/theme';

interface SearchBarProps extends Omit<TextInputProps, 'style'> {
    value: string;
    onChangeText: (text: string) => void;
    onClear?: () => void;
    style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    onClear,
    placeholder = 'Search...',
    style,
    ...rest
}) => {
    const handleClear = () => {
        onChangeText('');
        onClear?.();
    };

    return (
        <View style={[styles.container, style]}>
            <Ionicons name="search" size={20} color={Colors.gray[400]} style={styles.searchIcon} />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={Colors.gray[400]}
                style={styles.input}
                returnKeyType="search"
                {...rest}
            />
            {value.length > 0 && (
                <TouchableOpacity onPress={handleClear} style={styles.clearButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="close-circle" size={20} color={Colors.gray[400]} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        ...Shadows.sm,
    },
    searchIcon: {
        marginRight: Spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.regular,
        color: Colors.text.light.primary,
        paddingVertical: Spacing.sm,
    },
    clearButton: {
        marginLeft: Spacing.sm,
    },
});
