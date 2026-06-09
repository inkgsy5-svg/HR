import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ResinStackParamList } from '@app/navigation/types';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { RESIN_CATEGORIES, Artwork } from '../data/categories';

type NavProp = StackNavigationProp<ResinStackParamList>;
type RouteType = RouteProp<ResinStackParamList, 'ResinDetail'>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.md * 2 - spacing.sm) / 2;

function ArtworkCard({
  artwork,
  color,
  onPress,
}: {
  artwork: Artwork;
  color: string;
  onPress: (artwork: Artwork) => void;
}) {
  return (
    <TouchableOpacity
      style={styles.artworkCard}
      activeOpacity={0.85}
      onPress={() => onPress(artwork)}
    >
      <Image source={artwork.image} style={styles.artworkImage} resizeMode="cover" />
      <View style={styles.artworkInfo}>
        <Text style={[styles.artworkTitle, { color }]} numberOfLines={1}>
          {artwork.title}
        </Text>
        <Text style={styles.artworkArtist}>{artwork.artist}</Text>
        <Text style={styles.artworkMeta}>
          {artwork.year} · {artwork.country}
        </Text>
        <Text style={styles.artworkMeta}>{artwork.materials}</Text>
        <Text style={styles.artworkSize}>{artwork.size}</Text>
        <Text style={[styles.artworkPrice, { color }]}>${artwork.price.toLocaleString()} MXN</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ResinDetailScreen() {
  const navigation = useNavigation<NavProp>();
  const { params } = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const [saved, setSaved] = useState(false);

  const category = RESIN_CATEGORIES.find(c => c.id === params.id);
  if (!category) return null;

  function openWhatsApp() {
    const msg = `Hola, me interesa la colección "${category!.name}". ¿Tienen disponibilidad?`;
    Linking.openURL(`whatsapp://send?phone=${category!.whatsapp}&text=${encodeURIComponent(msg)}`);
  }

  function handleArtworkPress(artwork: Artwork) {
    const msg = `Hola, me interesa la obra "${artwork.title}" de ${artwork.artist} (${artwork.size} · $${artwork.price} MXN). ¿Está disponible?`;
    Linking.openURL(`whatsapp://send?phone=${category!.whatsapp}&text=${encodeURIComponent(msg)}`);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Hero */}
        <View>
          <LinearGradient
            colors={[category.color + 'CC', category.color + '44', '#111']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <Text style={styles.heroEmoji}>{category.icon}</Text>
          </LinearGradient>
          <SafeAreaView edges={['top']} style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <View style={styles.heroNav}>
              <TouchableOpacity style={styles.heroNavBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.heroNavText}>←</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Perfil */}
        <View style={styles.profileSection}>
          <Text style={[styles.name, { color: category.color }]}>{category.name}</Text>
          <Text style={styles.specialty}>{category.subtitle}</Text>

          <View style={styles.availRow}>
            <View
              style={[
                styles.availDot,
                {
                  backgroundColor: category.availableToday ? colors.success : colors.error,
                },
              ]}
            />
            <Text style={styles.availText}>
              {category.availableToday ? 'Disponible' : 'Stock limitado'}
            </Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { borderColor: category.color }]}
              onPress={openWhatsApp}
            >
              <Text style={[styles.actionBtnText, { color: category.color }]}>💬 Consultar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { borderColor: category.color },
                saved && { backgroundColor: category.color },
              ]}
              onPress={() => setSaved(s => !s)}
            >
              <Text style={[styles.actionBtnText, { color: category.color }]}>
                {saved ? '♥' : '♡'} Guardar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Descripción */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: category.color }]}>Acerca de</Text>
          <Text style={styles.description}>{category.description}</Text>
        </View>

        {/* Galería de obras */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: category.color }]}>
            Obras disponibles ({category.artworks.length})
          </Text>
          <View style={styles.artworksGrid}>
            {category.artworks.map(artwork => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                color={category.color}
                onPress={handleArtworkPress}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: category.color }]}
          onPress={openWhatsApp}
        >
          <Text style={styles.ctaText}>CONSULTAR {category.name.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  hero: { width: '100%', height: 220, alignItems: 'center', justifyContent: 'center' },
  heroEmoji: { fontSize: 80 },
  heroNav: { flexDirection: 'row', paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  heroNavBtn: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  heroNavText: { color: colors.white, fontSize: 20 },

  profileSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  name: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  specialty: { color: colors.textSecondary, fontSize: typography.fontSize.base },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  availDot: { width: 8, height: 8, borderRadius: 4 },
  availText: { color: colors.textSecondary, fontSize: typography.fontSize.sm },

  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  actionBtn: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  actionBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },

  section: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.base,
    lineHeight: 22,
  },

  // Grid de obras
  artworksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  artworkCard: {
    width: CARD_WIDTH,
    backgroundColor: '#1C1C1C',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  artworkImage: {
    width: '100%',
    height: CARD_WIDTH,
  },
  artworkInfo: {
    padding: spacing.sm,
    gap: 3,
  },
  artworkTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  artworkArtist: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
  artworkMeta: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
  },
  artworkSize: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
  },
  artworkPrice: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    marginTop: 4,
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
  ctaButton: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  ctaText: {
    color: colors.background,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.md,
    letterSpacing: 1.5,
  },
});
