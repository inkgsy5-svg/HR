import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@app/navigation/types';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { BookingService } from './booking.types';
import BottomModal from './components/BottomModal';
import CalendarPicker from './components/CalendarPicker';

type Nav = StackNavigationProp<AppStackParamList, 'Booking'>;
type Route = RouteProp<AppStackParamList, 'Booking'>;

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

export default function BookingScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const insets = useSafeAreaInsets();

  const { professional, services } = params;

  const [selectedServices, setSelectedServices] = useState<BookingService[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [showServices, setShowServices] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  const handleToggleService = (service: BookingService) => {
    setSelectedServices(prev =>
      prev.find(s => s.id === service.id)
        ? prev.filter(s => s.id !== service.id)
        : [...prev, service],
    );
  };

  const formatDay = (key: string) => {
    const d = new Date(key + 'T12:00:00');
    return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
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
    navigation.push('BookingConfirm', {
      professionalName: professional.name,
      module: params.module,
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
          setShowTime(false);
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

  const serviceLabel =
    selectedServices.length > 0
      ? `${selectedServices.length} servicio${selectedServices.length > 1 ? 's' : ''} · $${totalPrice}`
      : 'Elige tu servicio';
  const dateLabel = selectedDay ? formatDay(selectedDay) : 'Elige el día';
  const timeLabel = selectedSlot ?? 'Elige la hora';

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Hero */}
        <View>
          <Image
            source={professional.heroImage ?? professional.image}
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
            <Text style={styles.heroName}>{professional.name}</Text>
            <Text style={styles.heroSpecialty}>{professional.specialty}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Elige el servicio y la Fecha</Text>
          <Text style={styles.sectionSubtitle}>Puedes seleccionar más de uno</Text>

          {/* Botón servicios */}
          <TouchableOpacity
            style={[styles.selectorBtn, selectedServices.length > 0 && styles.selectorBtnActive]}
            onPress={() => setShowServices(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.selectorIcon}>✂️</Text>
            <Text
              style={[
                styles.selectorLabel,
                selectedServices.length > 0 && styles.selectorLabelActive,
              ]}
            >
              {serviceLabel}
            </Text>
            <Text style={styles.selectorArrow}>›</Text>
          </TouchableOpacity>

          {/* Botón fecha */}
          <TouchableOpacity
            style={[styles.selectorBtn, selectedDay && styles.selectorBtnActive]}
            onPress={() => setShowDate(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.selectorIcon}>📅</Text>
            <Text style={[styles.selectorLabel, selectedDay && styles.selectorLabelActive]}>
              {dateLabel}
            </Text>
            <Text style={styles.selectorArrow}>›</Text>
          </TouchableOpacity>

          {/* Botón hora — aparece al seleccionar día */}
          {selectedDay && (
            <TouchableOpacity
              style={[styles.selectorBtn, selectedSlot && styles.selectorBtnActive]}
              onPress={() => setShowTime(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.selectorIcon}>🕐</Text>
              <Text style={[styles.selectorLabel, selectedSlot && styles.selectorLabelActive]}>
                {timeLabel}
              </Text>
              <Text style={styles.selectorArrow}>›</Text>
            </TouchableOpacity>
          )}

          {/* Resumen */}
          {selectedServices.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.resumeTitle}>Resumen</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryBarberRow}>
                  <Image
                    source={professional.image}
                    style={styles.summaryAvatar}
                    resizeMode="cover"
                  />
                  <View>
                    <Text style={styles.summaryName}>{professional.name}</Text>
                    <Text style={styles.summarySpecialty}>{professional.specialty}</Text>
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

                {selectedDay && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>📅 Fecha</Text>
                    <Text style={styles.summaryValue}>{selectedDay}</Text>
                  </View>
                )}
                {selectedSlot && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>🕐 Hora</Text>
                    <Text style={styles.summaryValue}>{selectedSlot}</Text>
                  </View>
                )}
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
            </>
          )}
        </View>
      </ScrollView>

      {/* CTA */}
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

      {/* Modal Servicios */}
      <BottomModal
        visible={showServices}
        title="Elige tu servicio"
        onClose={() => setShowServices(false)}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.lg }}
        >
          <Text style={styles.modalSubtitle}>Puedes seleccionar más de uno</Text>
          {services.map(service => {
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
            <TouchableOpacity style={styles.modalDoneBtn} onPress={() => setShowServices(false)}>
              <Text style={styles.modalDoneBtnText}>
                Listo · {selectedServices.length} servicio{selectedServices.length > 1 ? 's' : ''} ·
                ${totalPrice}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </BottomModal>

      {/* Modal Fecha */}
      <BottomModal visible={showDate} title="Elige el día" onClose={() => setShowDate(false)}>
        <CalendarPicker
          selectedDay={selectedDay}
          onSelectDay={day => {
            setSelectedDay(day);
            setSelectedSlot(null);
            setShowDate(false);
            setTimeout(() => setShowTime(true), 300);
          }}
        />
      </BottomModal>

      {/* Modal Hora */}
      <BottomModal visible={showTime} title="Elige la hora" onClose={() => setShowTime(false)}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.lg }}
        >
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
              <View style={[styles.legendDot, { backgroundColor: '#1C1C1C', opacity: 0.35 }]} />
              <Text style={styles.legendText}>Ocupado</Text>
            </View>
          </View>
        </ScrollView>
      </BottomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  hero: { width: '100%', height: 220 },
  heroNav: { flexDirection: 'row', paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  heroNavBtn: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  heroNavText: { color: colors.white, fontSize: 20 },
  heroInfo: { position: 'absolute', bottom: spacing.md, left: spacing.md },
  heroName: {
    color: colors.accent,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
  },
  heroSpecialty: { color: colors.textSecondary, fontSize: typography.fontSize.sm },

  content: { padding: spacing.md },
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

  selectorBtn: {
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
  selectorBtnActive: { borderColor: colors.accent },
  selectorIcon: { fontSize: 24, width: 32, textAlign: 'center' },
  selectorLabel: { flex: 1, color: colors.textMuted, fontSize: typography.fontSize.base },
  selectorLabelActive: { color: colors.textPrimary, fontWeight: typography.fontWeight.semibold },
  selectorArrow: { color: colors.accent, fontSize: 22 },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  resumeTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },

  summaryCard: {
    backgroundColor: '#1C1C1C',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: spacing.md,
    gap: 10,
  },
  summaryBarberRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  summaryAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  summaryName: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  summarySpecialty: { color: colors.textMuted, fontSize: typography.fontSize.xs },
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

  modalSubtitle: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.md,
  },
  modalDoneBtn: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  modalDoneBtnText: {
    color: colors.black,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
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
  serviceCheckText: { color: colors.black, fontSize: 12, fontWeight: typography.fontWeight.bold },

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
