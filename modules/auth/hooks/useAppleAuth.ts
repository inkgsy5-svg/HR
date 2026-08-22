import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';

export interface AppleProfile {
  /** Identificador estable de Apple para este usuario + esta app. No cambia entre logins. */
  id: string;
  email: string | null;
  name: string | null;
}

/**
 * Flujo de "Continuar con Apple" vía expo-apple-authentication.
 *
 * Solo disponible en iOS 13+ (Android/web nunca lo ofrecen — hay que
 * chequear `isAvailable` antes de mostrar el botón).
 *
 * Apple solo entrega `email` y `fullName` la PRIMERA vez que un usuario
 * autoriza esta app con su Apple ID — en logins posteriores vienen `null`
 * aunque el usuario sea el mismo. Por eso el `id` (campo `user` de Apple)
 * es el identificador confiable para reconocer al usuario, no el email.
 *
 * TODO(AWS): el backend de auth va a ser Cognito, no un endpoint propio
 * (ver docs/06-aws-setup.md § 5.5 — Apple como Federated Identity Provider).
 * Cuando exista, reemplazar signInWithApple para que autentique contra el
 * Hosted UI de Cognito (identity_provider=SignInWithApple) y usar el token
 * que devuelva Cognito en vez del `identityToken` crudo de Apple. Migrar
 * junto con Google y el mock de email/password, no por separado.
 */
export function useAppleAuth() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [profile, setProfile] = useState<AppleProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    AppleAuthentication.isAvailableAsync().then(setIsAvailable);
  }, []);

  const signInWithApple = async () => {
    setError(null);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const fullName = credential.fullName
        ? [credential.fullName.givenName, credential.fullName.familyName].filter(Boolean).join(' ')
        : null;

      setProfile({
        id: credential.user,
        email: credential.email,
        name: fullName || null,
      });
    } catch (err: unknown) {
      // El usuario canceló el diálogo — no es un error real, no mostrar toast.
      if ((err as { code?: string })?.code === 'ERR_REQUEST_CANCELED') return;
      setError('No se pudo completar el inicio de sesión con Apple');
    }
  };

  return { isAvailable, profile, error, signInWithApple };
}
