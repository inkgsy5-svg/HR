import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '@app/components/Input';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';

export default function SearchScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Buscar</Text>
        <Input placeholder="Busca tatuajes, cortes, productos..." />
        {/* TODO: Implementar SearchResults y FilterChips */}
        <Text style={styles.placeholder}>Resultados aparecerán aquí</Text>
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
});
