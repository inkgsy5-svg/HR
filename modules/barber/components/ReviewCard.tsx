import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { Review } from '../data/reviews';

function Stars({ rating }: { rating: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map(i => (
        <Text key={i} style={{ fontSize: 12, color: i <= rating ? colors.accent : colors.border }}>
          ★
        </Text>
      ))}
    </View>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Image source={{ uri: review.avatarUrl }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.userName}>{review.userName}</Text>
          <Stars rating={review.rating} />
        </View>
        <Text style={styles.date}>{formatDate(review.date)}</Text>
      </View>
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: 10,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface },
  info: { flex: 1, gap: 3 },
  userName: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  stars: { flexDirection: 'row', gap: 2 },
  date: { color: colors.textMuted, fontSize: typography.fontSize.xs },
  comment: { color: colors.textSecondary, fontSize: typography.fontSize.sm, lineHeight: 20 },
});
