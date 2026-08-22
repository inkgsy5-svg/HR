import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import ImageLightbox from '@modules/barber/components/ImageLightbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MusicStackParamList } from '@app/navigation/types';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { ARTISTS, Review } from '../data/artists';

type NavProp = StackNavigationProp<MusicStackParamList>;
type RouteType = RouteProp<MusicStackParamList, 'MusicDetail'>;

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

export default function MusicDetailScreen() {
  const navigation = useNavigation<NavProp>();
  const { params } = useRoute<RouteType>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const artist = ARTISTS.find(a => a.id === params.id);
  if (!artist) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
      >
        {/* Hero Image */}
        <View>
          <Image source={artist.heroImage ?? artist.image} style={styles.hero} resizeMode="cover" />
          <SafeAreaView edges={['top']} style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <View style={styles.heroNav}>
              <TouchableOpacity style={styles.heroNavBtn} onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons name="arrow-left" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Nombre */}
        <View style={styles.profileSection}>
          <Text style={styles.name}>{artist.name}</Text>
          <Text style={styles.specialty}>{artist.specialty}</Text>
        </View>

        {/* Géneros y galería */}
        {(artist.styles.length > 0 || artist.gallery.length > 0) && (
          <View style={styles.section}>
            {artist.styles.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Géneros</Text>
                <View style={styles.stylesRow}>
                  {artist.styles.map(s => (
                    <Text key={s} style={styles.styleTag}>
                      ✓ {s}
                    </Text>
                  ))}
                </View>
              </>
            )}
            {artist.gallery.length > 0 && (
              <View style={styles.gallery}>
                {artist.gallery.map((img, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setLightboxIndex(i)}
                    activeOpacity={0.85}
                  >
                    <Image source={img} style={styles.galleryCell} resizeMode="cover" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Información */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>
          {!!artist.bio && <Text style={styles.bio}>{artist.bio}</Text>}
          <Text style={styles.infoItem}>📍 {artist.location}</Text>
        </View>

        {/* Videos */}
        {artist.videos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Videos</Text>
            {artist.videos.map(video => (
              <TouchableOpacity
                key={video.url}
                style={styles.videoRow}
                activeOpacity={0.7}
                onPress={() => Linking.openURL(video.url)}
              >
                <MaterialCommunityIcons name="youtube" size={22} color={colors.error} />
                <Text style={styles.videoTitle}>{video.title}</Text>
                <MaterialCommunityIcons name="open-in-new" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Reseñas */}
        {artist.reviews.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reseñas</Text>
            {artist.reviews.map(r => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </View>
        )}
      </ScrollView>

      <ImageLightbox
        visible={lightboxIndex !== null}
        images={artist.gallery}
        initialIndex={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
      />
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
  stars: { color: colors.gold, fontSize: 14 },

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
    gap: 3,
    marginTop: spacing.xs,
  },
  galleryCell: {
    width: 84,
    height: 84,
    borderRadius: borderRadius.sm,
  },

  // Info
  bio: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  infoItem: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
  },

  // Videos
  videoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  videoTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
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
});
