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
import { AuthStackParamList } from '@app/navigation/types';
import Button from '@app/components/Button';
import Input from '@app/components/Input';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { useAuthStore } from '@store/authStore';
import { useUIStore } from '@store/uiStore';
import { useGoogleAuth } from '@modules/auth/hooks/useGoogleAuth';
import GoogleButton from '@modules/auth/components/GoogleButton';
import { useAppleAuth } from '@modules/auth/hooks/useAppleAuth';
import AppleButton from '@modules/auth/components/AppleButton';

type RegisterNavProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterNavProp>();
  const setUser = useAuthStore(state => state.setUser);
  const showToast = useUIStore(state => state.showToast);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleRegister = async () => {
    if (!name || !email || !password) {
      showToast('Por favor completa todos los campos', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      // TODO(AWS): reemplazar por Cognito (SignUp / Amplify Auth.signUp)
      // ver docs/06-aws-setup.md § 5 — mismo User Pool que el registro con Google.
      // await authService.register({ name, email, password });
      showToast('Cuenta creada exitosamente', 'success');
      navigation.navigate('Login');
    } catch {
      showToast('Error al crear la cuenta', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!googleProfile) return;
    // Con Google, crear cuenta e iniciar sesión son el mismo paso.
    // TODO(AWS): reemplazar por el login federado de Cognito (Google como
    // Identity Provider, ver docs/06-aws-setup.md § 5.4) y usar el token
    // que devuelva Cognito en vez del perfil de Google crudo. Migrar junto
    // con handleRegister (mismo User Pool para ambos, no por separado).
    setUser(
      { id: googleProfile.id, email: googleProfile.email, name: googleProfile.name },
      'mock-google-token',
    ).then(() => {
      showToast('Cuenta creada con Google', 'success');
      navigation.getParent()?.goBack();
    });
  }, [googleProfile, navigation, setUser, showToast]);

  useEffect(() => {
    if (googleError) showToast(googleError, 'error');
  }, [googleError, showToast]);

  useEffect(() => {
    if (!appleProfile) return;
    // Con Apple, crear cuenta e iniciar sesión son el mismo paso.
    // TODO(AWS): reemplazar por el login federado de Cognito (Apple como
    // Identity Provider, ver docs/06-aws-setup.md § 5.5) y usar el token
    // que devuelva Cognito en vez del identityToken crudo de Apple. Migrar
    // junto con Google y handleRegister (mismo User Pool para los tres, no
    // por separado).
    setUser(
      {
        id: appleProfile.id,
        email: appleProfile.email ?? '',
        name: appleProfile.name ?? 'Usuario de Apple',
      },
      'mock-apple-token',
    ).then(() => {
      showToast('Cuenta creada con Apple', 'success');
      navigation.getParent()?.goBack();
    });
  }, [appleProfile, navigation, setUser, showToast]);

  useEffect(() => {
    if (appleError) showToast(appleError, 'error');
  }, [appleError, showToast]);

  return (
    <ImageBackground
      source={require('../../../assets/images/auth/register-bg.jpeg')}
      style={styles.bg}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.8)']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.logo}>HR</Text>
            <Text style={styles.title}>Crear cuenta</Text>

            <Input
              label="Nombre"
              placeholder="Tu nombre"
              value={name}
              onChangeText={setName}
              wrapperStyle={styles.inputWrapper}
              accentColor={colors.accent}
              placeholderTextColor="rgba(255,255,255,0.6)"
            />
            <Input
              label="Correo electrónico"
              placeholder="correo@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              wrapperStyle={styles.inputWrapper}
              accentColor={colors.accent}
              placeholderTextColor="rgba(255,255,255,0.6)"
            />
            <Input
              label="Contraseña"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              wrapperStyle={styles.inputWrapper}
              accentColor={colors.accent}
              placeholderTextColor="rgba(255,255,255,0.6)"
            />

            <Button
              title="Registrarse"
              onPress={handleRegister}
              isLoading={isLoading}
              fullWidth
              style={{ ...styles.btn, backgroundColor: colors.accent }}
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
              title="¿Ya tienes cuenta? Inicia sesión"
              variant="ghost"
              onPress={() => navigation.navigate('Login')}
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
    marginBottom: spacing.xl,
  },
  btn: { marginTop: spacing.md, marginBottom: spacing.sm },
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
