import React, { useState } from 'react';
import { Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@app/navigation/types';
import Button from '@app/components/Button';
import Input from '@app/components/Input';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { useAuthStore } from '@store/authStore';
import { useUIStore } from '@store/uiStore';

type LoginNavProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNavProp>();
  const setUser = useAuthStore(state => state.setUser);
  const showToast = useUIStore(state => state.showToast);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Por favor completa todos los campos', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      // TODO: Replace with real auth service call
      // const { user, token } = await authService.login({ email, password });
      // await setUser(user, token);

      // Mock for development
      await setUser({ id: '1', email, name: 'Dev User' }, 'mock-token');
    } catch {
      showToast('Credenciales incorrectas', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
          />
          <Input
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title="Iniciar sesión"
            onPress={handleLogin}
            isLoading={isLoading}
            fullWidth
            style={styles.loginBtn}
          />

          <Button
            title="¿No tienes cuenta? Regístrate"
            variant="ghost"
            onPress={() => navigation.navigate('Register')}
            fullWidth
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  container: { flexGrow: 1, padding: spacing.lg, justifyContent: 'center' },
  logo: {
    color: colors.secondary,
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
});
