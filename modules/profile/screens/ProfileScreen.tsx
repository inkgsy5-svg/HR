import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { AppStackParamList } from '@app/navigation/types';
import Header from '@app/components/Header';
import Button from '@app/components/Button';
import AvatarPicker from '@app/components/AvatarPicker';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { useAuthStore } from '@store/authStore';
import { useBookingHistoryStore, BookingHistoryItem } from '@store/bookingHistoryStore';
import { findMockUser, saveMockUser } from '@modules/auth/mockUserDirectory';

type NavProp = StackNavigationProp<AppStackParamList>;

// Altura del tab bar flotante (62) + separación del borde (12) + margen extra
// para que el botón no quede tapado por el menú inferior.
const TAB_BAR_CLEARANCE = 62 + 12 + spacing.lg;

const MODULE_ICON: Record<BookingHistoryItem['module'], string> = {
  barber: '✂️',
  tattoo: '🖊️',
  piercing: '💎',
  'smoke-shop': '💨',
  music: '🎵',
  resin: '🎨',
};

function formatBookingDay(key: string) {
  const d = new Date(key + 'T12:00:00');
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

function BookingHistoryCard({ item }: { item: BookingHistoryItem }) {
  return (
    <View style={styles.historyCard}>
      <Text style={styles.historyIcon}>{MODULE_ICON[item.module]}</Text>
      <View style={styles.historyInfo}>
        <Text style={styles.historyName}>{item.professionalName}</Text>
        <Text style={styles.historyMeta}>
          {formatBookingDay(item.day)} · {item.slot}
        </Text>
        {item.services.length > 0 && (
          <Text style={styles.historyServices} numberOfLines={1}>
            {item.services.join(' · ')}
          </Text>
        )}
      </View>
      {item.total > 0 && <Text style={styles.historyTotal}>${item.total}</Text>}
    </View>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation<NavProp>();
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);
  const logout = useAuthStore(state => state.logout);
  const updateAvatar = useAuthStore(state => state.updateAvatar);
  const bookings = useBookingHistoryStore(state => state.items);
  const insets = useSafeAreaInsets();

  async function handleAvatarChange(uri: string) {
    await updateAvatar(uri);
    // Mantiene el directorio local en sync para que la foto también
    // aparezca si vuelve a iniciar sesión con email/contraseña.
    if (user?.email) {
      const known = await findMockUser(user.email);
      await saveMockUser(user.email, user.id, user.name, known?.dateOfBirth, uri);
    }
  }

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
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + TAB_BAR_CLEARANCE },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AvatarPicker uri={user?.avatar} onChange={handleAvatarChange} size={96} />
        <Text style={styles.name}>{user?.name ?? 'Usuario'}</Text>

        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Historial</Text>
          {bookings.length === 0 ? (
            <View style={styles.historyEmpty}>
              <Text style={styles.historyEmptyText}>
                Aún no tienes nada en tu historial. Cuando agendes un tatuaje, piercing o corte, o
                hagas una compra, aparecerá aquí.
              </Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {bookings.map(item => (
                <BookingHistoryCard key={item.id} item={item} />
              ))}
            </View>
          )}
        </View>

        <Button
          title="Cerrar sesión"
          variant="outline"
          onPress={logout}
          style={styles.logoutBtn}
          textStyle={styles.logoutBtnText}
        />
      </ScrollView>
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
  container: { padding: spacing.lg, alignItems: 'center', paddingTop: spacing.xl },
  name: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },

  // Historial (citas y compras)
  historySection: { width: '100%', marginBottom: spacing.xl },
  historyTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  historyEmpty: {
    width: '100%',
    backgroundColor: colors.cardDark,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: spacing.md,
  },
  historyEmptyText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
  historyList: { width: '100%', gap: spacing.sm },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardDark,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  historyIcon: { fontSize: 24, width: 32, textAlign: 'center' },
  historyInfo: { flex: 1, gap: 2 },
  historyName: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  historyMeta: { color: colors.textSecondary, fontSize: typography.fontSize.xs },
  historyServices: { color: colors.textMuted, fontSize: typography.fontSize.xs },
  historyTotal: {
    color: colors.accent,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },

  logoutBtn: { width: '100%', borderColor: colors.accent },
  logoutBtnText: { color: colors.accent },
});
