import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import Input from '@app/components/Input';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { ARTISTS } from '@modules/tattoo/data/artists';
import { BARBERS } from '@modules/barber/data/barbers';
import { PIERCERS } from '@modules/piercing/data/piercers';
import { CATEGORIES as SMOKE_CATEGORIES } from '@modules/smoke-shop/data/categories';
import { RESIN_CATEGORIES } from '@modules/resin/data/categories';
import { MERCH_PRODUCTS } from '@modules/merch/data/products';

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  moduleLabel: string;
  moduleColor: string;
  image?: number;
  icon?: string;
  navigate: (navigation: NavigationProp<ParamListBase>) => void;
};

function buildIndex(): SearchResult[] {
  const items: SearchResult[] = [];

  ARTISTS.forEach(a =>
    items.push({
      id: `tattoo-${a.id}`,
      title: a.name,
      subtitle: `Tatuajes · ${a.specialty}`,
      moduleLabel: 'Tatuajes',
      moduleColor: colors.moduleTattoo,
      image: a.image,
      navigate: nav => nav.navigate('Tattoo', { screen: 'TattooDetail', params: { id: a.id } }),
    }),
  );

  BARBERS.forEach(b =>
    items.push({
      id: `barber-${b.id}`,
      title: b.name,
      subtitle: `Barber · ${b.specialty}`,
      moduleLabel: 'Barber',
      moduleColor: colors.moduleBarber,
      image: b.image,
      navigate: nav => nav.navigate('Barber', { screen: 'BarberDetail', params: { id: b.id } }),
    }),
  );

  PIERCERS.forEach(p =>
    items.push({
      id: `piercing-${p.id}`,
      title: p.name,
      subtitle: `Perforaciones · ${p.specialty}`,
      moduleLabel: 'Perforaciones',
      moduleColor: colors.modulePiercing,
      image: p.image,
      navigate: nav => nav.navigate('Piercing', { screen: 'PiercingDetail', params: { id: p.id } }),
    }),
  );

  SMOKE_CATEGORIES.forEach(c => {
    items.push({
      id: `smoke-${c.id}`,
      title: c.name,
      subtitle: `Smoke Shop · ${c.subtitle}`,
      moduleLabel: 'Smoke Shop',
      moduleColor: colors.moduleSmokeShop,
      icon: c.icon,
      navigate: nav =>
        nav.navigate('SmokeShop', { screen: 'SmokeShopDetail', params: { id: c.id } }),
    });
    c.services.forEach(s =>
      items.push({
        id: `smoke-item-${s.id}`,
        title: s.name,
        subtitle: `Smoke Shop · ${c.name}`,
        moduleLabel: 'Smoke Shop',
        moduleColor: colors.moduleSmokeShop,
        icon: s.icon,
        navigate: nav =>
          nav.navigate('SmokeShop', { screen: 'SmokeShopDetail', params: { id: c.id } }),
      }),
    );
  });

  RESIN_CATEGORIES.forEach(c => {
    items.push({
      id: `resin-${c.id}`,
      title: c.name,
      subtitle: `Cuadros de Resina · ${c.subtitle}`,
      moduleLabel: 'Cuadros de Resina',
      moduleColor: colors.moduleResin,
      icon: c.icon,
      navigate: nav => nav.navigate('Resin', { screen: 'ResinDetail', params: { id: c.id } }),
    });
    c.artworks.forEach(a =>
      items.push({
        id: `resin-item-${a.id}`,
        title: a.title,
        subtitle: `Cuadros de Resina · ${c.name}`,
        moduleLabel: 'Cuadros de Resina',
        moduleColor: colors.moduleResin,
        image: a.image,
        navigate: nav => nav.navigate('Resin', { screen: 'ResinDetail', params: { id: c.id } }),
      }),
    );
  });

  MERCH_PRODUCTS.forEach(p =>
    items.push({
      id: `merch-${p.id}`,
      title: p.name,
      subtitle: 'Merch HR',
      moduleLabel: 'Merch',
      moduleColor: colors.moduleMerch,
      image: p.image,
      navigate: nav => nav.navigate('Merch'),
    }),
  );

  return items;
}

const SEARCH_INDEX = buildIndex();

function normalize(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function HighlightedText({
  text,
  query,
  style,
  highlightStyle,
  numberOfLines,
}: {
  text: string;
  query: string;
  style: StyleProp<TextStyle>;
  highlightStyle: StyleProp<TextStyle>;
  numberOfLines?: number;
}) {
  if (!query) {
    return (
      <Text style={style} numberOfLines={numberOfLines}>
        {text}
      </Text>
    );
  }

  const idx = normalize(text).indexOf(query);
  if (idx === -1) {
    return (
      <Text style={style} numberOfLines={numberOfLines}>
        {text}
      </Text>
    );
  }

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);

  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {before}
      <Text style={highlightStyle}>{match}</Text>
      {after}
    </Text>
  );
}

export default function SearchScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const q = normalize(query.trim());

  const results = useMemo(() => {
    if (!q) return [];
    return SEARCH_INDEX.filter(
      item => normalize(item.title).includes(q) || normalize(item.subtitle).includes(q),
    ).slice(0, 40);
  }, [q]);

  function renderItem({ item }: { item: SearchResult }) {
    return (
      <TouchableOpacity
        style={styles.resultRow}
        activeOpacity={0.8}
        onPress={() => item.navigate(navigation)}
      >
        {item.image ? (
          <Image source={item.image} style={styles.resultThumb} resizeMode="cover" />
        ) : (
          <View style={[styles.resultThumb, styles.resultThumbIcon]}>
            <Text style={styles.resultIconText}>{item.icon ?? '🔎'}</Text>
          </View>
        )}
        <View style={styles.resultInfo}>
          <HighlightedText
            text={item.title}
            query={q}
            style={styles.resultTitle}
            highlightStyle={styles.resultHighlight}
            numberOfLines={1}
          />
          <HighlightedText
            text={item.subtitle}
            query={q}
            style={styles.resultSubtitle}
            highlightStyle={styles.resultHighlightSubtitle}
            numberOfLines={1}
          />
        </View>
        <View style={[styles.moduleTag, { backgroundColor: item.moduleColor + '33' }]}>
          <Text style={[styles.moduleTagText, { color: item.moduleColor }]}>
            {item.moduleLabel}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Buscar</Text>
        <Input
          placeholder="Busca tatuajes, cortes, productos..."
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          returnKeyType="search"
          accentColor={colors.gold}
        />

        {query.trim().length === 0 && (
          <Text style={styles.placeholder}>Escribe algo para buscar en todos los módulos</Text>
        )}

        {query.trim().length > 0 && results.length === 0 && (
          <Text style={styles.placeholder}>No encontramos resultados para &quot;{query}&quot;</Text>
        )}

        <FlatList
          style={styles.resultsListContainer}
          data={results}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.md },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.md,
  },
  placeholder: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
  resultsListContainer: { flex: 1 },
  resultsList: { paddingTop: spacing.sm, paddingBottom: 140, gap: spacing.sm },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.cardDark,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  resultThumb: { width: 48, height: 48, borderRadius: borderRadius.sm },
  resultThumbIcon: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultIconText: { fontSize: 22 },
  resultInfo: { flex: 1, gap: 2 },
  resultTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  resultSubtitle: { color: colors.textSecondary, fontSize: typography.fontSize.sm },
  resultHighlight: { color: colors.gold, fontWeight: typography.fontWeight.bold },
  resultHighlightSubtitle: { color: colors.gold, fontWeight: typography.fontWeight.bold },
  moduleTag: {
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  moduleTagText: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold },
});
