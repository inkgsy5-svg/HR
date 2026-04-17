import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  style,
  textStyle,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        (disabled || isLoading) && styles.disabled,
        style,
      ]}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.secondary : colors.white}
          size="small"
        />
      ) : (
        <Text
          style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`], textStyle]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },

  // Variants
  primary: { backgroundColor: colors.secondary },
  secondary: { backgroundColor: colors.accent },
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 1.5,
    borderColor: colors.secondary,
  },
  ghost: { backgroundColor: colors.transparent },

  // Sizes
  size_sm: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  size_md: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 4 },
  size_lg: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md },

  // Text
  text: { fontWeight: typography.fontWeight.semibold },
  text_primary: { color: colors.white },
  text_secondary: { color: colors.white },
  text_outline: { color: colors.secondary },
  text_ghost: { color: colors.secondary },

  textSize_sm: { fontSize: typography.fontSize.sm },
  textSize_md: { fontSize: typography.fontSize.base },
  textSize_lg: { fontSize: typography.fontSize.md },
});
