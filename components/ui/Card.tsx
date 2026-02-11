import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Shadows, Spacing } from '@/src/constants/theme';

type CardVariant = 'elevated' | 'outline' | 'glass';
type ElevationLevel = 'sm' | 'base' | 'md' | 'lg';

interface CardProps {
    children: React.ReactNode;
    variant?: CardVariant;
    elevation?: ElevationLevel;
    gradient?: string[];
    onPress?: () => void;
    style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'elevated',
    elevation = 'base',
    gradient,
    onPress,
    style,
}) => {
    const getElevation = () => {
        switch (elevation) {
            case 'sm':
                return Shadows.sm;
            case 'md':
                return Shadows.md;
            case 'lg':
                return Shadows.lg;
            default:
                return Shadows.base;
        }
    };

    const getCardStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            borderRadius: BorderRadius.lg,
            padding: Spacing.base,
            overflow: 'hidden',
        };

        switch (variant) {
            case 'outline':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.white,
                    borderWidth: 1,
                    borderColor: Colors.gray[200],
                };
            case 'glass':
                return {
                    ...baseStyle,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    ...getElevation(),
                };
            default:
                return {
                    ...baseStyle,
                    backgroundColor: Colors.white,
                    ...getElevation(),
                };
        }
    };

    const content = <View style={styles.content}>{children}</View>;

    if (gradient) {
        return (
            <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[getCardStyle(), style]}
            >
                {content}
            </LinearGradient>
        );
    }

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[getCardStyle(), style]}>
                {content}
            </TouchableOpacity>
        );
    }

    return <View style={[getCardStyle(), style]}>{content}</View>;
};

const styles = StyleSheet.create({
    content: {
        // Additional content styling if needed
    },
});
