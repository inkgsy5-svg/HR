import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
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

const { width } = Dimensions.get('window');

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

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

// ── Calendario visual ──────────────────────────────────────
function CalendarPicker({
  selectedDay,
  onSelectDay,
}: {
  selectedDay: string | null;
  onSelectDay: (key: string) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else setViewMonth(m => m + 1);
  };

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const toKey = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${viewYear}-${m}-${d}`;
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <View style={cal.container}>
      {/* Header mes */}
      <View style={cal.header}>
        <TouchableOpacity onPress={prevMonth} style={cal.navBtn}>
          <Text style={cal.navText}>‹</Text>
        </TouchableOpacity>
        <Text style={cal.monthTitle}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </Text>
        <TouchableOpacity onPress={nextMonth} style={cal.navBtn}>
          <Text style={cal.navText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Días de la semana */}
      <View style={cal.weekRow}>
        {DAY_NAMES.map(d => (
          <Text key={d} style={cal.weekDay}>
            {d}
          </Text>
        ))}
      </View>

      {/* Días del mes */}
      <View style={cal.grid}>
        {cells.map((day, i) => {
          if (!day) return <View key={`e-${i}`} style={cal.cell} />;
          const key = toKey(day);
          const past = isPast(day);
          const selected = selectedDay === key;
          return (
            <TouchableOpacity
              key={key}
              style={[cal.cell, selected && cal.cellSelected, past && cal.cellPast]}
              onPress={() => !past && onSelectDay(key)}
              disabled={past}
              activeOpacity={0.7}
            >
              <Text
                style={[cal.cellText, selected && cal.cellTextSelected, past && cal.cellTextPast]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const CELL_SIZE = (width - spacing.lg * 2 - 32) / 7;

const cal = StyleSheet.create({
  container: { paddingHorizontal: spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: { color: colors.accent, fontSize: 22, fontWeight: '600' },
  monthTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellSelected: {
    backgroundColor: colors.accent,
    borderRadius: 999,
  },
  cellPast: { opacity: 0.25 },
  cellText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
  },
  cellTextSelected: { color: colors.black, fontWeight: typography.fontWeight.bold },
  cellTextPast: { color: colors.textMuted },
});

// ── Modal base ─────────────────────────────────────────────
function BottomModal({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modal.overlay}>
        <TouchableOpacity style={modal.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={modal.sheet}>
          <View style={modal.handle} />
          <View style={modal.headerRow}>
            <Text style={modal.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={modal.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const modal = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: '#181818',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#2A2A2A',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  closeBtn: {
    color: colors.textMuted,
    fontSize: typography.fontSize.lg,
    padding: 4,
  },
});

// ── Pantalla principal ─────────────────────────────────────
export default function BarberBookingScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const insets = useSafeAreaInsets();

  const [selectedServices, setSelectedServices] = useState<BarberService[]>(() =>
    SERVICES.filter(s => params.serviceIds?.includes(s.id)),
  );
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [showServices, setShowServices] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const barber = BARBERS.find(b => b.id === params.barberId);
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  const handleToggleService = (service: BarberService) => {
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

  // Label para botones
  const serviceLabel =
    selectedServices.length > 0
      ? `${selectedServices.length} servicio${selectedServices.length > 1 ? 's' : ''} · $${totalPrice}`
      : 'Elige tu servicio';

  const dateLabel = selectedDay ? formatDay(selectedDay) : 'Elige el día';
  const timeLabel = selectedSlot ? selectedSlot : 'Elige la hora';

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
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
          {/* Botones de selección */}
          <Text style={styles.sectionTitle}>Elige el servicio y la Fecha</Text>
          <Text style={styles.sectionSubtitle}>Puedes seleccionar más de uno</Text>

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

          <TouchableOpacity
            style={[styles.selectorBtn, (selectedDay || selectedSlot) && styles.selectorBtnActive]}
            onPress={() => setShowDate(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.selectorIcon}>📅</Text>
            <Text style={[styles.selectorLabel, selectedDay && styles.selectorLabelActive]}>
              {dateLabel}
            </Text>
            <Text style={styles.selectorArrow}>›</Text>
          </TouchableOpacity>

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
                {selectedServices.length > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>⏱ Duración</Text>
                    <Text style={styles.summaryValue}>{totalDuration} min</Text>
                  </View>
                )}

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

      {/* ── Modal 1: Servicios ── */}
      <BottomModal
        visible={showServices}
        title="Elige tu servicio"
        onClose={() => setShowServices(false)}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.lg }}
        >
          <Text style={styles.modalSubtitle}>Puedes seleccionar más de uno</Text>
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
            <TouchableOpacity style={styles.modalDoneBtn} onPress={() => setShowServices(false)}>
              <Text style={styles.modalDoneBtnText}>
                Listo · {selectedServices.length} servicio{selectedServices.length > 1 ? 's' : ''} ·
                ${totalPrice}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </BottomModal>

      {/* ── Modal 2: Fecha ── */}
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

      {/* ── Modal 3: Hora ── */}
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

  // Botones selectores
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
  selectorLabel: {
    flex: 1,
    color: colors.textMuted,
    fontSize: typography.fontSize.base,
  },
  selectorLabelActive: { color: colors.textPrimary, fontWeight: typography.fontWeight.semibold },
  selectorArrow: { color: colors.accent, fontSize: 22 },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  resumeTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },

  // Resumen
  summaryCard: {
    backgroundColor: '#1C1C1C',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: spacing.md,
    gap: 10,
  },
  summaryBarberRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
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
  summaryBarberSpecialty: { color: colors.textMuted, fontSize: typography.fontSize.xs },
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

  // Modal contenido
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

  // Servicios
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

  // Slots
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

  // Leyenda
  legend: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: colors.textMuted, fontSize: typography.fontSize.xs },

  // CTA
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
