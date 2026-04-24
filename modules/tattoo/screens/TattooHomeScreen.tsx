import React from 'react';
import { View, Text, ImageBackground, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { TattooStackParamList } from '@app/navigation/types';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import ArtistCircle from '../components/ArtistCircle';
import { ARTISTS, Artist } from '../data/artists';

type NavProp = StackNavigationProp<TattooStackParamList>;

export default function TattooHomeScreen() {
  const navigation = useNavigation<NavProp>();

  function handleArtistPress(artist: Artist) {
    navigation.navigate('TattooDetail', { id: artist.id });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <ImageBackground
          source={require('../../../assets/images/tattoo/tattoo-artists.jpg')}
          style={styles.banner}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
            style={styles.bannerGradient}
          >
            <Text style={styles.bannerTitle}>Tatuajes</Text>
          </LinearGradient>
        </ImageBackground>

        {/* Artistas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Elige tu artista</Text>
          <View style={styles.artistsRow}>
            {ARTISTS.map(artist => (
              <ArtistCircle key={artist.id} artist={artist} onPress={handleArtistPress} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  banner: {
    width: '100%',
    height: 220,
  },
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
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  artistsRow: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
});
