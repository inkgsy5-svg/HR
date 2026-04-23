import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BarberStackParamList } from '@app/navigation/types';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { BARBERS } from '../data/barbers';
import { SERVICES } from '../data/services';

type Nav = StackNavigationProp<BarberStackParamList, 'BarberBooking'>;
type Route = RouteProp<BarberStackParamList, 'BarberBooking'>;

// Genera los próximos 7 días
function getNextDays(count: number) {
  const days = [];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthNames = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      key: d.toISOString().split('T')[0],
      dayName: i === 0 ? 'Hoy' : dayNames[d.getDay()],
      dayNum: d.getDate(),
      month: monthNames[d.getMonth()],
    });
  }
  return days;
}

const MORNING_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
const AFTERNOON_SLOTS = [
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
];

// Simulamos algunos slots ocupados
const UNAVAILABLE = ['09:00', '10:30', '13:30', '15:00'];

export default function BarberBookingScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // const days = getNextDays(7);
  const days = getNextDays(daysUntilEndOfMonth());

  function daysUntilEndOfMonth() {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return lastDay.getDate() - today.getDate() + 1;
  }

  const barber = BARBERS.find(b => b.id === params.barberId);
  const services = SERVICES.filter(s => params.serviceIds.includes(s.id));
  const totalPrice = services.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);

  const handleConfirm = () => {
    if (!selectedDay || !selectedSlot) {
      Alert.alert('Completa tu reserva', 'Selecciona un día y un horario.');
      return;
    }
    Alert.alert(
      '¡Cita confirmada! 🎉',
      `Barbero: ${barber?.name}\nFecha: ${selectedDay}\nHora: ${selectedSlot}\nTotal: $${totalPrice}`,
      [{ text: 'Aceptar', onPress: () => navigation.navigate('BarberHome') }],
    );
  };

  const renderSlot = (slot: string) => {
    const unavailable = UNAVAILABLE.includes(slot);
    const selected = selectedSlot === slot;
    return (
      <TouchableOpacity
        key={slot}
        style={[
          styles.slot,
          selected && styles.slotSelected,
          unavailable && styles.slotUnavailable,
        ]}
        disabled={unavailable}
        activeOpacity={0.75}
        onPress={() => setSelectedSlot(slot)}
      >
        <Text
          style={[
            styles.slotText,
            selected && styles.slotTextSelected,
            unavailable && styles.slotTextUnavailable,
          ]}
        >
          {slot}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reservar cita</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Resumen de la cita */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RESUMEN</Text>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Barbero</Text>
              <Text style={styles.cardValue}>{barber?.name}</Text>
            </View>
            {services.map(s => (
              <View key={s.id} style={styles.cardRow}>
                <Text style={styles.cardLabel}>
                  {s.icon} {s.name}
                </Text>
                <Text style={styles.cardValue}>${s.price}</Text>
              </View>
            ))}
            <View style={styles.cardDivider} />
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>⏱ Duración total</Text>
              <Text style={styles.cardValue}>{totalDuration} min</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${totalPrice}</Text>
            </View>
          </View>
        </View>

        {/* Selector de día */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SELECCIONA EL DÍA</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysRow}
          >
            {days.map(day => (
              <TouchableOpacity
                key={day.key}
                style={[styles.dayChip, selectedDay === day.key && styles.dayChipSelected]}
                activeOpacity={0.75}
                onPress={() => {
                  setSelectedDay(day.key);
                  setSelectedSlot(null);
                }}
              >
                <Text style={[styles.dayName, selectedDay === day.key && styles.dayNameSelected]}>
                  {day.dayName}
                </Text>
                <Text style={[styles.dayNum, selectedDay === day.key && styles.dayNumSelected]}>
                  {day.dayNum}
                </Text>
                <Text style={[styles.dayMonth, selectedDay === day.key && styles.dayMonthSelected]}>
                  {day.month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Selector de hora */}
        {selectedDay && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SELECCIONA LA HORA</Text>

            <Text style={styles.turnLabel}>Mañana</Text>
            <View style={styles.slotsGrid}>{MORNING_SLOTS.map(renderSlot)}</View>

            <Text style={styles.turnLabel}>Tarde</Text>
            <View style={styles.slotsGrid}>{AFTERNOON_SLOTS.map(renderSlot)}</View>

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.card }]} />
                <Text style={styles.legendText}>Disponible</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
                <Text style={styles.legendText}>Seleccionado</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.border }]} />
                <Text style={styles.legendText}>Ocupado</Text>
              </View>
            </View>
          </View>
        )}

        {/* Botón confirmar */}
        <TouchableOpacity
          style={[styles.confirmBtn, (!selectedDay || !selectedSlot) && styles.confirmBtnDisabled]}
          activeOpacity={0.85}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmBtnText}>
            {selectedDay && selectedSlot
              ? `Confirmar — ${selectedSlot} · $${totalPrice}`
              : 'Selecciona día y hora'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },

  scroll: { padding: spacing.md, paddingBottom: 60 },

  section: { marginBottom: spacing.lg },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },

  // Resumen
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 10,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { color: colors.textSecondary, fontSize: typography.fontSize.sm },
  cardValue: { color: colors.textPrimary, fontSize: typography.fontSize.sm },
  cardDivider: { height: 1, backgroundColor: colors.border },
  totalLabel: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  totalValue: {
    color: colors.accent,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },

  // Días
  daysRow: { gap: spacing.sm, paddingVertical: 4 },
  dayChip: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 62,
  },
  dayChipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dayName: { color: colors.textMuted, fontSize: typography.fontSize.xs },
  dayNameSelected: { color: colors.black },
  dayNum: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  dayNumSelected: { color: colors.black },
  dayMonth: { color: colors.textMuted, fontSize: typography.fontSize.xs },
  dayMonthSelected: { color: colors.black },

  // Slots
  turnLabel: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  slot: {
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  slotSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  slotUnavailable: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
    opacity: 0.35,
  },
  slotText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  slotTextSelected: { color: colors.black },
  slotTextUnavailable: { color: colors.textMuted },

  // Leyenda
  legend: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: colors.textMuted, fontSize: typography.fontSize.xs },

  // Botón confirmar
  confirmBtn: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  confirmBtnDisabled: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confirmBtnText: {
    color: colors.black,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
});
