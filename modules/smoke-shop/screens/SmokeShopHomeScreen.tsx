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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SmokeShopStackParamList } from '@app/navigation/types';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';

type NavProp = StackNavigationProp<SmokeShopStackParamList>;

const { width } = Dimensions.get('window');
const CARD_GAP = 8;
const CARD_W = (width - spacing.md * 2 - CARD_GAP) / 2;

const SHOP_WHATSAPP = '521234567890';

const CATEGORY_GRID = [
  {
    id: 'vaporizadores',
    name: 'Vaporizadores',
    icon: '💨',
    grad: ['#1a2a3a', '#0a1520'] as const,
    color: '#4FC3F7',
    description:
      'Los mejores vaporizadores portátiles y de escritorio. Marcas premium con garantía de fábrica.',
    types: ['Portátil', 'Escritorio', 'Convección', 'Conducción', 'Híbrido'],
    items: [
      { name: 'Pax 3', price: 1800 },
      { name: 'Mighty+', price: 3200 },
      { name: 'DynaVap M7', price: 900 },
    ],
  },
  {
    id: 'bongs',
    name: 'Bongs',
    icon: '💧',
    grad: ['#0a2020', '#061414'] as const,
    color: '#CE93D8',
    description:
      'Bongs de vidrio borosilicato, silicón y acrílico. Diseños artesanales y piezas de colección.',
    types: ['Borosilicato', 'Silicón', 'Beaker', 'Percolador', 'Sherlock'],
    items: [
      { name: 'Beaker Básico', price: 380 },
      { name: 'Percolator Bong', price: 950 },
      { name: 'Silicone Bong', price: 280 },
    ],
  },
  {
    id: 'vapes',
    name: 'Vapes & E-Liquids',
    icon: '🌫️',
    grad: ['#1a1030', '#100820'] as const,
    color: '#80DEEA',
    description:
      'Amplio catálogo de kits de vapeo, pods y e-liquids importados de las mejores marcas.',
    types: ['Kits completos', 'Pods', 'Mods', 'E-Liquids', 'Sales de nicotina'],
    items: [
      { name: 'Smok Nord 4', price: 1400 },
      { name: 'Vaporesso XROS', price: 900 },
      { name: 'E-Liquid 60ml', price: 180 },
    ],
  },
  {
    id: 'hierba',
    name: 'Hierba & Extractos',
    icon: '🌿',
    grad: ['#0a1e0a', '#061206'] as const,
    color: '#81C784',
    description:
      'Accesorios y contenedores para hierba, extractos y concentrados. Almacenamiento premium.',
    types: ['Stash boxes', 'Contenedores UV', 'Humidificadores', 'Desecantes'],
    items: [
      { name: 'Stash Box', price: 350 },
      { name: 'Contenedor UV', price: 180 },
      { name: 'CVault Medium', price: 420 },
    ],
  },
  {
    id: 'blunts',
    name: 'Blunts + Papeles',
    icon: '📜',
    grad: ['#2a1a08', '#18100a'] as const,
    color: '#FFB74D',
    description:
      'Amplio surtido de papeles de enrolar, blunt wraps, filtros y tips. Las mejores marcas.',
    types: ['Sin blanquear', 'Orgánicos', 'De arroz', 'Blunt wraps', 'King size'],
    items: [
      { name: 'Raw Classic', price: 45 },
      { name: 'Backwoods', price: 90 },
      { name: 'Elements Rice', price: 60 },
    ],
  },
  {
    id: 'encendedores',
    name: 'Encendedores',
    icon: '🔥',
    grad: ['#2a0a0a', '#180606'] as const,
    color: '#FF8A65',
    description: 'Encendedores Clipper, torch, plasma y eléctricos. Recargables y de colección.',
    types: ['Clipper', 'Torch butano', 'Plasma USB', 'Eléctrico', 'Colección'],
    items: [
      { name: 'Clipper Recargable', price: 45 },
      { name: 'Torch Butano', price: 500 },
      { name: 'Plasma USB', price: 180 },
    ],
  },
  {
    id: 'pipas',
    name: 'Pipas',
    icon: '🪈',
    grad: ['#1a1a2a', '#10101a'] as const,
    color: '#B0BEC5',
    description:
      'Pipas de madera, metal, vidrio y cerámica. Desde clásicas hasta piezas artísticas únicas.',
    types: ['Madera', 'Metal', 'Vidrio', 'Cerámica', 'Churchwarden'],
    items: [
      { name: 'Sherlock Pipe', price: 220 },
      { name: 'Pipa Madera', price: 150 },
      { name: 'One-Hitter', price: 80 },
    ],
  },
  {
    id: 'ropa',
    name: 'Ropa & Accesorios',
    icon: '🧢',
    grad: ['#2a1020', '#180a14'] as const,
    color: '#F48FB1',
    description:
      'Gorras, playeras, hoodies y accesorios lifestyle. Marcas de cultura smoke y streetwear.',
    types: ['Gorras', 'Playeras', 'Hoodies', 'Accesorios', 'Colecciones'],
    items: [
      { name: 'Gorra HR', price: 280 },
      { name: 'Hoodie Premium', price: 650 },
      { name: 'Playera Básica', price: 320 },
    ],
  },
];

