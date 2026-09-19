import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthStackParamList } from '@app/navigation/types';
import Button from '@app/components/Button';
import Input from '@app/components/Input';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { useAuthStore } from '@store/authStore';
import { useUIStore } from '@store/uiStore';
import { finishAuthFlow } from '@store/pendingActionStore';
import { useGoogleAuth } from '@modules/auth/hooks/useGoogleAuth';
import GoogleButton from '@modules/auth/components/GoogleButton';
import { useAppleAuth } from '@modules/auth/hooks/useAppleAuth';
import AppleButton from '@modules/auth/components/AppleButton';
import { findMockUser, nameFromEmail } from '@modules/auth/mockUserDirectory';

type LoginNavProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNavProp>();
  const setUser = useAuthStore(state => state.setUser);
  const showToast = useUIStore(state => state.showToast);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    profile: googleProfile,
    error: googleError,
    isLoading: isGoogleLoading,
    signInWithGoogle,
  } = useGoogleAuth();

  const {
    isAvailable: isAppleAvailable,
    profile: appleProfile,
    error: appleError,
    signInWithApple,
  } = useAppleAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Por favor completa todos los campos', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      // TODO(AWS): reemplazar por Cognito (InitiateAuth / Amplify Auth.signIn)
      // ver docs/06-aws-setup.md § 5 — mismo User Pool que el login con Google.
      // const { user, token } = await authService.login({ email, password });
      // await setUser(user, token);

      // Mock for development — usa el nombre real que se dio al registrarse
      // (ver mockUserDirectory.ts); si el correo no está registrado en este
      // dispositivo, deriva un nombre del correo en vez de uno fijo.
      const known = await findMockUser(email);
      const name = known?.name ?? nameFromEmail(email);
      await setUser(
        {
          id: known?.id ?? '1',
          email,
          name,
          dateOfBirth: known?.dateOfBirth,
          avatar: known?.avatar,
        },
        'mock-token',
      );
      showToast('Sesión iniciada', 'success');
      finishAuthFlow(navigation);
    } catch {
      showToast('Credenciales incorrectas', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!googleProfile) return;
    // TODO(AWS): reemplazar por el login federado de Cognito (Google como
    // Identity Provider, ver docs/06-aws-setup.md § 5.4) y usar el token
    // que devuelva Cognito en vez del perfil de Google crudo. Migrar junto
    // con handleLogin (mismo User Pool para ambos, no por separado).
    setUser(
      {
        id: googleProfile.id,
        email: googleProfile.email,
        name: googleProfile.name,
        avatar: googleProfile.picture,
      },
      'mock-google-token',
    ).then(() => {
      showToast('Sesión iniciada con Google', 'success');
      finishAuthFlow(navigation);
    });
  }, [googleProfile, navigation, setUser, showToast]);

  useEffect(() => {
    if (googleError) showToast(googleError, 'error');
  }, [googleError, showToast]);

  useEffect(() => {
    if (!appleProfile) return;
    // TODO(AWS): reemplazar por el login federado de Cognito (Apple como
    // Identity Provider, ver docs/06-aws-setup.md § 5.5) y usar el token
    // que devuelva Cognito en vez del identityToken crudo de Apple. Migrar
    // junto con Google y handleLogin (mismo User Pool para los tres, no
    // por separado).
    setUser(
      {
        id: appleProfile.id,
        email: appleProfile.email ?? '',
        name: appleProfile.name ?? 'Usuario de Apple',
      },
      'mock-apple-token',
    ).then(() => {
      showToast('Sesión iniciada con Apple', 'success');
      finishAuthFlow(navigation);
    });
  }, [appleProfile, navigation, setUser, showToast]);

  useEffect(() => {
    if (appleError) showToast(appleError, 'error');
  }, [appleError, showToast]);

  return (
    <ImageBackground
      source={require('../../../assets/images/auth/login-bg.jpeg')}
      style={styles.bg}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.8)']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.logo}>HR</Text>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

            <Input
              label="Correo electrónico"
              placeholder="correo@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              wrapperStyle={styles.inputWrapper}
              accentColor={colors.accent}
              placeholderTextColor="rgba(255,255,255,0.6)"
            />
            <Input
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              wrapperStyle={styles.inputWrapper}
              accentColor={colors.accent}
              placeholderTextColor="rgba(255,255,255,0.6)"
              rightIcon={
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="rgba(255,255,255,0.7)"
                />
              }
              onRightIconPress={() => setShowPassword(v => !v)}
            />

            <Button
              title="Iniciar sesión"
              onPress={handleLogin}
              isLoading={isLoading}
              fullWidth
              style={{ ...styles.loginBtn, backgroundColor: colors.accent }}
              textStyle={{ color: colors.textOnAccent }}
            />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            <GoogleButton onPress={() => signInWithGoogle()} isLoading={isGoogleLoading} />
            {isAppleAvailable && <AppleButton onPress={signInWithApple} />}

            <Button
              title="¿No tienes cuenta? Regístrate"
              variant="ghost"
              onPress={() => navigation.navigate('Register')}
              fullWidth
              textStyle={{ color: colors.accent }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: { flexGrow: 1, padding: spacing.lg, justifyContent: 'center' },
  inputWrapper: { backgroundColor: 'rgba(255,255,255,0.14)' },
  logo: {
    color: colors.accent,
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.base,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  loginBtn: { marginTop: spacing.md, marginBottom: spacing.sm },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  dividerText: {
    color: colors.textSecondary,
    marginHorizontal: spacing.sm,
    fontSize: typography.fontSize.sm,
  },
});
