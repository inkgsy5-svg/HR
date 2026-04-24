import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BarberStackParamList } from '@app/navigation/types';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { BARBERS } from '../data/barbers';
import { SERVICES, BarberService } from '../data/services';
import { useReviewsStore } from '../store/reviewsStore';
import ServiceCard from '../components/ServiceCard';

type Nav = StackNavigationProp<BarberStackParamList, 'BarberDetail'>;
type Route = RouteProp<BarberStackParamList, 'BarberDetail'>;

export default function BarberDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const [selectedServices, setSelectedServices] = useState<BarberService[]>([]);

  const { getByBarberId, getAvgRating } = useReviewsStore();

  const barber = BARBERS.find(b => b.id === params.id);
  if (!barber) return null;

  const barberReviews = getByBarberId(params.id);
  const avgRating = getAvgRating(params.id) || barber.rating;
  const totalReviews = barberReviews.length || barber.reviewCount;

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  const handleServicePress = (service: BarberService) => {
    setSelectedServices(prev =>
      prev.find(s => s.id === service.id)
        ? prev.filter(s => s.id !== service.id)
        : [...prev, service],
    );
  };

  const handleBooking = () => {
    if (selectedServices.length === 0) {
      Alert.alert('Selecciona un servicio', 'Elige al menos un servicio para reservar.');
      return;
    }
    navigation.navigate('BarberBooking', {
      barberId: barber.id,
      serviceIds: selectedServices.map(s => s.id),
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Atrás</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={SERVICES}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ServiceCard
            service={item}
            selected={!!selectedServices.find(s => s.id === item.id)}
            onPress={handleServicePress}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.profile}>
              <Image source={{ uri: barber.imageUrl }} style={styles.avatar} />
              <Text style={styles.name}>{barber.name}</Text>
              <Text style={styles.specialty}>{barber.specialty}</Text>

              {/* Stats clickeables → navegan a reseñas */}
              <TouchableOpacity
                style={styles.statsRow}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('BarberReviews', { barberId: barber.id })}
              >
                <View style={styles.stat}>
                  <Text style={styles.statValue}>⭐ {avgRating}</Text>
                  <Text style={styles.statLabel}>Calificación</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{totalReviews}</Text>
                  <Text style={styles.statLabel}>Reseñas ›</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{barber.experience}</Text>
                  <Text style={styles.statLabel}>Experiencia</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>SERVICIOS</Text>
          </>
        }
        ListFooterComponent={
          <>
            {selectedServices.length > 0 && (
              <View style={styles.summary}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {selectedServices.length} servicio{selectedServices.length > 1 ? 's' : ''}{' '}
                    seleccionado{selectedServices.length > 1 ? 's' : ''}
                  </Text>
                  <Text style={styles.summaryDuration}>⏱ {totalDuration} min</Text>
                </View>
                {selectedServices.map(s => (
                  <View key={s.id} style={styles.summaryItem}>
                    <Text style={styles.summaryItemName}>
                      {s.icon} {s.name}
                    </Text>
                    <Text style={styles.summaryItemPrice}>${s.price}</Text>
                  </View>
                ))}
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryTotal}>Total</Text>
                  <Text style={styles.summaryTotalPrice}>${totalPrice}</Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[styles.bookBtn, selectedServices.length === 0 && styles.bookBtnDisabled]}
              activeOpacity={0.85}
              onPress={handleBooking}
            >
              <Text style={styles.bookBtnText}>
                {selectedServices.length > 0
                  ? `Reservar cita — $${totalPrice}`
                  : 'Selecciona un servicio'}
              </Text>
            </TouchableOpacity>
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  backBtn: { alignSelf: 'flex-start' },
  backText: { color: colors.accent, fontSize: typography.fontSize.base },
  list: { padding: spacing.md, paddingBottom: 40 },

  profile: { alignItems: 'center', marginBottom: spacing.lg },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.accent,
    marginBottom: spacing.sm,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  specialty: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    width: '100%',
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  statDivider: { width: 1, backgroundColor: colors.border },

  sectionTitle: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },

  summary: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: { color: colors.textSecondary, fontSize: typography.fontSize.sm },
  summaryDuration: { color: colors.textMuted, fontSize: typography.fontSize.sm },
  summaryItem: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryItemName: { color: colors.textPrimary, fontSize: typography.fontSize.sm },
  summaryItemPrice: { color: colors.textSecondary, fontSize: typography.fontSize.sm },
  summaryDivider: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
  summaryTotal: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  summaryTotalPrice: {
    color: colors.accent,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },

  bookBtn: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  bookBtnDisabled: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bookBtnText: {
    color: colors.black,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
});
