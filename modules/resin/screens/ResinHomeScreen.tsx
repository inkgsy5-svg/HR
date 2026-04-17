import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@app/components/Header';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';

export default function ResinHomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <Header title="Resina 🖼️" />
      <View style={styles.container}>
        {/* TODO: Implementar ResinCard y CustomOrderForm */}
        <Text style={styles.placeholder}>Módulo de Resina — En desarrollo</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.md },
  placeholder: { color: colors.textMuted, fontSize: typography.fontSize.base },
});
