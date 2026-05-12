import React from 'react';
import { View, Text, ImageBackground, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { PiercingStackParamList } from '@app/navigation/types';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import PiercerCircle from '../components/PiercerCircle';
import { PIERCERS, Piercer } from '../data/piercers';

type NavProp = StackNavigationProp<PiercingStackParamList>;

const BANNER = require('../../../assets/images/piercing/gera/gallery-1.jpeg');

export default function PiercingHomeScreen() {
  const navigation = useNavigation<NavProp>();

  function handlePiercerPress(piercer: Piercer) {
    navigation.navigate('PiercingDetail', { id: piercer.id });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground source={BANNER} style={styles.banner} resizeMode="cover">
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
            style={styles.bannerGradient}
          >
            <Text style={styles.bannerTitle}>Piercing 💎</Text>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Elige tu perforador</Text>
          <View style={styles.piercersGrid}>
            {PIERCERS.map(piercer => (
              <PiercerCircle key={piercer.id} piercer={piercer} onPress={handlePiercerPress} />
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
  piercersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xl,
  },
});
