import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@app/components/Header';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';

export default function PromosScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <Header title="Promociones" />
      <View style={styles.container}>
        {/* TODO: Implementar lista de promos con CountdownTimer */}
        <Text style={styles.placeholder}>Promociones del día aparecerán aquí</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.md, alignItems: 'center', justifyContent: 'center' },
  placeholder: { color: colors.textMuted, fontSize: typography.fontSize.base },
});
