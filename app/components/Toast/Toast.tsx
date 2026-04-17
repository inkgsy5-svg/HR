import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUIStore } from '@store/uiStore';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';

const toastColors = {
  success: colors.success,
  error: colors.error,
  warning: colors.warning,
  info: colors.info,
};

export default function ToastContainer() {
  const toasts = useUIStore(state => state.toasts);
  const removeToast = useUIStore(state => state.removeToast);
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View style={[styles.container, { top: insets.top + spacing.sm }]}>
      {toasts.map(toast => (
        <TouchableOpacity
          key={toast.id}
          style={[styles.toast, { borderLeftColor: toastColors[toast.type] }]}
          onPress={() => removeToast(toast.id)}
          activeOpacity={0.9}
        >
          <Text style={styles.message}>{toast.message}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 9999,
    gap: spacing.xs,
  },
  toast: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  message: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
});
