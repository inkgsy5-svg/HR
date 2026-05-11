import React, { useEffect, useState } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import { AppStackParamList } from '@app/navigation/types';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';

type Nav = StackNavigationProp<AppStackParamList, 'BookingConfirm'>;
type Route = RouteProp<AppStackParamList, 'BookingConfirm'>;

export default function BookingConfirmScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();

  const [scaleAnim] = useState(() => new Animated.Value(0));
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(40));

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 5,
      useNativeDriver: true,
    }).start();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: 300, useNativeDriver: true }),
    ]).start();
  }, [scaleAnim, fadeAnim, slideAnim]);

  const formatDay = (key: string) => {
    const d = new Date(key + 'T12:00:00');
    return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Animated.View style={[styles.iconWrap, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>✓</Text>
          </View>
          <Animated.View
            style={[styles.ring, styles.ring1, { transform: [{ scale: scaleAnim }] }]}
          />
          <Animated.View
            style={[styles.ring, styles.ring2, { transform: [{ scale: scaleAnim }] }]}
          />
        </Animated.View>

        <Animated.View
          style={[styles.textWrap, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <Text style={styles.title}>¡Cita confirmada!</Text>
          <Text style={styles.subtitle}>Te esperamos con {params.professionalName}</Text>
        </Animated.View>

        <Animated.View
          style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.cardRow}>
            <Text style={styles.cardIcon}>✂️</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardLabel}>Profesional</Text>
              <Text style={styles.cardValue}>{params.professionalName}</Text>
            </View>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.cardRow}>
            <Text style={styles.cardIcon}>📅</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardLabel}>Fecha</Text>
              <Text style={styles.cardValue}>{formatDay(params.day)}</Text>
            </View>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.cardRow}>
            <Text style={styles.cardIcon}>🕐</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardLabel}>Hora</Text>
              <Text style={styles.cardValue}>{params.slot}</Text>
            </View>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.cardRow}>
            <Text style={styles.cardIcon}>💰</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardLabel}>Total</Text>
              <Text style={[styles.cardValue, styles.cardValueAccent]}>${params.total}</Text>
            </View>
          </View>
          {params.services.length > 0 && (
            <>
              <View style={styles.cardDivider} />
              <View style={styles.servicesWrap}>
                {params.services.map((s, i) => (
                  <View key={i} style={styles.serviceTag}>
                    <Text style={styles.serviceTagText}>{s}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </Animated.View>

        <Animated.Text style={[styles.policy, { opacity: fadeAnim }]}>
          ℹ️ Cancela gratis hasta 2 horas antes de tu cita
        </Animated.Text>

        <Animated.View style={[styles.btnWrap, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.85}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.popToTop();
            }}
          >
            <Text style={styles.btnText}>¡Listo!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  iconWrap: { alignItems: 'center', justifyContent: 'center', width: 120, height: 120 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconText: { color: colors.black, fontSize: 40, fontWeight: typography.fontWeight.bold },
  ring: { position: 'absolute', borderRadius: 999, borderWidth: 2, borderColor: colors.accent },
  ring1: { width: 96, height: 96, opacity: 0.4 },
  ring2: { width: 116, height: 116, opacity: 0.2 },
  textWrap: { alignItems: 'center', gap: 8 },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.base,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1C1C1C',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: spacing.md,
    width: '100%',
    gap: 12,
  },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  cardIcon: { fontSize: 20, width: 30, textAlign: 'center' },
  cardInfo: { flex: 1 },
  cardLabel: { color: colors.textMuted, fontSize: typography.fontSize.xs },
  cardValue: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  cardValueAccent: { color: colors.accent },
  cardDivider: { height: 1, backgroundColor: '#2A2A2A' },
  servicesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  serviceTag: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  serviceTagText: { color: colors.textSecondary, fontSize: typography.fontSize.xs },
  policy: { color: colors.textMuted, fontSize: typography.fontSize.xs, textAlign: 'center' },
  btnWrap: { width: '100%' },
  btn: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  btnText: {
    color: colors.black,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
});
