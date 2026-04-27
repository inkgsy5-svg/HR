import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { AppStackParamList } from '@app/navigation/types';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import ArtistCircle from '@modules/tattoo/components/ArtistCircle';
import { ARTISTS, Artist } from '@modules/tattoo/data/artists';
import BarberCircle from '@modules/barber/components/BarberCircle';
import { BARBERS, Barber } from '@modules/barber/data/barbers';

type HomeNavProp = StackNavigationProp<AppStackParamList>;

const MODULES = [
  {
    id: 'tattoo',
    label: 'Tatuajes',
    subtitle: 'Arte en tu piel',
    screen: 'Tattoo' as const,
    accent: colors.moduleTattoo,
    image: require('../../../assets/images/tattoo/tattoo-artists.jpg') as number,
  },
  {
    id: 'barber',
    label: 'Barber',
    subtitle: 'Cortes y estilos',
    screen: 'Barber' as const,
    accent: colors.moduleBarber,
    image: require('../../../assets/images/barber/barber-artist-3.jpeg') as number,
  },
  {
    id: 'smoke-shop',
    label: 'Smoke Shop',
    subtitle: 'Productos selectos',
    screen: 'SmokeShop' as const,
    accent: colors.moduleSmokeShop,
    image: null,
  },
  {
    id: 'music',
    label: 'Música',
    subtitle: 'Eventos y conciertos',
    screen: 'Music' as const,
    accent: colors.moduleMusic,
    image: null,
  },
  {
    id: 'piercing',
    label: 'Perforaciones',
    subtitle: 'Joyería y piercing',
    screen: 'Piercing' as const,
    accent: colors.modulePiercing,
    image: null,
  },
  {
    id: 'resin',
    label: 'Cuadros de Resina',
    subtitle: 'Arte decorativo',
    screen: 'Resin' as const,
    accent: colors.moduleResin,
    image: null,
  },
];

const PANEL_HEIGHT = 210;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();

  const [tattooExpanded, setTattooExpanded] = useState(false);
  const [tattooAnim] = useState(() => new Animated.Value(0));

  const [barberExpanded, setBarberExpanded] = useState(false);
  const [barberAnim] = useState(() => new Animated.Value(0));

  const toggleExpand = useCallback(
    (expanded: boolean, setExpanded: (v: boolean) => void, anim: Animated.Value) => {
      const toValue = expanded ? 0 : PANEL_HEIGHT;
      setExpanded(!expanded);
      Animated.timing(anim, {
        toValue,
        duration: 280,
        useNativeDriver: false,
      }).start();
    },
    [],
  );

  const handleArtistPress = useCallback(
    (artist: Artist) => {
      navigation.navigate(
        'Tattoo' as never,
        { screen: 'TattooDetail', params: { id: artist.id } } as never,
      );
    },
    [navigation],
  );

  const handleBarberPress = useCallback(
    (barber: Barber) => {
      navigation.navigate(
        'Barber' as never,
        { screen: 'BarberDetail', params: { id: barber.id } } as never,
      );
    },
    [navigation],
  );

  const handleModulePress = useCallback(
    (item: (typeof MODULES)[number]) => {
      if (item.id === 'tattoo') {
        toggleExpand(tattooExpanded, setTattooExpanded, tattooAnim);
      } else if (item.id === 'barber') {
        toggleExpand(barberExpanded, setBarberExpanded, barberAnim);
      } else {
        navigation.navigate(item.screen as keyof AppStackParamList);
      }
    },
    [tattooExpanded, barberExpanded, tattooAnim, barberAnim, toggleExpand, navigation],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.logoText}>HR</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={require('../../../assets/images/home/promo-bg.webp')}
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

        <View style={styles.moduleList}>
          {MODULES.map(item => (
            <View key={item.id}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.moduleCard}
                onPress={() => handleModulePress(item)}
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

              {/* Panel Tatuajes */}
              {item.id === 'tattoo' && (
                <Animated.View style={[styles.artistsPanel, { height: tattooAnim }]}>
                  <View style={styles.artistsRow}>
                    {ARTISTS.map(artist => (
                      <ArtistCircle key={artist.id} artist={artist} onPress={handleArtistPress} />
                    ))}
                  </View>
                </Animated.View>
              )}

              {/* Panel Barber */}
              {item.id === 'barber' && (
                <Animated.View style={[styles.artistsPanel, { height: barberAnim }]}>
                  <View style={styles.artistsRow}>
                    {BARBERS.map(barber => (
                      <BarberCircle key={barber.id} barber={barber} onPress={handleBarberPress} />
                    ))}
                  </View>
                </Animated.View>
              )}
            </View>
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
    borderBottomColor: colors.divider,
  },
  logoText: {
    color: colors.gold,
    fontSize: 32,
    fontWeight: typography.fontWeight.bold,
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
    borderColor: colors.accent,
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
  promoContent: { alignItems: 'center' },
  promoTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  promoButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + 2,
  },
  promoButtonText: {
    color: colors.textOnAccent,
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
    backgroundColor: colors.cardDark,
    overflow: 'hidden',
    height: 100,
  },
  moduleImageBg: { width: '100%', height: '100%' },
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
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  moduleSubtitle: {
    color: colors.textModuleSubtitle,
    fontSize: typography.fontSize.sm,
  },
  artistsPanel: {
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  artistsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.xl,
    flexWrap: 'wrap',
  },
});
