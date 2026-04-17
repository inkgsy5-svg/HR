import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@app/components/Header';
import Button from '@app/components/Button';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { useAuthStore } from '@store/authStore';

export default function ProfileScreen() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <Header title="Perfil" />
      <View style={styles.container}>
        <Text style={styles.name}>{user?.name ?? 'Usuario'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {/* TODO: Implementar perfil completo */}
        <Button title="Cerrar sesión" variant="outline" onPress={logout} style={styles.logoutBtn} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.lg, alignItems: 'center', paddingTop: spacing.xl },
  name: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  email: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.base,
    marginBottom: spacing.xl,
  },
  logoutBtn: { marginTop: 'auto', width: '100%' },
});
