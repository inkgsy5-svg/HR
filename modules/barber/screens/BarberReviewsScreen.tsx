import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BarberStackParamList } from '@app/navigation/types';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { BARBERS } from '../data/barbers';
import { Review } from '../data/reviews';
import { useReviewsStore } from '../store/reviewsStore';
import ReviewCard from '../components/ReviewCard';
import AddReviewModal from '../components/AddReviewModal';

type Nav = StackNavigationProp<BarberStackParamList, 'BarberReviews'>;
type Route = RouteProp<BarberStackParamList, 'BarberReviews'>;

function RatingSummary({ barberId }: { barberId: string }) {
  const { getByBarberId, getAvgRating } = useReviewsStore();
  const reviews = getByBarberId(barberId);
  const avg = getAvgRating(barberId);

  const countByStar = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct:
      reviews.length > 0
        ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100
        : 0,
  }));

  return (
    <View style={styles.summaryCard}>
      {/* Promedio grande */}
      <View style={styles.avgBlock}>
        <Text style={styles.avgNumber}>{avg || '—'}</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(i => (
            <Text
              key={i}
              style={{ fontSize: 16, color: i <= Math.round(avg) ? colors.accent : colors.border }}
            >
              ★
            </Text>
          ))}
        </View>
        <Text style={styles.totalReviews}>{reviews.length} reseñas</Text>
      </View>

      {/* Barras por estrella */}
      <View style={styles.barsBlock}>
        {countByStar.map(({ star, count, pct }) => (
          <View key={star} style={styles.barRow}>
            <Text style={styles.barLabel}>{star}★</Text>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${pct}%` }]} />
            </View>
            <Text style={styles.barCount}>{count}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function BarberReviewsScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const [showModal, setShowModal] = useState(false);

  const { getByBarberId, addReview } = useReviewsStore();
  const reviews = getByBarberId(params.barberId);
  const barber = BARBERS.find(b => b.id === params.barberId);

  const handleSubmit = (rating: number, comment: string) => {
    const newReview: Review = {
      id: `r${Date.now()}`,
      barberId: params.barberId,
      userName: 'Tú',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      avatarUrl: 'https://i.pravatar.cc/150?img=30',
    };
    addReview(newReview);
    setShowModal(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reseñas — {barber?.name}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Text style={styles.addBtnText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reviews}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ReviewCard review={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<RatingSummary barberId={params.barberId} />}
        ListEmptyComponent={<Text style={styles.empty}>Sé el primero en dejar una reseña ⭐</Text>}
      />

      <AddReviewModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backText: { color: colors.accent, fontSize: typography.fontSize.base, width: 60 },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    flex: 1,
    textAlign: 'center',
  },
  addBtn: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  addBtnText: {
    color: colors.accent,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },

  list: { padding: spacing.md, paddingBottom: 40 },
  empty: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.xl,
  },

  // Summary card
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
    alignItems: 'center',
  },
  avgBlock: { alignItems: 'center', minWidth: 80 },
  avgNumber: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
  },
  starsRow: { flexDirection: 'row', gap: 2, marginVertical: 4 },
  totalReviews: { color: colors.textMuted, fontSize: typography.fontSize.xs },

  barsBlock: { flex: 1, gap: 6 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  barLabel: { color: colors.textMuted, fontSize: typography.fontSize.xs, width: 20 },
  barBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 3 },
  barCount: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    width: 16,
    textAlign: 'right',
  },
});
