import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
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
        {showLogo ? (
          <Image
            source={require('../../../assets/images/hr-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
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
  logoImage: {
    width: 60,
    height: 40,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  iconButton: { padding: spacing.xs },
  iconText: { fontSize: 20 },
});
