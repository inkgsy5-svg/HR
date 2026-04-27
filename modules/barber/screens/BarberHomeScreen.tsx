import React from 'react';
import { View, Text, ImageBackground, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { BarberStackParamList } from '@app/navigation/types';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import BarberCircle from '../components/BarberCircle';
import { BARBERS, Barber } from '../data/barbers';

type NavProp = StackNavigationProp<BarberStackParamList>;

const BANNER = { uri: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800' };

export default function BarberHomeScreen() {
  const navigation = useNavigation<NavProp>();

  function handleBarberPress(barber: Barber) {
    navigation.navigate('BarberDetail', { id: barber.id });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <ImageBackground source={BANNER} style={styles.banner} resizeMode="cover">
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
            style={styles.bannerGradient}
          >
            <Text style={styles.bannerTitle}>Barbería ✂️</Text>
          </LinearGradient>
        </ImageBackground>

        {/* Barberos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Elige tu barbero</Text>
          <View style={styles.barbersGrid}>
            {BARBERS.map(barber => (
              <BarberCircle key={barber.id} barber={barber} onPress={handleBarberPress} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  banner: { width: '100%', height: 220 },
  bannerGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  bannerTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  barbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xl,
  },
});
