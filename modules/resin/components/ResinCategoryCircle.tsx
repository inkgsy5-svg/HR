import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@app/theme/colors';
import { typography } from '@app/theme/typography';
import { ResinCategory } from '../data/categories';

type Props = {
  category: ResinCategory;
  onPress: (category: ResinCategory) => void;
};

export default function ResinCategoryCircle({ category, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => onPress(category)}
    >
      <View style={[styles.ring, { borderColor: category.color }]}>
        <View style={[styles.circle, { backgroundColor: category.color + '22' }]}>
          <Text style={styles.icon}>{category.icon}</Text>
        </View>
      </View>
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 6, maxWidth: 90 },
  ring: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2.5,
    overflow: 'hidden',
  },
  circle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 30 },
  name: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    maxWidth: 90,
  },
});
