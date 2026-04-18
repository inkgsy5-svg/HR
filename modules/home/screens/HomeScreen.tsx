import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
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
    label: 'Cuadros de Resina',
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
        <Image
          source={require('../../../assets/images/logo-header.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.searchBtn}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Promo Banner */}
        <ImageBackground
          source={require('../../../assets/images/promo-bg.webp')}
          style={styles.promoBanner}
          imageStyle={styles.promoBannerImage}
        >
          <LinearGradient
            colors={['#00000066', '#00000033', '#00000066']}
            style={styles.promoOverlay}
          >
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>¡Promociones del día!</Text>
            </View>
            <TouchableOpacity style={styles.promoButton}>
              <LinearGradient
                colors={['#FFD700', '#F5A623', '#FFD700']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.promoButtonGradient}
              >
                <Text style={styles.promoButtonText}>VER OFERTAS</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </ImageBackground>

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
  safe: { flex: 1, backgroundColor: '#000000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoImage: {
    width: 90,
    height: 60,
  },
  searchBtn: { padding: spacing.xs },
  searchIcon: { fontSize: 22 },
  scroll: { flex: 1 },
  promoBanner: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#F5A623',
    overflow: 'hidden',
    height: 120,
  },
  promoBannerImage: {
    borderRadius: borderRadius.lg,
  },
  promoOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  promoContent: {
    alignItems: 'center',
  },
  promoTitle: {
    color: '#FFD700',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    textShadowColor: '#F5A623',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  promoButton: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  promoButtonGradient: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.md,
  },
  promoButtonText: {
    color: '#000000',
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.base,
    letterSpacing: 2,
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
