import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export default function Input({
  label,
  error,
  hint,
  rightIcon,
  containerStyle,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[styles.inputWrapper, isFocused && styles.focused, error ? styles.hasError : null]}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
        {rightIcon && <TouchableOpacity style={styles.rightIcon}>{rightIcon}</TouchableOpacity>}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  focused: { borderColor: colors.secondary },
  hasError: { borderColor: colors.error },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    paddingVertical: spacing.sm + 4,
  },
  rightIcon: { marginLeft: spacing.sm },
  error: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
  },
  hint: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
  },
});
