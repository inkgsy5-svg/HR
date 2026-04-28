import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BarberStackParamList } from '@app/navigation/types';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { BARBERS } from '../data/barbers';
import { SERVICES, BarberService } from '../data/services';

type Nav = StackNavigationProp<BarberStackParamList, 'BarberBooking'>;
type Route = RouteProp<BarberStackParamList, 'BarberBooking'>;

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
const UNAVAILABLE = ['09:00', '10:30', '13:30', '15:00'];

function getDaysUntilEndOfMonth() {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return lastDay.getDate() - today.getDate() + 1;
}

function getNextDays(count: number) {
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
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      key: d.toISOString().split('T')[0],
      dayName: i === 0 ? 'Hoy' : dayNames[d.getDay()],
      dayNum: d.getDate(),
      month: monthNames[d.getMonth()],
    };
  });
}

export default function BarberBookingScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const insets = useSafeAreaInsets();

  const [selectedServices, setSelectedServices] = useState<BarberService[]>(() =>
    SERVICES.filter(s => params.serviceIds?.includes(s.id)),
  );
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const slotsY = useRef(0);
  const summaryY = useRef(0);

  const barber = BARBERS.find(b => b.id === params.barberId);
  const days = getNextDays(getDaysUntilEndOfMonth());
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  const handleToggleService = (service: BarberService) => {
    setSelectedServices(prev =>
      prev.find(s => s.id === service.id)
        ? prev.filter(s => s.id !== service.id)
        : [...prev, service],
    );
  };

  const handleConfirm = () => {
    if (selectedServices.length === 0) {
      Alert.alert('Selecciona un servicio', 'Elige al menos un servicio para continuar.');
      return;
    }
    if (!selectedDay || !selectedSlot) {
      Alert.alert('Selecciona fecha y hora', 'Elige un día y horario para tu cita.');
      return;
    }
    navigation.push('BarberConfirm', {
      barberName: barber?.name ?? '',
      day: selectedDay,
      slot: selectedSlot,
      total: totalPrice,
      services: selectedServices.map(s => `${s.icon} ${s.name}`),
    });
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
        onPress={() => {
          setSelectedSlot(slot);
          setTimeout(() => {
            scrollRef.current?.scrollTo({ y: summaryY.current - 20, animated: true });
          }, 100);
        }}
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
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <View>
          <Image
            source={barber?.heroImage ?? barber?.image}
            style={styles.hero}
            resizeMode="cover"
          />
          <SafeAreaView edges={['top']} style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <View style={styles.heroNav}>
              <TouchableOpacity style={styles.heroNavBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.heroNavText}>←</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{barber?.name}</Text>
            <Text style={styles.heroSpecialty}>{barber?.specialty}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* ── Sección 1: Servicios ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Elige tu servicio</Text>
            <Text style={styles.sectionSubtitle}>Puedes seleccionar más de uno</Text>
            {SERVICES.map(service => {
              const isSelected = !!selectedServices.find(s => s.id === service.id);
              return (
                <TouchableOpacity
                  key={service.id}
                  style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
                  activeOpacity={0.8}
                  onPress={() => handleToggleService(service)}
                >
                  <Text style={styles.serviceIcon}>{service.icon}</Text>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceDesc}>{service.description}</Text>
                    <Text style={styles.serviceDuration}>⏱ {service.duration} min</Text>
                  </View>
                  <View style={styles.servicePriceWrap}>
                    <Text style={styles.servicePrice}>${service.price}</Text>
                    {isSelected && (
                      <View style={styles.serviceCheck}>
                        <Text style={styles.serviceCheckText}>✓</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}

            {selectedServices.length > 0 && (
              <View style={styles.subtotalRow}>
                <Text style={styles.subtotalLabel}>
                  {selectedServices.length} servicio{selectedServices.length > 1 ? 's' : ''} ·{' '}
                  {totalDuration} min
                </Text>
                <Text style={styles.subtotalAmount}>${totalPrice}</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {/* ── Sección 2: Fecha ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Elige el día</Text>
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
                    setTimeout(() => {
                      scrollRef.current?.scrollTo({ y: slotsY.current - 20, animated: true });
                    }, 100);
                  }}
                >
                  <Text style={[styles.dayName, selectedDay === day.key && styles.dayNameSelected]}>
                    {day.dayName}
                  </Text>
                  <Text style={[styles.dayNum, selectedDay === day.key && styles.dayNumSelected]}>
                    {day.dayNum}
                  </Text>
                  <Text
                    style={[styles.dayMonth, selectedDay === day.key && styles.dayMonthSelected]}
                  >
                    {day.month}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ── Sección 3: Hora ── */}
          {selectedDay && (
            <>
              <View style={styles.divider} />
              <View
                style={styles.section}
                onLayout={e => {
                  slotsY.current = e.nativeEvent.layout.y;
                }}
              >
                <Text style={styles.sectionTitle}>Elige la hora</Text>
                <Text style={styles.turnLabel}>☀️ Mañana</Text>
                <View style={styles.slotsGrid}>{MORNING_SLOTS.map(renderSlot)}</View>
                <Text style={styles.turnLabel}>🌤 Tarde</Text>
                <View style={styles.slotsGrid}>{AFTERNOON_SLOTS.map(renderSlot)}</View>
                <View style={styles.legend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#1C1C1C' }]} />
                    <Text style={styles.legendText}>Disponible</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
                    <Text style={styles.legendText}>Seleccionado</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: '#1C1C1C', opacity: 0.35 }]}
                    />
                    <Text style={styles.legendText}>Ocupado</Text>
                  </View>
                </View>
              </View>
            </>
          )}

          {/* ── Sección 4: Resumen ── */}
          {selectedDay && selectedSlot && selectedServices.length > 0 && (
            <>
              <View style={styles.divider} />
              <View
                style={styles.section}
                onLayout={e => {
                  summaryY.current = e.nativeEvent.layout.y;
                }}
              >
                <Text style={styles.sectionTitle}>Resumen</Text>
                <View style={styles.summaryCard}>
                  <View style={styles.summaryBarberRow}>
                    <Image
                      source={barber?.image}
                      style={styles.summaryBarberAvatar}
                      resizeMode="cover"
                    />
                    <View>
                      <Text style={styles.summaryBarberName}>{barber?.name}</Text>
                      <Text style={styles.summaryBarberSpecialty}>{barber?.specialty}</Text>
                    </View>
                  </View>

                  <View style={styles.summaryDivider} />

                  {selectedServices.map(s => (
                    <View key={s.id} style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>
                        {s.icon} {s.name}
                      </Text>
                      <Text style={styles.summaryValue}>${s.price}</Text>
                    </View>
                  ))}

                  <View style={styles.summaryDivider} />

                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>📅 Fecha</Text>
                    <Text style={styles.summaryValue}>{selectedDay}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>🕐 Hora</Text>
                    <Text style={styles.summaryValue}>{selectedSlot}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>⏱ Duración</Text>
                    <Text style={styles.summaryValue}>{totalDuration} min</Text>
                  </View>

                  <View style={styles.summaryDivider} />

                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryTotalLabel}>Total</Text>
                    <Text style={styles.summaryTotalValue}>${totalPrice}</Text>
                  </View>
                  <View style={styles.cancelPolicy}>
                    <Text style={styles.cancelPolicyText}>
                      ℹ️ Cancela gratis hasta 2 horas antes de tu cita
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* CTA fijo */}
      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <TouchableOpacity
          style={[
            styles.ctaBtn,
            (selectedServices.length === 0 || !selectedDay || !selectedSlot) &&
              styles.ctaBtnDisabled,
          ]}
          activeOpacity={0.85}
          onPress={handleConfirm}
        >
          <Text style={styles.ctaBtnText}>
            {selectedServices.length === 0
              ? 'Selecciona un servicio'
              : !selectedDay || !selectedSlot
                ? 'Selecciona día y hora'
                : `CONFIRMAR CITA — $${totalPrice}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  hero: { width: '100%', height: 220 },
  heroNav: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  heroNavBtn: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  heroNavText: { color: colors.white, fontSize: 20 },
  heroInfo: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
  },
  heroName: {
    color: colors.accent,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
  },
  heroSpecialty: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },

  content: { padding: spacing.md },
  section: { marginBottom: spacing.md },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },

  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  serviceCardSelected: { borderColor: colors.accent },
  serviceIcon: { fontSize: 28, width: 40, textAlign: 'center' },
  serviceInfo: { flex: 1, gap: 3 },
  serviceName: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  serviceDesc: { color: colors.textSecondary, fontSize: typography.fontSize.sm },
  serviceDuration: { color: colors.textMuted, fontSize: typography.fontSize.xs, marginTop: 2 },
  servicePriceWrap: { alignItems: 'flex-end', gap: 6 },
  servicePrice: {
    color: colors.accent,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  serviceCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceCheckText: {
    color: colors.black,
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
  },

  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  subtotalLabel: { color: colors.textSecondary, fontSize: typography.fontSize.sm },
  subtotalAmount: {
    color: colors.accent,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },

  daysRow: { gap: spacing.sm, paddingVertical: 4 },
  dayChip: {
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 62,
  },
  dayChipSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
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

  turnLabel: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slot: {
    backgroundColor: '#1C1C1C',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  slotSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  slotUnavailable: { opacity: 0.35 },
  slotText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  slotTextSelected: { color: colors.black },
  slotTextUnavailable: { color: colors.textMuted },

  legend: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: colors.textMuted, fontSize: typography.fontSize.xs },

  summaryCard: {
    backgroundColor: '#1C1C1C',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: spacing.md,
    gap: 10,
  },
  summaryBarberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryBarberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  summaryBarberName: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  summaryBarberSpecialty: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { color: colors.textSecondary, fontSize: typography.fontSize.sm },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  summaryDivider: { height: 1, backgroundColor: '#2A2A2A' },
  summaryTotalLabel: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  summaryTotalValue: {
    color: colors.accent,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  cancelPolicy: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.xs,
  },
  cancelPolicyText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
  },

  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ctaBtn: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  ctaBtnDisabled: {
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  ctaBtnText: {
    color: colors.black,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
});
