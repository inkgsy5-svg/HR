import React, { useState, useMemo, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@app/navigation/types';
import { colors } from '@app/theme/colors';
import { typography } from '@app/theme/typography';
import { spacing } from '@app/theme/spacing';
import { ARTISTS } from '@modules/tattoo/data/artists';
import { BARBERS } from '@modules/barber/data/barbers';
import { PIERCERS } from '@modules/piercing/data/piercers';
import { PIERCING_SERVICES } from '@modules/piercing/data/services';
import { CATEGORIES as SMOKE_CATEGORIES } from '@modules/smoke-shop/data/categories';
import { MERCH_PRODUCTS } from '@modules/merch/data/products';
import { RESIN_CATEGORIES } from '@modules/resin/data/categories';

type NavProp = StackNavigationProp<AppStackParamList>;

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  categoryColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  keywords: string[];
  onNavigate: (nav: NavProp) => void;
};

const goTo = (screen: keyof AppStackParamList) => (nav: NavProp) => nav.navigate(screen as never);

const SEARCH_INDEX: SearchItem[] = [
  // ── Módulos ──────────────────────────────────────────────────
  {
    id: 'mod-tattoo',
    title: 'Tatuajes',
    subtitle: 'Arte en tu piel · galería de artistas',
    category: 'Módulo',
    categoryColor: colors.moduleTattoo,
    icon: 'body-outline',
    keywords: ['tattoo', 'tinta', 'arte'],
    onNavigate: goTo('Tattoo'),
  },
  {
    id: 'mod-barber',
    title: 'Barber Shop',
    subtitle: 'Cortes, estilos y barba',
    category: 'Módulo',
    categoryColor: colors.moduleBarber,
    icon: 'cut-outline',
    keywords: ['corte', 'cabello', 'barba', 'pelo'],
    onNavigate: goTo('Barber'),
  },
  {
    id: 'mod-smoke',
    title: 'Smoke Shop',
    subtitle: 'Vaporizadores, bongs y accesorios',
    category: 'Módulo',
    categoryColor: colors.moduleSmokeShop,
    icon: 'leaf-outline',
    keywords: ['fumar', 'vape', 'smok', 'shop'],
    onNavigate: goTo('SmokeShop'),
  },
  {
    id: 'mod-music',
    title: 'Música',
    subtitle: 'Eventos y conciertos en vivo',
    category: 'Módulo',
    categoryColor: colors.moduleMusic,
    icon: 'musical-notes-outline',
    keywords: ['concierto', 'evento', 'show', 'banda'],
    onNavigate: goTo('Music'),
  },
  {
    id: 'mod-piercing',
    title: 'Perforaciones',
    subtitle: 'Joyería y piercing profesional',
    category: 'Módulo',
    categoryColor: colors.modulePiercing,
    icon: 'sparkles-outline',
    keywords: ['joya', 'arracada', 'oreja', 'nariz'],
    onNavigate: goTo('Piercing'),
  },
  {
    id: 'mod-resin',
    title: 'Cuadros de Resina',
    subtitle: 'Arte decorativo en resina',
    category: 'Módulo',
    categoryColor: colors.moduleResin,
    icon: 'color-palette-outline',
    keywords: ['pintura', 'decoracion', 'regalo', 'epoxy'],
    onNavigate: goTo('Resin'),
  },
  {
    id: 'mod-merch',
    title: 'Merch HR',
    subtitle: 'Ropa, gorras y accesorios',
    category: 'Módulo',
    categoryColor: colors.moduleMerch,
    icon: 'shirt-outline',
    keywords: ['ropa', 'moda', 'outfit', 'vestimenta'],
    onNavigate: goTo('Merch'),
  },

  // ── Artistas de tatuaje ───────────────────────────────────────
  ...ARTISTS.map(a => ({
    id: `artist-${a.id}`,
    title: a.name,
    subtitle: a.specialty,
    category: 'Tatuador',
    categoryColor: colors.moduleTattoo,
    icon: 'body-outline' as keyof typeof Ionicons.glyphMap,
    keywords: [a.specialty, 'tattoo', 'artista'],
    onNavigate: (nav: NavProp) =>
      nav.navigate(
        'Tattoo' as never,
        {
          screen: 'TattooDetail',
          params: { id: a.id },
        } as never,
      ),
  })),

  // ── Barberos ─────────────────────────────────────────────────
  ...BARBERS.map(b => ({
    id: `barber-${b.id}`,
    title: b.name,
    subtitle: b.specialty,
    category: 'Barbero',
    categoryColor: colors.moduleBarber,
    icon: 'cut-outline' as keyof typeof Ionicons.glyphMap,
    keywords: [b.specialty, 'corte', 'cabello'],
    onNavigate: (nav: NavProp) =>
      nav.navigate(
        'Barber' as never,
        {
          screen: 'BarberDetail',
          params: { id: b.id },
        } as never,
      ),
  })),

  // ── Piercers ──────────────────────────────────────────────────
  ...PIERCERS.map(p => ({
    id: `piercer-${p.id}`,
    title: p.name,
    subtitle: p.specialty,
    category: 'Piercer',
    categoryColor: colors.modulePiercing,
    icon: 'sparkles-outline' as keyof typeof Ionicons.glyphMap,
    keywords: [p.specialty, 'perforacion'],
    onNavigate: (nav: NavProp) =>
      nav.navigate(
        'Piercing' as never,
        {
          screen: 'PiercingDetail',
          params: { id: p.id },
        } as never,
      ),
  })),

  // ── Servicios de piercing ─────────────────────────────────────
  ...PIERCING_SERVICES.map(s => ({
    id: `psvc-${s.id}`,
    title: s.name,
    subtitle: s.description,
    category: 'Piercing',
    categoryColor: colors.modulePiercing,
    icon: 'sparkles-outline' as keyof typeof Ionicons.glyphMap,
    keywords: ['perforacion', 'joya', 'oreja'],
    onNavigate: goTo('Piercing'),
  })),

  // ── Smoke Shop — categorías ───────────────────────────────────
  ...SMOKE_CATEGORIES.map(c => ({
    id: `smoke-cat-${c.id}`,
    title: c.name,
    subtitle: c.subtitle,
    category: 'Smoke Shop',
    categoryColor: colors.moduleSmokeShop,
    icon: 'leaf-outline' as keyof typeof Ionicons.glyphMap,
    keywords: [c.id, 'smok', 'tienda', ...c.styles.map(s => s.toLowerCase())],
    onNavigate: goTo('SmokeShop'),
  })),

  // ── Smoke Shop — productos individuales ───────────────────────
  ...SMOKE_CATEGORIES.flatMap(c =>
    c.services.map(s => ({
      id: `smoke-prod-${s.id}`,
      title: s.name,
      subtitle: s.description,
      category: 'Smoke Shop',
      categoryColor: colors.moduleSmokeShop,
      icon: 'leaf-outline' as keyof typeof Ionicons.glyphMap,
      keywords: [c.name.toLowerCase(), c.id, 'smok'],
      onNavigate: goTo('SmokeShop'),
    })),
  ),

  // ── Merch — productos ─────────────────────────────────────────
  ...MERCH_PRODUCTS.map(p => ({
    id: `merch-${p.id}`,
    title: p.name,
    subtitle: p.description.slice(0, 60),
    category: 'Merch',
    categoryColor: colors.moduleMerch,
    icon: 'shirt-outline' as keyof typeof Ionicons.glyphMap,
    keywords: [p.category, 'ropa', 'hr', ...p.features.map(f => f.toLowerCase())],
    onNavigate: goTo('Merch'),
  })),

  // ── Resina — categorías ───────────────────────────────────────
  ...RESIN_CATEGORIES.map(c => ({
    id: `resin-cat-${c.id}`,
    title: c.name,
    subtitle: c.subtitle,
    category: 'Resina',
    categoryColor: colors.moduleResin,
    icon: 'color-palette-outline' as keyof typeof Ionicons.glyphMap,
    keywords: ['cuadro', 'resina', 'arte', c.id, 'regalo', 'decoracion'],
    onNavigate: goTo('Resin'),
  })),

  // ── Resina — obras ────────────────────────────────────────────
  ...RESIN_CATEGORIES.flatMap(c =>
    c.artworks.map(a => ({
      id: `resin-art-${a.id}`,
      title: a.title,
      subtitle: `${a.materials} · ${a.size}`,
      category: 'Resina',
      categoryColor: colors.moduleResin,
      icon: 'color-palette-outline' as keyof typeof Ionicons.glyphMap,
      keywords: ['cuadro', 'resina', 'arte', 'pintura', a.artist.toLowerCase()],
      onNavigate: goTo('Resin'),
    })),
  ),
];

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SearchModal({ visible, onClose }: Props) {
  const navigation = useNavigation<NavProp>();
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleShow = () => {
    setQuery('');
    setTimeout(() => inputRef.current?.focus(), 120);
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SEARCH_INDEX.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords.some(k => k.includes(q)),
    );
  }, [query]);

  const handleSelect = (item: SearchItem) => {
    Keyboard.dismiss();
    onClose();
    setTimeout(() => item.onNavigate(navigation), 280);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
      onShow={handleShow}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container} edges={['top']}>
          {/* Barra de búsqueda */}
          <View style={styles.searchBar}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.backBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.inputWrap}>
              <Ionicons name="search" size={17} color={colors.textMuted} />
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Ropa, bong, cuadros, piercings..."
                placeholderTextColor={colors.textMuted}
                value={query}
                onChangeText={setQuery}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
              />
              {query.length > 0 && (
                <TouchableOpacity
                  onPress={() => setQuery('')}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Contenido */}
          {!query.trim() ? (
            <View style={styles.hint}>
              <Ionicons name="search-outline" size={48} color="rgba(255,255,255,0.1)" />
              <Text style={styles.hintTitle}>¿Qué estás buscando?</Text>
              <Text style={styles.hintSub}>Prueba: sudadera, bong, septum, cuadro, julio...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.sectionLabel}>
                {results.length > 0
                  ? `${results.length} resultado${results.length !== 1 ? 's' : ''}`
                  : 'Sin resultados'}
              </Text>
              <FlatList
                data={results}
                keyExtractor={item => item.id}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.result}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconBox, { backgroundColor: item.categoryColor + '22' }]}>
                      <Ionicons name={item.icon} size={20} color={item.categoryColor} />
                    </View>
                    <View style={styles.resultText}>
                      <Text style={styles.resultTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.resultSubtitle} numberOfLines={1}>
                        {item.subtitle}
                      </Text>
                    </View>
                    <View style={[styles.chip, { borderColor: item.categoryColor + '55' }]}>
                      <Text style={[styles.chipText, { color: item.categoryColor }]}>
                        {item.category}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={styles.empty}>
                    <Ionicons name="sad-outline" size={44} color={colors.textMuted} />
                    <Text style={styles.emptyTitle}>Sin resultados</Text>
                    <Text style={styles.emptySubtitle}>Intenta con otro término</Text>
                  </View>
                }
              />
            </>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(10,10,10,0.97)' },
  container: { flex: 1 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    paddingVertical: 0,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  list: { paddingHorizontal: spacing.md, paddingBottom: 120, gap: 4 },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginBottom: 4,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultText: { flex: 1 },
  resultTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: '600',
  },
  resultSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    marginTop: 1,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  hint: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: 80,
  },
  hintTitle: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
  },
  hintSub: {
    color: 'rgba(255,255,255,0.18)',
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  empty: { alignItems: 'center', paddingTop: 60, gap: spacing.sm },
  emptyTitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  emptySubtitle: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
  },
});
