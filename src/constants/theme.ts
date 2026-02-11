// Jenny's English - Premium iOS Design System

export const Colors = {
    // Primary Brand Colors
    primary: {
        50: '#E6F4FE',
        100: '#CCE9FD',
        200: '#99D3FB',
        300: '#66BDF9',
        400: '#33A7F7',
        500: '#0091F5', // Main primary
        600: '#0074C4',
        700: '#005793',
        800: '#003A62',
        900: '#001D31',
    },

    // Secondary Colors
    secondary: {
        50: '#F5F0FF',
        100: '#EBE1FF',
        200: '#D7C3FF',
        300: '#C3A5FF',
        400: '#AF87FF',
        500: '#9B69FF',
        600: '#7C54CC',
        700: '#5D3F99',
        800: '#3E2A66',
        900: '#1F1533',
    },

    // Gradients
    gradients: {
        primary: ['#0091F5', '#9B69FF'],
        sunset: ['#FF6B6B', '#FFD93D'],
        ocean: ['#00D4FF', '#0091F5'],
        purple: ['#C471F5', '#9B69FF'],
        success: ['#56CCF2', '#2F80ED'],
    },

    // Semantic Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Neutrals
    white: '#FFFFFF',
    black: '#000000',

    gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },

    // Background colors
    background: {
        light: '#F9FAFB',
        lightCard: '#FFFFFF',
        dark: '#0A0E1A',
        darkCard: '#1A1F2E',
    },

    // Text colors
    text: {
        light: {
            primary: '#111827',
            secondary: '#6B7280',
            tertiary: '#9CA3AF',
            inverse: '#FFFFFF',
        },
        dark: {
            primary: '#F9FAFB',
            secondary: '#D1D5DB',
            tertiary: '#9CA3AF',
            inverse: '#111827',
        },
    },
};

export const Typography = {
    fontFamily: {
        // Using system fonts for best iOS feel
        regular: 'System',
        medium: 'System',
        semibold: 'System',
        bold: 'System',
    },

    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
    },

    fontWeight: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
        extrabold: '800' as const,
    },

    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 64,
};

export const BorderRadius = {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
};

export const Shadows = {
    // iOS-style shadows
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    base: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 12,
    },
};

export const Animation = {
    duration: {
        instant: 0,
        fast: 150,
        normal: 250,
        slow: 350,
        slower: 500,
    },

    easing: {
        linear: 'linear' as const,
        easeIn: 'ease-in' as const,
        easeOut: 'ease-out' as const,
        easeInOut: 'ease-in-out' as const,
    },
};

export const Layout = {
    maxWidth: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
    },

    minTouchTarget: 44, // iOS minimum touch target size
};
