import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { AppStackParamList } from '@app/navigation/types';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';

type HomeNavProp = StackNavigationProp<AppStackParamList>;

const { width } = Dimensions.get('window');

const MODULES = [
  {
    id: 'tattoo',
    label: 'Tatuajes',
    screen: 'Tattoo' as const,
    gradient: ['#1a0a2e', '#4a1060'] as const,
    accent: '#8B2FC9',
  },
  {
    id: 'barber',
    label: 'Barber',
    screen: 'Barber' as const,
    gradient: ['#0a1628', '#1a3a5c'] as const,
    accent: '#2E86AB',
  },
  {
    id: 'smoke-shop',
    label: 'Smoke Shop',
    screen: 'SmokeShop' as const,
    gradient: ['#0f1a0a', '#1e3a14'] as const,
    accent: '#4CAF50',
  },
  {
    id: 'music',
    label: 'Música',
    screen: 'Music' as const,
    gradient: ['#1a0a0a', '#3a1010'] as const,
    accent: '#E94560',
  },
  {
    id: 'piercing',
    label: 'Perforaciones',
    screen: 'Piercing' as const,
    gradient: ['#1a1400', '#3a3000'] as const,
    accent: '#F5A623',
  },
  {
    id: 'resin',
    label: 'Resina',
    screen: 'Resin' as const,
    gradient: ['#001a1a', '#003a3a'] as const,
    accent: '#00BCD4',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>HR</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Promo Banner */}
        <LinearGradient
          colors={['#1a1200', '#3a2800', '#1a1200']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.promoBanner}
        >
          <View style={styles.promoContent}>
            <Text style={styles.promoEmoji}>⚡</Text>
            <Text style={styles.promoTitle}>¡Promociones del día!</Text>
            <Text style={styles.promoEmoji}>⚡</Text>
          </View>
          <TouchableOpacity style={styles.promoButton}>
            <Text style={styles.promoButtonText}>VER OFERTAS</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Module Cards */}
        <View style={styles.moduleList}>
          {MODULES.map(item => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(item.screen as keyof AppStackParamList)}
            >
              <LinearGradient
                colors={[colors.card, item.gradient[0], item.gradient[1]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.moduleCard}
              >
                <Text style={styles.moduleLabel}>{item.label}</Text>
                <View style={[styles.moduleAccent, { backgroundColor: item.accent + '33' }]}>
                  <View style={[styles.accentDot, { backgroundColor: item.accent }]} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: typography.fontWeight.bold,
    fontStyle: 'italic',
    letterSpacing: 2,
  },
  searchBtn: { padding: spacing.xs },
  searchIcon: { fontSize: 22 },
  scroll: { flex: 1 },
  promoBanner: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F5A62366',
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  promoEmoji: { fontSize: 20 },
  promoTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  promoButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  promoButtonText: {
    color: colors.black,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
    letterSpacing: 1,
  },
  moduleList: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 100,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  moduleLabel: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  moduleAccent: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentDot: {
    width: 30,
    height: 30,
    borderRadius: borderRadius.full,
    opacity: 0.8,
  },
});