type CategoryItem = (typeof CATEGORY_GRID)[0];

const FEATURED = [
  {
    id: '1',
    name: 'Pax 3',
    price: 2800,
    icon: '💨',
    color: '#4FC3F7',
    description:
      'Vaporizador portátil premium con tecnología de convección dual. Uno de los mejores del mercado.',
    features: [
      'Convección + conducción',
      'Batería larga duración',
      'App compatible',
      'Garantía 10 años',
    ],
  },
  {
    id: '2',
    name: 'Bong de Vidrio',
    price: 1200,
    icon: '💧',
    color: '#CE93D8',
    description:
      'Bong de borosilicato de 5mm con percolador de árbol para un filtrado suave y limpio.',
    features: ['Vidrio 5mm resistente', 'Percolador árbol', 'Junta 14mm', '30 cm de altura'],
  },
  {
    id: '3',
    name: 'Smok Nord 4',
    price: 1400,
    icon: '🌫️',
    color: '#80DEEA',
    description:
      'Kit de vapeo compacto con sistema de pods reemplazables y pantalla OLED integrada.',
    features: ['80W de potencia', 'Pantalla OLED', 'Pods reemplazables', 'Batería 2000mAh'],
  },
  {
    id: '4',
    name: 'Encendedor Torch',
    price: 500,
    icon: '🔥',
    color: '#FF8A65',
    description:
      'Encendedor de butano con llama torch ajustable. Ideal para concentrados y uso diario.',
    features: ['Llama ajustable', 'Recargable con butano', 'Base estable', 'Resistente al viento'],
  },
];

type FeaturedProduct = (typeof FEATURED)[0];

type Review = { id: string; author: string; rating: number; timeAgo: string; comment: string };

const REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Javier',
    rating: 5,
    timeAgo: '2 sem',
    comment: 'Gran variedad y calidad, excelente atención.',
  },
  {
    id: '2',
    author: 'Mariana',
    rating: 4,
    timeAgo: '1 mes',
    comment: 'El mejor shop de la ciudad, precios justos.',
  },
  {
    id: '3',
    author: 'Oscar',
    rating: 5,
    timeAgo: '2 m',
    comment: 'Siempre que voy salgo con algo nuevo, me encanta.',
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

export default function SmokeShopHomeScreen() {
  const navigation = useNavigation<NavProp>();
  const [saved, setSaved] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FeaturedProduct | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);

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
            source={require('../../../assets/images/smoke-shop/hero.jpeg')}
            style={styles.hero}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(0,0,0,0.55)']}
              style={StyleSheet.absoluteFill}
            />
          </ImageBackground>
          <SafeAreaView edges={['top']} style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <View style={styles.heroNav}>
              <TouchableOpacity style={styles.heroNavBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.heroNavText}>←</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroNavBtn}>
                <Text style={styles.heroNavText}>🔍</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Info tienda */}
        <View style={styles.infoSection}>
          <Text style={styles.shopName}>Smoke Shop</Text>
          <Text style={styles.shopTags}>Vaporizadores · Bongs · Accesorios</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.starGold}>★</Text>
            <Text style={styles.ratingText}> 4.8 (110) · </Text>
            <View style={styles.greenDot} />
            <Text style={styles.openText}> Abierto hoy hasta 9:00 pm</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                openWhatsApp('Hola, quisiera ver el catálogo de productos del Smoke Shop.')
              }
            >
              <Text style={styles.actionBtnText}>🟦 Ver productos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => openWhatsApp('Hola, me gustaría más información sobre el Smoke Shop.')}
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

        {/* Servicios — grid 2×4 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos</Text>
          <View style={styles.categoryGrid}>
            {CATEGORY_GRID.map(cat => (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.82}
                style={styles.categoryCard}
                onPress={() => setSelectedCategory(cat)}
              >
                <LinearGradient colors={cat.grad} style={styles.categoryGrad}>
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.78)']}
                    style={styles.categoryOverlay}
                  >
                    <Text style={styles.categoryLabel}>{cat.name}</Text>
                  </LinearGradient>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Productos destacados — grid 2 columnas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos destacados</Text>
          <View style={styles.productsGrid}>
            {FEATURED.map(prod => (
              <TouchableOpacity
                key={prod.id}
                activeOpacity={0.82}
                style={styles.productCard}
                onPress={() => setSelectedProduct(prod)}
              >
                <View style={[styles.productThumb, { backgroundColor: prod.color + '33' }]}>
                  <Text style={styles.productIcon}>{prod.icon}</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{prod.name}</Text>
                  <Text style={styles.productPrice}>${prod.price.toLocaleString()}</Text>
                  <View style={styles.detailBtn}>
                    <Text style={styles.detailBtnText}>VER DETALLES</Text>
                  </View>
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

      {/* Modal de categoría */}
      <Modal
        visible={selectedCategory !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedCategory(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedCategory(null)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            {selectedCategory && (
              <>
                <LinearGradient
                  colors={[
                    selectedCategory.color + 'BB',
                    selectedCategory.color + '33',
                    colors.cardDark,
                  ]}
                  style={styles.modalHeader}
                >
                  <Text style={styles.modalEmoji}>{selectedCategory.icon}</Text>
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setSelectedCategory(null)}
                  >
                    <Text style={styles.modalCloseText}>✕</Text>
                  </TouchableOpacity>
                </LinearGradient>

                <View style={styles.modalBody}>
                  <Text style={styles.modalName}>{selectedCategory.name}</Text>
                  <Text style={styles.modalDescription}>{selectedCategory.description}</Text>

                  <View style={styles.modalFeatures}>
                    {selectedCategory.types.map((t, i) => (
                      <View key={i} style={styles.modalFeatureRow}>
                        <Text style={[styles.modalFeatureDot, { color: selectedCategory.color }]}>
                          ✓
                        </Text>
                        <Text style={styles.modalFeatureText}>{t}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.modalItemsSection}>
                    <Text style={styles.modalItemsTitle}>Productos disponibles</Text>
                    {selectedCategory.items.map((item, i) => (
                      <View key={i} style={styles.modalItemRow}>
                        <Text style={styles.modalItemName}>{item.name}</Text>
                        <Text style={[styles.modalItemPrice, { color: selectedCategory.color }]}>
                          ${item.price.toLocaleString()}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[styles.modalCta, { backgroundColor: selectedCategory.color }]}
                    onPress={() => {
                      setSelectedCategory(null);
                      openWhatsApp(
                        `Hola, me interesa la categoría: ${selectedCategory.name}. ¿Qué tienen disponible?`,
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

      {/* Modal de producto */}
      <Modal
        visible={selectedProduct !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedProduct(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedProduct(null)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            {selectedProduct && (
              <>
                {/* Header con color del producto */}
                <LinearGradient
                  colors={[
                    selectedProduct.color + 'BB',
                    selectedProduct.color + '44',
                    colors.cardDark,
                  ]}
                  style={styles.modalHeader}
                >
                  <Text style={styles.modalEmoji}>{selectedProduct.icon}</Text>
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setSelectedProduct(null)}
                  >
                    <Text style={styles.modalCloseText}>✕</Text>
                  </TouchableOpacity>
                </LinearGradient>

                <View style={styles.modalBody}>
                  <Text style={styles.modalName}>{selectedProduct.name}</Text>
                  <Text style={[styles.modalPrice, { color: selectedProduct.color }]}>
                    ${selectedProduct.price.toLocaleString()} MXN
                  </Text>

                  <Text style={styles.modalDescription}>{selectedProduct.description}</Text>

                  <View style={styles.modalFeatures}>
                    {selectedProduct.features.map((f, i) => (
                      <View key={i} style={styles.modalFeatureRow}>
                        <Text style={[styles.modalFeatureDot, { color: selectedProduct.color }]}>
                          ✓
                        </Text>
                        <Text style={styles.modalFeatureText}>{f}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[styles.modalCta, { backgroundColor: selectedProduct.color }]}
                    onPress={() => {
                      setSelectedProduct(null);
                      openWhatsApp(
                        `Hola, me interesa el producto: ${selectedProduct.name} — $${selectedProduct.price.toLocaleString()} MXN. ¿Tienen disponibilidad?`,
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Hero
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

  // Info
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

  // Sections
  section: { paddingHorizontal: spacing.md, paddingBottom: spacing.lg, gap: spacing.sm },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },

  // Category grid
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

  // Products grid
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: CARD_GAP },
  productCard: {
    width: CARD_W,
    backgroundColor: colors.cardDark,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  productThumb: {
    width: '100%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productIcon: { fontSize: 36 },
  productInfo: { padding: spacing.sm, gap: 4 },
  productName: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  productPrice: { color: colors.textSecondary, fontSize: typography.fontSize.sm },
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

  // Reviews
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

  // Modal producto
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.cardDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalEmoji: { fontSize: 64 },
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
  modalBody: {
    padding: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  modalName: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
  },
  modalPrice: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
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
    color: colors.background,
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
