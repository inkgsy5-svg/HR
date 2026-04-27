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
import ImageLightbox from '@modules/barber/components/ImageLightbox';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TattooStackParamList } from '@app/navigation/types';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { ARTISTS, Review } from '../data/artists';

type NavProp = StackNavigationProp<TattooStackParamList>;
type RouteType = RouteProp<TattooStackParamList, 'TattooDetail'>;

const { width } = Dimensions.get('window');
const GALLERY_GAP = 3;
const CELL_SIZE = (width - spacing.md * 2 - GALLERY_GAP * 3) / 4;

function StarRow({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <Text style={styles.stars}>
      {'★'.repeat(full)}
      {'☆'.repeat(5 - full)}
    </Text>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewAvatar}>
        <Text style={styles.reviewAvatarText}>{review.author[0]}</Text>
      </View>
      <View style={styles.reviewBody}>
        <View style={styles.reviewTopRow}>
          <Text style={styles.reviewAuthor}>{review.author}</Text>
          <StarRow rating={review.rating} />
          <Text style={styles.reviewTime}>{review.timeAgo}</Text>
        </View>
        <Text style={styles.reviewComment}>{review.comment}</Text>
      </View>
    </View>
  );
}

export default function TattooDetailScreen() {
  const navigation = useNavigation<NavProp>();
  const { params } = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const [saved, setSaved] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const artist = ARTISTS.find(a => a.id === params.id);
  if (!artist) return null;

  function openWhatsApp() {
    const msg = `Hola ${artist!.name}, me interesa agendar una cita para un tatuaje.`;
    Linking.openURL(`whatsapp://send?phone=${artist!.whatsapp}&text=${encodeURIComponent(msg)}`);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Hero Image */}
        <View>
          <Image source={artist.heroImage ?? artist.image} style={styles.hero} resizeMode="cover" />
          <SafeAreaView edges={['top']} style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <View style={styles.heroNav}>
              <TouchableOpacity style={styles.heroNavBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.heroNavText}>←</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Nombre y estrellas */}
        <View style={styles.profileSection}>
          <Text style={styles.name}>{artist.name}</Text>
          <Text style={styles.specialty}>{artist.specialty}</Text>

          <View style={styles.ratingRow}>
            <StarRow rating={artist.rating} />
            <Text style={styles.ratingText}>
              {' '}
              {artist.rating} ({artist.reviewCount})
            </Text>
            <Text style={styles.bullet}> • </Text>
            <View
              style={[
                styles.availDot,
                { backgroundColor: artist.availableToday ? colors.success : colors.error },
              ]}
            />
            <Text style={styles.availText}>
              {artist.availableToday ? 'Disponible hoy' : 'No disponible hoy'}
            </Text>
          </View>

          {/* Botones de acción */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>📅 Agendar cita</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={openWhatsApp}>
              <Text style={styles.actionBtnText}>💬 Mensaje</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, saved && styles.actionBtnSaved]}
              onPress={() => setSaved(s => !s)}
            >
              <Text style={styles.actionBtnText}>{saved ? '♥' : '♡'} Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Estilos y galería */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estilos y especialidades</Text>
          <View style={styles.stylesRow}>
            {artist.styles.map(s => (
              <Text key={s} style={styles.styleTag}>
                ✓ {s}
              </Text>
            ))}
          </View>
          <View style={styles.gallery}>
            {artist.gallery.map((img, i) => (
              <TouchableOpacity key={i} onPress={() => setLightboxIndex(i)}>
                <Image source={img} style={styles.galleryCell} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Información */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoItem}>📅 Experiencia: {artist.experience}</Text>
            <Text style={styles.infoItem}>✅ Material esterilizado</Text>
          </View>
          <Text style={styles.infoItem}>📍 Sucursal: {artist.location}</Text>
        </View>

        {/* Reseñas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reseñas</Text>
          {artist.reviews.map(r => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </View>
      </ScrollView>

      <ImageLightbox
        visible={lightboxIndex !== null}
        images={artist.gallery}
        initialIndex={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
      />

      {/* CTA fijo abajo */}
      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaText}>AGENDAR CITA CON {artist.name.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Hero
  hero: { width: '100%', height: 300 },
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

  // Perfil
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  name: {
    color: colors.gold,
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
  },
  specialty: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.base,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  stars: { color: colors.gold, fontSize: 14 },
  ratingText: { color: colors.textPrimary, fontSize: typography.fontSize.sm },
  bullet: { color: colors.textMuted },
  availDot: { width: 8, height: 8, borderRadius: 4 },
  availText: { color: colors.textSecondary, fontSize: typography.fontSize.sm, marginLeft: 4 },

  // Botones
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  actionBtn: {
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  actionBtnSaved: {
    backgroundColor: colors.gold,
  },
  actionBtnText: {
    color: colors.gold,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },

  // Secciones
  section: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.gold,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },

  // Estilos/tags
  stylesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  styleTag: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },

  // Galería
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GALLERY_GAP,
    marginTop: spacing.xs,
  },
  galleryCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: borderRadius.sm,
  },

  // Info
  infoRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    flexWrap: 'wrap',
  },
  infoItem: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
  },

  // Reseñas
  reviewCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  reviewAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarText: {
    color: colors.background,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.base,
  },
  reviewBody: { flex: 1 },
  reviewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  reviewAuthor: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
  },
  reviewTime: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
  },
  reviewComment: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    marginTop: 2,
  },

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
    borderTopColor: colors.divider,
  },
  ctaButton: {
    backgroundColor: colors.gold,
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
