import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '@app/components/Header';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { BarberStackParamList } from '@app/navigation/types';
import { BARBERS } from '../data/barbers';
import { Barber } from '../types';
import BarberCard from '../components/BarberCard';

type Nav = StackNavigationProp<BarberStackParamList, 'BarberHome'>;

export default function BarberHomeScreen() {
  const navigation = useNavigation<Nav>();

  const handleBarberPress = (barber: Barber) => {
    navigation.navigate('BarberDetail', { id: barber.id });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <Header title="Barbería ✂️" />
      <FlatList
        data={BARBERS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <BarberCard barber={item} onPress={handleBarberPress} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={styles.subtitle}>Elige tu barbero</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md, paddingBottom: 100 },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: typography.fontWeight.medium,
  },
});
