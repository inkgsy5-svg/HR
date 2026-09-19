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
import AvatarPicker from '@app/components/AvatarPicker';
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
import { saveMockUser } from '@modules/auth/mockUserDirectory';
import { formatDobInput, dobToISO } from '@utils/dateOfBirth';
import { getDateOfBirthError } from '@utils/validators';

type RegisterNavProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterNavProp>();
  const setUser = useAuthStore(state => state.setUser);
  const showToast = useUIStore(state => state.showToast);

  const [avatarUri, setAvatarUri] = useState<string | undefined>();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
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

  const handleRegister = async () => {
    if (!name || !email || !password || !dob) {
      showToast('Por favor completa todos los campos', 'warning');
      return;
    }
    const dobError = getDateOfBirthError(dob);
    if (dobError) {
      showToast(dobError, 'warning');
      return;
    }
    const dateOfBirth = dobToISO(dob)!;

    setIsLoading(true);
    try {
      // TODO(AWS): reemplazar por Cognito (SignUp / Amplify Auth.signUp)
      // ver docs/06-aws-setup.md § 5 — mismo User Pool que el registro con Google.
      // El atributo de fecha de nacimiento se guarda como custom attribute
      // del User Pool (o en la tabla de perfil extendido) para las promos
      // de cumpleaños.
      // const { user, token } = await authService.register({ name, email, password, dateOfBirth });
      // await setUser(user, token);

      // Mock for development — crear cuenta e iniciar sesión son el mismo
      // paso, igual que con Google/Apple más abajo. Se guarda el nombre y
      // la fecha de nacimiento en el directorio local para que no se
      // pierdan si más tarde inicia sesión con email/contraseña (ver
      // mockUserDirectory.ts).
      const id = `${Date.now()}`;
      await saveMockUser(email, id, name, dateOfBirth, avatarUri);
      await setUser({ id, email, name, dateOfBirth, avatar: avatarUri }, 'mock-token');
      showToast('Cuenta creada exitosamente', 'success');
      finishAuthFlow(navigation);
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
    saveMockUser(
      googleProfile.email,
      googleProfile.id,
      googleProfile.name,
      undefined,
      googleProfile.picture,
    );
    setUser(
      {
        id: googleProfile.id,
        email: googleProfile.email,
        name: googleProfile.name,
        avatar: googleProfile.picture,
      },
      'mock-google-token',
    ).then(() => {
      showToast('Cuenta creada con Google', 'success');
      finishAuthFlow(navigation);
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
    const appleName = appleProfile.name ?? 'Usuario de Apple';
    if (appleProfile.email) saveMockUser(appleProfile.email, appleProfile.id, appleName);
    setUser(
      { id: appleProfile.id, email: appleProfile.email ?? '', name: appleName },
      'mock-apple-token',
    ).then(() => {
      showToast('Cuenta creada con Apple', 'success');
      finishAuthFlow(navigation);
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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.logo}>HR</Text>
            <Text style={styles.title}>Crear cuenta</Text>

            <AvatarPicker uri={avatarUri} onChange={setAvatarUri} />
            <Text style={styles.avatarHint}>Toca para agregar tu foto de perfil</Text>

            <Input
              label="Nombre"
              placeholder="Tu nombre"
              value={name}
              onChangeText={setName}
              wrapperStyle={styles.inputWrapper}
              accentColor={colors.accent}
              labelColor={colors.white}
              textColor={colors.white}
              placeholderTextColor={colors.white}
            />
            <Input
              label="Fecha de nacimiento"
              placeholder="DD/MM/AAAA"
              value={dob}
              onChangeText={text => setDob(formatDobInput(text))}
              keyboardType="number-pad"
              maxLength={10}
              wrapperStyle={styles.inputWrapper}
              accentColor={colors.accent}
              labelColor={colors.white}
              textColor={colors.white}
              placeholderTextColor={colors.white}
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
              labelColor={colors.white}
              textColor={colors.white}
              placeholderTextColor={colors.white}
            />
            <Input
              label="Contraseña"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              wrapperStyle={styles.inputWrapper}
              accentColor={colors.accent}
              labelColor={colors.white}
              textColor={colors.white}
              placeholderTextColor={colors.white}
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
  avatarHint: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
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
