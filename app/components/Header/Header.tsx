import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
  onSearchPress?: () => void;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export default function Header({
  title,
  showLogo,
  onSearchPress,
  rightAction,
  style,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }, style]}>
      <View style={styles.left}>
        {showLogo ? <Text style={styles.logo}>HR</Text> : <Text style={styles.title}>{title}</Text>}
      </View>
      <View style={styles.right}>
        {onSearchPress && (
          <TouchableOpacity onPress={onSearchPress} style={styles.iconButton}>
            {/* Replace with actual icon when adding react-native-vector-icons */}
            <Text style={styles.iconText}>🔍</Text>
          </TouchableOpacity>
        )}
        {rightAction}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  left: { flex: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logo: {
    color: colors.secondary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  iconButton: { padding: spacing.xs },
  iconText: { fontSize: 20 },
});
