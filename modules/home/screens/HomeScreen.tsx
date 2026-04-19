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
    subtitle: 'Arte en tu piel',
    screen: 'Tattoo' as const,
    accent: '#8B2FC9',
    image: require('../../../assets/images/tattoo-artists.png') as number,
  },
  {
    id: 'barber',
    label: 'Barber',
    subtitle: 'Cortes y estilos',
    screen: 'Barber' as const,
    accent: '#2E86AB',
    image: null,
  },
  {
    id: 'smoke-shop',
    label: 'Smoke Shop',
    subtitle: 'Productos selectos',
    screen: 'SmokeShop' as const,
    accent: '#4CAF50',
    image: null,
  },
  {
    id: 'music',
    label: 'Música',
    subtitle: 'Eventos y conciertos',
    screen: 'Music' as const,
    accent: '#E94560',
    image: null,
  },
  {
    id: 'piercing',
    label: 'Perforaciones',
    subtitle: 'Joyería y piercing',
    screen: 'Piercing' as const,
    accent: '#F5A623',
    image: null,
  },
  {
    id: 'resin',
    label: 'Cuadros de Resina',
    subtitle: 'Arte decorativo',
    screen: 'Resin' as const,
    accent: '#00BCD4',
    image: null,
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>HR</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Promo Banner */}
        <ImageBackground
          source={require('../../../assets/images/promo-bg.webp')}
          style={styles.promoBanner}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.5)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.promoOverlay}
          >
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>¡Promociones del día!</Text>
            </View>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>VER OFERTAS</Text>
            </TouchableOpacity>
          </LinearGradient>
        </ImageBackground>

        {/* Module Cards */}
        <View style={styles.moduleList}>
          {MODULES.map(item => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              style={styles.moduleCard}
              onPress={() => navigation.navigate(item.screen as keyof AppStackParamList)}
            >
              {item.image ? (
                <ImageBackground
                  source={item.image}
                  style={styles.moduleImageBg}
                  resizeMode="cover"
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.moduleOverlay}
                  >
                    <Text style={styles.moduleLabel}>{item.label}</Text>
                    <Text style={styles.moduleSubtitle}>{item.subtitle}</Text>
                  </LinearGradient>
                </ImageBackground>
              ) : (
                <View style={styles.moduleInfo}>
                  <Text style={styles.moduleLabel}>{item.label}</Text>
                  <Text style={styles.moduleSubtitle}>{item.subtitle}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#111111' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  logoText: {
    color: '#C9A050',
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'serif',
    letterSpacing: 3,
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
    borderColor: '#FFA500',
    overflow: 'hidden',
    height: 120,
  },
  promoOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  promoContent: {
    alignItems: 'center',
  },
  promoTitle: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'sans-serif',
    textAlign: 'center',
  },
  promoButton: {
    backgroundColor: '#FFA500',
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + 2,
  },
  promoButtonText: {
    color: '#1A1A1A',
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.base,
    letterSpacing: 2,
  },
  moduleList: {
    paddingHorizontal: spacing.md,
    paddingBottom: 160,
    gap: spacing.sm,
  },
  moduleCard: {
    borderRadius: borderRadius.lg,
    backgroundColor: '#1C1C1C',
    overflow: 'hidden',
    height: 100,
  },
  moduleImageBg: {
    width: '100%',
    height: '100%',
  },
  moduleOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    gap: 4,
  },
  moduleInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    gap: 4,
  },
  moduleLabel: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
  },
  moduleSubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: typography.fontSize.sm,
  },
});
