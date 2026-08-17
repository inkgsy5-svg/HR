import React from 'react';
import { View, Text, ImageBackground, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { AppStackParamList } from '@app/navigation/types';
import Header from '@app/components/Header';
import Button from '@app/components/Button';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { useAuthStore } from '@store/authStore';

type NavProp = StackNavigationProp<AppStackParamList>;

// Altura del tab bar flotante (62) + separación del borde (12) + margen extra
// para que el botón no quede tapado por el menú inferior.
const TAB_BAR_CLEARANCE = 62 + 12 + spacing.lg;

export default function ProfileScreen() {
  const navigation = useNavigation<NavProp>();
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);
  const logout = useAuthStore(state => state.logout);
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <Header title="Perfil" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <ImageBackground
        source={require('../../../assets/images/brand/hr-mayan-background.jpeg')}
        style={styles.guestBg}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.8)']}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.guestSafe} edges={['left', 'right', 'top']}>
          <View style={styles.guestContainer}>
            <Text style={styles.guestTitle}>Aún no has iniciado sesión</Text>
            <Text style={styles.guestSubtitle}>
              Inicia sesión o crea una cuenta para ver tu perfil y guardar tus datos.
            </Text>

            <View style={styles.guestActions}>
              <Button
                title="Iniciar sesión"
                fullWidth
                onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
                style={styles.guestPrimaryBtn}
                textStyle={styles.guestPrimaryBtnText}
              />
              <Button
                title="Crear cuenta"
                variant="outline"
                fullWidth
                onPress={() => navigation.navigate('Auth', { screen: 'Register' })}
                style={styles.guestOutlineBtn}
                textStyle={styles.guestOutlineBtnText}
              />
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <Header title="Perfil" />
      <View style={styles.container}>
        <Text style={styles.name}>{user?.name ?? 'Usuario'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {/* TODO: Implementar perfil completo */}
        <Button
          title="Cerrar sesión"
          variant="outline"
          onPress={logout}
          style={{ ...styles.logoutBtn, marginBottom: insets.bottom + TAB_BAR_CLEARANCE }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Estado invitado
  guestBg: { flex: 1, backgroundColor: colors.background },
  guestSafe: { flex: 1, backgroundColor: 'transparent' },
  guestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.xs,
  },
  guestTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  guestSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  guestActions: { width: '100%', gap: spacing.sm },
  guestPrimaryBtn: { backgroundColor: colors.accent },
  guestPrimaryBtnText: { color: colors.textOnAccent },
  guestOutlineBtn: { borderColor: colors.accent },
  guestOutlineBtnText: { color: colors.accent },

  // Estado autenticado
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
