import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
  Modal,
  Pressable,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';

const { width } = Dimensions.get('window');
const CARD_GAP = 8;
const CARD_W = (width - spacing.md * 2 - CARD_GAP) / 2;
const SHOP_WHATSAPP = '521234567890';

const CATEGORY_GRID = [
  {
    id: 'cuadros',
    name: 'Cuadros Decorativos',
    icon: '🖼️',
    grad: ['#2a1a08', '#18100a'] as const,
    color: '#C9A050',
  },
  {
    id: 'piezas',
    name: 'Piezas Personalizadas',
    icon: '✨',
    grad: ['#2a0a1a', '#180614'] as const,
    color: '#E94560',
  },
  {
    id: 'regalos',
    name: 'Regalos Especiales',
    icon: '🎁',
    grad: ['#0a2010', '#06140a'] as const,
    color: '#4CAF50',
  },
];

const ARTWORKS = [
  {
    id: 'a1',
    title: 'Where I Left My Daydream',
    artist: 'Gera',
    price: 500,
    icon: '🖼️',
    color: '#C9A050',
    year: 2026,
    country: 'México',
    materials: 'Madera y Resina',
    size: '50 x 50 cm',
    image: require('../../../assets/images/resin/gallery-1.jpg'),
  },
  {
    id: 'a2',
    title: 'Ocean Waves',
    artist: 'Gera',
    price: 500,
    icon: '🌊',
    color: '#00BCD4',
    year: 2026,
    country: 'México',
    materials: 'Madera y Resina',
    size: '50 x 50 cm',
    image: require('../../../assets/images/resin/gallery-2.jpg'),
  },
  {
    id: 'a3',
    title: 'Purple Dream',
    artist: 'Gera',
    price: 500,
    icon: '✨',
    color: '#E94560',
    year: 2026,
    country: 'México',
    materials: 'Madera y Resina',
    size: '50 x 50 cm',
    image: require('../../../assets/images/resin/gallery-5.jpg'),
  },
  {
    id: 'a4',
    title: 'Love in Colors',
    artist: 'Gera',
    price: 500,
    icon: '🎁',
    color: '#4CAF50',
    year: 2026,
    country: 'México',
    materials: 'Madera y Resina',
    size: '50 x 50 cm',
    image: require('../../../assets/images/resin/gallery-9.jpg'),
  },
];

type Artwork = (typeof ARTWORKS)[0];
type Category = (typeof CATEGORY_GRID)[0];

const REVIEWS = [
  {
    id: '1',
    author: 'Sofía',
    rating: 5,
    timeAgo: '1 sem',
    comment: 'Las piezas son increíbles, quedé encantada con mi cuadro.',
  },
  {
    id: '2',
    author: 'Roberto',
    rating: 5,
    timeAgo: '2 sem',
    comment: 'Excelente calidad, los colores son vibrantes y duraderos.',
  },
  {
    id: '3',
    author: 'Daniela',
    rating: 4,
    timeAgo: '1 mes',
    comment: 'Mi pieza personalizada quedó exactamente como la imaginé.',
  },
];

function StarRow({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <Text style={styles.stars}>
      {'★'.repeat(full)}
      {'☆'.repeat(5 - full)}
    </Text>
  );
}

