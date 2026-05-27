import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SmokeShopStackParamList } from '@app/navigation/types';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { CATEGORIES } from '../data/categories';

type NavProp = StackNavigationProp<SmokeShopStackParamList>;
type RouteType = RouteProp<SmokeShopStackParamList, 'SmokeShopDetail'>;

export default function SmokeShopDetailScreen() {
  const navigation = useNavigation<NavProp>();
  const { params } = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const [saved, setSaved] = useState(false);

  const category = CATEGORIES.find(c => c.id === params.id);
  if (!category) return null;

  function openWhatsApp() {
    const msg = `Hola, me interesa saber más sobre la categoría: ${category!.name}. ¿Tienen disponibilidad?`;
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
                { backgroundColor: category.availableToday ? colors.success : colors.error },
              ]}
            />
            <Text style={styles.availText}>
              {category.availableToday ? 'Disponible hoy' : 'Stock limitado'}
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

        {/* Estilos / tipos */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: category.color }]}>Tipos disponibles</Text>
          <View style={styles.stylesRow}>
            {category.styles.map(s => (
              <Text key={s} style={styles.styleTag}>
                ✓ {s}
              </Text>
            ))}
          </View>
        </View>

        {/* Productos destacados */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: category.color }]}>Productos destacados</Text>
          <View style={styles.productsGrid}>
            {category.services.map(product => (
              <View key={product.id} style={styles.productCard}>
                <Text style={styles.productIcon}>{product.icon}</Text>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productDesc}>{product.description}</Text>
                  <Text style={[styles.productPrice, { color: category.color }]}>
                    ${product.price.toLocaleString()} MXN
                  </Text>
                </View>
              </View>
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

  hero: { width: '100%', height: 260, alignItems: 'center', justifyContent: 'center' },
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
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
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

  stylesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  styleTag: { color: colors.textSecondary, fontSize: typography.fontSize.sm },

  productsGrid: { gap: spacing.sm },
  productCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardDark,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.md,
  },
  productIcon: { fontSize: 32 },
  productInfo: { flex: 1, gap: 2 },
  productName: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  productDesc: { color: colors.textMuted, fontSize: typography.fontSize.sm },
  productPrice: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    marginTop: 2,
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
