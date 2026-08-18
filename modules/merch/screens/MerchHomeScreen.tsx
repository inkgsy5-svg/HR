import React, { useState, useMemo } from 'react';
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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { MERCH_PRODUCTS, MerchProduct } from '../data/products';

const { width } = Dimensions.get('window');
const CARD_GAP = 8;
const CARD_W = (width - spacing.md * 2 - CARD_GAP) / 2;
const WHATSAPP = '521XXXXXXXXXX'; // ← tu número

// ─── Categorías ───────────────────────────────────────────────────────────────

const CATEGORY_GRID = [
  {
    id: 'playeras',
    name: 'Playeras',
    icon: '👕',
    grad: ['#1a1a0a', '#0e0e06'] as const,
    color: '#C9A84C',
    description:
      'Playeras de algodón 100%, corte regular y oversize. Bordado y estampados exclusivos HR.',
    types: ['Regular', 'Oversize', 'Manga larga', 'Bordada', 'Estampada'],
    items: [
      { name: 'Playera HR Classic', price: 350 },
      { name: 'Playera HR Drop', price: 380 },
    ],
  },
  {
    id: 'sudaderas',
    name: 'Sudaderas',
    icon: '🧥',
    grad: ['#0a1020', '#060a14'] as const,
    color: '#90CAF9',
    description:
      'Sudaderas fleece con capucha, bolsa canguro y logo bordado. Tela gruesa de calidad.',
    types: ['Con capucha', 'Sin capucha', 'Oversize', 'Zip-up', 'Fleece'],
    items: [
      { name: 'Sudadera HR Logo', price: 699 },
      { name: 'Sudadera HR Oversize', price: 749 },
    ],
  },
  {
    id: 'gorras',
    name: 'Gorras',
    icon: '🧢',
    grad: ['#1a0a0a', '#100606'] as const,
    color: '#EF9A9A',
    description:
      'Gorras snapback y dad hat con parche y bordado frontal. Ajuste perfecto unitalla.',
    types: ['Snapback', 'Dad hat', '5 paneles', '6 paneles', 'Trucker'],
    items: [
      { name: 'Gorra Snapback HR', price: 280 },
      { name: 'Gorra HR Dad Hat', price: 260 },
    ],
  },
  {
    id: 'pants',
    name: 'Pants',
    icon: '👖',
    grad: ['#0a1a0a', '#060e06'] as const,
    color: '#A5D6A7',
    description: 'Pants de tela francesa y cargo. Cintura elástica, corte recto, logo en pierna.',
    types: ['Francés', 'Cargo', 'Jogger', 'Relaxed', 'Slim'],
    items: [
      { name: 'Pants HR Relaxed', price: 550 },
      { name: 'Pants HR Cargo', price: 599 },
    ],
  },
  {
    id: 'conjuntos',
    name: 'Conjuntos',
    icon: '✨',
    grad: ['#1a0a1a', '#100610'] as const,
    color: '#CE93D8',
    description:
      'Outfits completos HR: playera + sudadera + gorra o sudadera + pants. Edición limitada.',
    types: ['Drop 01', 'Relaxed set', 'Full outfit', 'Two-piece', 'Limitado'],
    items: [
      { name: 'Conjunto HR Drop 01', price: 999 },
      { name: 'Conjunto HR Relaxed', price: 1050 },
    ],
  },
];

type CategoryItem = (typeof CATEGORY_GRID)[0];

// ─── Reseñas ──────────────────────────────────────────────────────────────────

type Review = { id: string; author: string; rating: number; timeAgo: string; comment: string };

const REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Carlos',
    rating: 5,
    timeAgo: '1 sem',
    comment: 'La calidad de las prendas es increíble, se nota lo fino del material.',
  },
  {
    id: '2',
    author: 'Sofía',
    rating: 5,
    timeAgo: '2 sem',
    comment: 'El conjunto Drop 01 es una joya, me lo puse y no me lo quiero quitar.',
  },
  {
    id: '3',
    author: 'Diego',
    rating: 4,
    timeAgo: '1 mes',
    comment: 'Excelente ropa, envío rápido y atención muy buena por WhatsApp.',
  },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <Text style={styles.stars}>
      {'★'.repeat(Math.floor(rating))}
      {'☆'.repeat(5 - Math.floor(rating))}
    </Text>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MerchHomeScreen() {
  const navigation = useNavigation();
  const [saved, setSaved] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MerchProduct | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Filtra productos según categoría activa
  const filteredProducts = useMemo(() => {
    if (!activeFilter) return MERCH_PRODUCTS;
    return MERCH_PRODUCTS.filter(p => p.category === activeFilter);
  }, [activeFilter]);

  const activeCategory = CATEGORY_GRID.find(c => c.id === activeFilter);

  function openWhatsApp(msg: string) {
    Linking.openURL(`whatsapp://send?phone=${WHATSAPP}&text=${encodeURIComponent(msg)}`);
  }

  function handleCategoryPress(cat: CategoryItem) {
    // Solo filtra, sin abrir modal de categoría
    setActiveFilter(prev => (prev === cat.id ? null : cat.id));
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ── Hero ── */}
        <View>
          <ImageBackground
            source={require('../../../assets/images/merch/hero.jpeg')}
            style={styles.hero}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(0,0,0,0.55)']}
              style={StyleSheet.absoluteFill}
            />
            <SafeAreaView edges={['top']}>
              <View style={styles.heroNav}>
                <TouchableOpacity style={styles.heroNavBtn} onPress={() => navigation.goBack()}>
                  <MaterialCommunityIcons name="arrow-left" size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </ImageBackground>
        </View>

        {/* ── Info ── */}
        <View style={styles.infoSection}>
          <Text style={styles.shopName}>Merch HR</Text>
          <Text style={styles.shopTags}>Playeras · Sudaderas · Gorras · Conjuntos</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.starGold}>★ </Text>
            <Text style={styles.ratingText}>4.9 (87) · </Text>
            <View style={styles.greenDot} />
            <Text style={styles.openText}> Disponible hoy</Text>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => openWhatsApp('Hola! Quiero ver el catálogo de Merch HR 👕')}
            >
              <Text style={styles.actionBtnText}>🛍️ Ver catálogo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => openWhatsApp('Hola! Quiero hacer un pedido de Merch HR')}
            >
              <Text style={styles.actionBtnText}>💬 Mensaje</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, saved && styles.actionBtnSaved]}
              onPress={() => setSaved(s => !s)}
            >
              <Text style={styles.actionBtnText}>{saved ? '♥ Guardado' : '♡ Guardar'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Categorías ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {CATEGORY_GRID.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryCircleWrapper}
                activeOpacity={0.8}
                onPress={() => handleCategoryPress(cat)}
              >
                <View
                  style={[
                    styles.categoryCircle,
                    activeFilter === cat.id && styles.categoryCircleActive,
                  ]}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                </View>
                <Text
                  style={[styles.categoryLabel, activeFilter === cat.id && { color: colors.gold }]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Catálogo filtrado ── */}
        <View style={styles.section}>
          <View style={styles.catalogHeader}>
            <Text style={styles.sectionTitle}>
              {activeCategory
                ? `${activeCategory.icon} ${activeCategory.name}`
                : '🔥 Todo el catálogo'}
            </Text>
            {activeFilter && (
              <TouchableOpacity onPress={() => setActiveFilter(null)}>
                <Text style={styles.clearFilter}>Ver todo</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.productsGrid}>
            {filteredProducts.map(product => (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                activeOpacity={0.8}
                onPress={() => setSelectedProduct(product)}
              >
                <Image source={product.image} style={styles.productThumb} resizeMode="cover" />
                {product.discountLabel && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>{product.discountLabel}</Text>
                  </View>
                )}
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={[styles.productPrice, { color: product.color }]}>
                      ${product.price.toLocaleString()}
                    </Text>
                    {product.originalPrice && (
                      <Text style={styles.originalPrice}>
                        ${product.originalPrice.toLocaleString()}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.detailBtn}
                    onPress={() => setSelectedProduct(product)}
                  >
                    <Text style={styles.detailBtnText}>VER DETALLE</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Reseñas ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reseñas</Text>
          {REVIEWS.map(review => (
            <View key={review.id} style={styles.reviewRow}>
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
          ))}
        </View>
      </ScrollView>

      {/* ── Modal producto ── */}
      <Modal
        visible={!!selectedProduct}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedProduct(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedProduct(null)}>
          <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>
            {selectedProduct && (
              <>
                <View style={styles.modalHeader}>
                  <Image
                    source={selectedProduct.image}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setSelectedProduct(null)}
                  >
                    <Text style={styles.modalCloseText}>✕</Text>
                  </TouchableOpacity>
                  {selectedProduct.discountLabel && (
                    <View style={styles.modalDiscountBadge}>
                      <Text style={styles.discountBadgeText}>{selectedProduct.discountLabel}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.modalBody}>
                  <Text style={styles.modalName}>{selectedProduct.name}</Text>
                  <View style={styles.priceRow}>
                    <Text style={[styles.modalPrice, { color: selectedProduct.color }]}>
                      ${selectedProduct.price.toLocaleString()} MXN
                    </Text>
                    {selectedProduct.originalPrice && (
                      <Text style={styles.originalPrice}>
                        ${selectedProduct.originalPrice.toLocaleString()}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.modalDescription}>{selectedProduct.description}</Text>
                  <View style={styles.modalFeatures}>
                    {selectedProduct.features.map(f => (
                      <View key={f} style={styles.modalFeatureRow}>
                        <Text style={[styles.modalFeatureDot, { color: selectedProduct.color }]}>
                          ✦
                        </Text>
                        <Text style={styles.modalFeatureText}>{f}</Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={[styles.modalCta, { backgroundColor: '#25D366' }]}
                    onPress={() => openWhatsApp(selectedProduct.whatsappMessage)}
                  >
                    <Text style={styles.modalCtaText}>💬 PEDIR POR WHATSAPP</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Modal categoría ── */}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },

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
  catalogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  clearFilter: {
    color: colors.gold,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },

  categoryRow: { flexDirection: 'row', paddingVertical: spacing.sm, gap: 16 },
  categoryCircleWrapper: { alignItems: 'center', gap: 6 },
  categoryCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryCircleActive: { borderColor: colors.gold },
  categoryIcon: { fontSize: 26 },
  categoryLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 64,
  },
  categoryLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary, // ← cambia textSecondary por textPrimary
    textAlign: 'center',
    maxWidth: 64,
  },

  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: CARD_GAP },
  productCard: {
    width: CARD_W,
    backgroundColor: colors.cardDark,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  productThumb: { width: '100%', height: 160 },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  discountBadgeText: { color: '#000', fontWeight: '700', fontSize: 10 },
  productInfo: { padding: spacing.sm, gap: 4 },
  productName: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  productPrice: { fontWeight: typography.fontWeight.bold, fontSize: typography.fontSize.base },
  originalPrice: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    textDecorationLine: 'line-through',
  },
  detailBtn: {
    backgroundColor: colors.gold,
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
  modalHeader: { height: 220, position: 'relative' },
  modalImage: { width: '100%', height: '100%' },
  modalCatHeader: { height: 160, alignItems: 'center', justifyContent: 'center' },
  modalCatIcon: { fontSize: 64 },
  modalCloseBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: { color: colors.white, fontSize: 14, fontWeight: typography.fontWeight.bold },
  modalDiscountBadge: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    backgroundColor: colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  modalBody: { padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xl },
  modalName: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
  },
  modalPrice: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold },
  modalDescription: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.base,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  modalFeatures: { gap: spacing.xs, marginTop: spacing.xs },
  modalFeatureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  modalFeatureDot: { fontSize: 14, fontWeight: typography.fontWeight.bold, width: 16 },
  modalFeatureText: { color: colors.textSecondary, fontSize: typography.fontSize.sm },
  modalCta: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  modalCtaText: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.base,
    letterSpacing: 1,
  },
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
});