export default function ResinHomeScreen() {
  const [saved, setSaved] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  function openWhatsApp(msg: string) {
    Linking.openURL(`whatsapp://send?phone=${SHOP_WHATSAPP}&text=${encodeURIComponent(msg)}`);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero */}
        <View>
          <ImageBackground
            source={require('../../../assets/images/resin/hero.jpeg')}
            style={styles.hero}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(0,0,0,0.55)']}
              style={StyleSheet.absoluteFill}
            />
            <SafeAreaView edges={['top']}>
              <View style={styles.heroNav}>
                <View />
                <TouchableOpacity
                  style={styles.heroNavBtn}
                  onPress={() =>
                    openWhatsApp('Hola, me interesa conocer más sobre sus cuadros de resina.')
                  }
                >
                  <Text style={styles.heroNavText}>💬</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </ImageBackground>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <Text style={styles.shopName}>Cuadros de Resina</Text>
          <Text style={styles.shopTags}>Arte decorativo · Piezas únicas · Personalizado</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.starGold}>★</Text>
            <Text style={styles.ratingText}> 4.9 (48) </Text>
            <Text style={styles.openText}> • </Text>
            <View style={styles.greenDot} />
            <Text style={styles.openText}> Pedidos disponibles</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                openWhatsApp('Hola, me interesa ver su colección de cuadros de resina.')
              }
            >
              <Text style={styles.actionBtnText}>🎨 Ver colección</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                openWhatsApp('Hola, quisiera más información sobre sus cuadros de resina.')
              }
            >
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

        {/* Categorías */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Colecciones</Text>
          <View style={styles.categoryGrid}>
            {CATEGORY_GRID.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryCard}
                activeOpacity={0.85}
                onPress={() => setSelectedCategory(cat)}
              >
                <LinearGradient colors={cat.grad} style={styles.categoryGrad}>
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.categoryOverlay}
                  >
                    <Text style={styles.categoryLabel}>{cat.name}</Text>
                  </LinearGradient>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Obras destacadas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Obras destacadas</Text>
          <View style={styles.productsGrid}>
            {ARTWORKS.map(artwork => (
              <TouchableOpacity
                key={artwork.id}
                style={styles.productCard}
                activeOpacity={0.85}
                onPress={() => setSelectedArtwork(artwork)}
              >
                <ImageBackground
                  source={artwork.image}
                  style={styles.productThumb}
                  resizeMode="cover"
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {artwork.title}
                  </Text>
                  <Text style={styles.productPrice}>
                    {artwork.artist} · {artwork.size}
                  </Text>
                  <TouchableOpacity
                    style={[styles.detailBtn, { backgroundColor: artwork.color }]}
                    onPress={() => setSelectedArtwork(artwork)}
                  >
                    <Text style={styles.detailBtnText}>VER DETALLES</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reseñas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reseñas</Text>
          {REVIEWS.map(r => (
            <View key={r.id} style={styles.reviewRow}>
              <View style={styles.reviewAvatar}>
                <Text style={styles.reviewAvatarText}>{r.author[0]}</Text>
              </View>
              <View style={styles.reviewBody}>
                <View style={styles.reviewTopRow}>
                  <Text style={styles.reviewAuthor}>{r.author}</Text>
                  <StarRow rating={r.rating} />
                  <Text style={styles.reviewTime}>{r.timeAgo}</Text>
                </View>
                <Text style={styles.reviewComment}>{r.comment}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal Obra */}
      <Modal
        visible={!!selectedArtwork}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedArtwork(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedArtwork(null)}>
          <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>
            {selectedArtwork && (
              <>
                <ImageBackground
                  source={selectedArtwork.image}
                  style={styles.modalHeader}
                  resizeMode="cover"
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setSelectedArtwork(null)}
                  >
                    <Text style={styles.modalCloseText}>✕</Text>
                  </TouchableOpacity>
                </ImageBackground>
                <View style={styles.modalBody}>
                  <Text style={[styles.modalName]}>{selectedArtwork.title}</Text>
                  <Text style={[styles.modalPrice, { color: selectedArtwork.color }]}>
                    ${selectedArtwork.price.toLocaleString()} MXN
                  </Text>
                  <View style={styles.modalItemsSection}>
                    <Text style={styles.modalItemsTitle}>Información de la obra</Text>
                    {[
                      { label: 'Artista', value: selectedArtwork.artist },
                      { label: 'Año', value: String(selectedArtwork.year) },
                      { label: 'País', value: selectedArtwork.country },
                      { label: 'Materiales', value: selectedArtwork.materials },
                      { label: 'Medidas', value: selectedArtwork.size },
                    ].map(item => (
                      <View key={item.label} style={styles.modalItemRow}>
                        <Text style={styles.modalItemName}>{item.label}</Text>
                        <Text style={[styles.modalItemPrice, { color: selectedArtwork.color }]}>
                          {item.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={[styles.modalCta, { backgroundColor: selectedArtwork.color }]}
                    onPress={() => {
                      setSelectedArtwork(null);
                      openWhatsApp(
                        `Hola, me interesa la obra "${selectedArtwork.title}" de ${selectedArtwork.artist} (${selectedArtwork.size} · $${selectedArtwork.price} MXN). ¿Está disponible?`,
                      );
                    }}
                  >
                    <Text style={styles.modalCtaText}>CONSULTAR DISPONIBILIDAD</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal Categoría */}
      <Modal
        visible={!!selectedCategory}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedCategory(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedCategory(null)}>
          <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>
            {selectedCategory && (
              <>
                <LinearGradient colors={selectedCategory.grad} style={styles.modalHeader}>
                  <Text style={{ fontSize: 64 }}>{selectedCategory.icon}</Text>
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setSelectedCategory(null)}
                  >
                    <Text style={styles.modalCloseText}>✕</Text>
                  </TouchableOpacity>
                </LinearGradient>
                <View style={styles.modalBody}>
                  <Text style={styles.modalName}>{selectedCategory.name}</Text>
                  <TouchableOpacity
                    style={[styles.modalCta, { backgroundColor: selectedCategory.color }]}
                    onPress={() => {
                      setSelectedCategory(null);
                      openWhatsApp(
                        `Hola, me interesa la colección "${selectedCategory.name}". ¿Tienen disponibilidad?`,
                      );
                    }}
                  >
                    <Text style={styles.modalCtaText}>CONSULTAR COLECCIÓN</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  hero: { width: '100%', height: 320 },
  heroNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  heroNavBtn: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  heroNavText: { color: colors.white, fontSize: 20 },

  infoSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  shopName: {
    color: colors.gold,
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
  shopTags: { color: colors.textSecondary, fontSize: typography.fontSize.base },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  starGold: { color: colors.gold, fontSize: 16 },
  ratingText: { color: colors.textPrimary, fontSize: typography.fontSize.sm },
  greenDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.success },
  openText: { color: colors.textSecondary, fontSize: typography.fontSize.sm },

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
  actionBtnSaved: { backgroundColor: colors.gold },
  actionBtnText: {
    color: colors.gold,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },

  section: { paddingHorizontal: spacing.md, paddingBottom: spacing.lg, gap: spacing.sm },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },

  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: CARD_GAP },
  categoryCard: { width: CARD_W, height: 112, borderRadius: borderRadius.md, overflow: 'hidden' },
  categoryGrad: { flex: 1, padding: spacing.sm },
  categoryIcon: { fontSize: 28 },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xl,
  },
  categoryLabel: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },

  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: CARD_GAP },
  productCard: {
    width: CARD_W,
    backgroundColor: colors.cardDark,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  productThumb: { width: '100%', height: 120 },
  productInfo: { padding: spacing.sm, gap: 4 },
  productName: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  productPrice: { color: colors.textSecondary, fontSize: typography.fontSize.xs },
  detailBtn: {
    borderRadius: borderRadius.sm,
    paddingVertical: 5,
    alignItems: 'center',
    marginTop: 4,
  },
  detailBtnText: {
    color: colors.background,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },

  reviewRow: {
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
  reviewTopRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  reviewAuthor: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
  },
  stars: { color: colors.gold, fontSize: 12 },
  reviewTime: { color: colors.textMuted, fontSize: typography.fontSize.xs },
  reviewComment: { color: colors.textSecondary, fontSize: typography.fontSize.sm, marginTop: 2 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.cardDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: { height: 200, alignItems: 'center', justifyContent: 'center' },
  modalCloseBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: { color: colors.white, fontSize: 14, fontWeight: typography.fontWeight.bold },
  modalBody: { padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xl },
  modalName: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
  },
  modalPrice: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold },
  modalItemsSection: { gap: spacing.xs, marginTop: spacing.xs },
  modalItemsTitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  modalItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  modalItemName: { color: colors.textPrimary, fontSize: typography.fontSize.sm },
  modalItemPrice: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold },
  modalCta: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  modalCtaText: {
    color: colors.background,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.base,
    letterSpacing: 1,
  },
});
