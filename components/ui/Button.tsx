import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/src/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    fullWidth = false,
    icon,
    style,
}) => {
    const getButtonStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: BorderRadius.md,
            ...getSize(),
            ...(fullWidth && { width: '100%' }),
        };

        if (variant === 'outline' || variant === 'ghost') {
            return {
                ...baseStyle,
                backgroundColor: 'transparent',
                borderWidth: variant === 'outline' ? 2 : 0,
                borderColor: Colors.primary[500],
            };
        }

        return baseStyle;
    };

    const getSize = (): ViewStyle => {
        switch (size) {
            case 'small':
                return {
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    minHeight: 36,
                };
            case 'large':
                return {
                    paddingHorizontal: Spacing.xl,
                    paddingVertical: Spacing.base,
                    minHeight: 52,
                };
            default:
                return {
                    paddingHorizontal: Spacing.lg,
                    paddingVertical: Spacing.md,
                    minHeight: 44,
                };
        }
    };

    const getTextStyle = (): TextStyle => {
        const baseTextStyle: TextStyle = {
            fontWeight: Typography.fontWeight.semibold,
            textAlign: 'center',
            ...getTextSize(),
        };

        if (variant === 'outline' || variant === 'ghost') {
            return {
                ...baseTextStyle,
                color: disabled ? Colors.gray[400] : Colors.primary[500],
            };
        }

        return {
            ...baseTextStyle,
            color: Colors.white,
        };
    };

    const getTextSize = (): TextStyle => {
        switch (size) {
            case 'small':
                return { fontSize: Typography.fontSize.sm };
            case 'large':
                return { fontSize: Typography.fontSize.lg };
            default:
                return { fontSize: Typography.fontSize.base };
        }
    };

    const renderContent = () => (
        <>
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' || variant === 'ghost' ? Colors.primary[500] : Colors.white}
                    size="small"
                />
            ) : (
                <>
                    {icon && <View style={{ marginRight: Spacing.sm }}>{icon}</View>}
                    <Text style={getTextStyle()}>{title}</Text>
                </>
            )}
        </>
    );

    if (variant === 'primary' || variant === 'secondary') {
        const gradientColors =
            variant === 'primary' ? Colors.gradients.primary : Colors.gradients.purple;

        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.8}
                style={[style]}
            >
                <LinearGradient
                    colors={disabled ? [Colors.gray[300], Colors.gray[400]] : gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[getButtonStyle(), disabled ? {} : Shadows.md]}
                >
                    {renderContent()}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            style={[getButtonStyle(), style, disabled && styles.disabled]}
        >
            {renderContent()}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    disabled: {
        opacity: 0.5,
    },
});
