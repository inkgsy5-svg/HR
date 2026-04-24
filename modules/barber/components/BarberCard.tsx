import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { Barber } from '../types';

interface Props {
  barber: Barber;
  onPress: (barber: Barber) => void;
}

export default function BarberCard({ barber, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => onPress(barber)}>
      <Image source={{ uri: barber.imageUrl }} style={styles.avatar} />

      <View style={styles.info}>
        <Text style={styles.name}>{barber.name}</Text>
        <Text style={styles.specialty}>{barber.specialty}</Text>
        <View style={styles.row}>
          <Text style={styles.rating}>⭐ {barber.rating}</Text>
          <Text style={styles.reviews}>({barber.reviewCount})</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.experience}>{barber.experience}</Text>
        </View>
      </View>

      <View style={[styles.badge, barber.available ? styles.badgeOn : styles.badgeOff]}>
        <Text
          style={[styles.badgeText, { color: barber.available ? colors.success : colors.error }]}
        >
          {barber.available ? 'Disponible' : 'Ocupado'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  specialty: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  rating: {
    color: colors.accent,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  reviews: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
  },
  dot: {
    color: colors.textMuted,
  },
  experience: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeOn: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  badgeOff: {
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
});
