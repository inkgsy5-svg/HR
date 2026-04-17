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
import { useUIStore } from '@store/uiStore';

type RegisterNavProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterNavProp>();
  const showToast = useUIStore(state => state.showToast);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      showToast('Por favor completa todos los campos', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      // TODO: Replace with real auth service call
      // await authService.register({ name, email, password });
      showToast('Cuenta creada exitosamente', 'success');
      navigation.navigate('Login');
    } catch {
      showToast('Error al crear la cuenta', 'error');
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
          <Text style={styles.title}>Crear cuenta</Text>

          <Input label="Nombre" placeholder="Tu nombre" value={name} onChangeText={setName} />
          <Input
            label="Correo electrónico"
            placeholder="correo@ejemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Contraseña"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title="Registrarse"
            onPress={handleRegister}
            isLoading={isLoading}
            fullWidth
            style={styles.btn}
          />
          <Button
            title="¿Ya tienes cuenta? Inicia sesión"
            variant="ghost"
            onPress={() => navigation.navigate('Login')}
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
    marginBottom: spacing.xl,
  },
  btn: { marginTop: spacing.md, marginBottom: spacing.sm },
});
