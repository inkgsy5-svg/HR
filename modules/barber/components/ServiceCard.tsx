import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { BarberService } from '../data/services';

interface Props {
  service: BarberService;
  selected: boolean;
  onPress: (service: BarberService) => void;
}

export default function ServiceCard({ service, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      activeOpacity={0.8}
      onPress={() => onPress(service)}
    >
      <Text style={styles.icon}>{service.icon}</Text>
      <View style={styles.info}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.description}>{service.description}</Text>
        <Text style={styles.duration}>⏱ {service.duration} min</Text>
      </View>
      <View style={styles.priceWrap}>
        <Text style={styles.price}>${service.price}</Text>
        {selected && <Text style={styles.check}>✓</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  cardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },
  icon: {
    fontSize: 28,
    width: 40,
    textAlign: 'center',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
  duration: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  priceWrap: {
    alignItems: 'flex-end',
    gap: 4,
  },
  price: {
    color: colors.accent,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  check: {
    color: colors.accent,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
