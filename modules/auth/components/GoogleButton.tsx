import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';

interface GoogleButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function GoogleButton({ onPress, isLoading, disabled }: GoogleButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, (isLoading || disabled) && styles.disabled]}
      onPress={onPress}
      disabled={isLoading || disabled}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.textPrimary} size="small" />
      ) : (
        <>
          <AntDesign name="google" size={18} color={colors.textPrimary} style={styles.icon} />
          <Text style={styles.text}>Continuar con Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  disabled: { opacity: 0.5 },
  icon: { marginRight: spacing.sm },
  text: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});
