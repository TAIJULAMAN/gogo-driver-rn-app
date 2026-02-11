import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { Colors } from '../constants/Colors';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style
}) => {
    const buttonStyles: StyleProp<ViewStyle>[] = [
        styles.button,
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'outline' && styles.outlineButton,
        disabled && styles.disabledButton,
        style,
    ];

    const textStyles: StyleProp<TextStyle>[] = [
        styles.text,
        variant === 'primary' && styles.primaryText,
        variant === 'secondary' && styles.secondaryText,
        variant === 'outline' && styles.outlineText,
        disabled && styles.disabledText,
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? Colors.primary : Colors.white} />
            ) : (
                <Text style={textStyles}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    primaryButton: {
        backgroundColor: Colors.primary,
    },
    secondaryButton: {
        backgroundColor: Colors.secondary,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    disabledButton: {
        backgroundColor: Colors.gray[300],
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    primaryText: {
        color: Colors.secondary,
    },
    secondaryText: {
        color: Colors.white,
    },
    outlineText: {
        color: Colors.primary,
    },
    disabledText: {
        color: Colors.gray[500],
    },
});
