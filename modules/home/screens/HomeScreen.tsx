import React from 'react';
import { Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@app/navigation/types';
import Header from '@app/components/Header';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';

type HomeNavProp = StackNavigationProp<AppStackParamList>;

const MODULES = [
  { id: 'tattoo', label: 'Tatuajes', icon: '🗡️', screen: 'Tattoo' as const },
  { id: 'barber', label: 'Barbería', icon: '✂️', screen: 'Barber' as const },
  { id: 'smoke-shop', label: 'Smoke Shop', icon: '🚬', screen: 'SmokeShop' as const },
  { id: 'music', label: 'Música', icon: '🎵', screen: 'Music' as const },
  { id: 'piercing', label: 'Piercing', icon: '💎', screen: 'Piercing' as const },
  { id: 'resin', label: 'Resina', icon: '🖼️', screen: 'Resin' as const },
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <Header
        showLogo
        onSearchPress={() => navigation.navigate('MainTabs', { screen: 'Search' })}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Haciéndolo Real</Text>
        <Text style={styles.subtitle}>¿Qué buscas hoy?</Text>

        <FlatList
          data={MODULES}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => navigation.navigate(item.screen as keyof AppStackParamList)}
              activeOpacity={0.8}
            >
              <Text style={styles.moduleIcon}>{item.icon}</Text>
              <Text style={styles.moduleLabel}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  greeting: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.base,
    marginBottom: spacing.lg,
  },
  row: { justifyContent: 'space-between', marginBottom: spacing.md },
  moduleCard: {
    flex: 0.48,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 120,
    justifyContent: 'center',
  },
  moduleIcon: { fontSize: 36, marginBottom: spacing.sm },
  moduleLabel: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
});
