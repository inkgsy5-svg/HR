import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';

// Necesario para que el navegador de auth se cierre solo al volver a la app.
WebBrowser.maybeCompleteAuthSession();

export interface GoogleProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

const googleAuthConfig = Constants.expoConfig?.extra?.googleAuth ?? {};

/**
 * Flujo de "Continuar con Google" vía expo-auth-session.
 *
 * Requiere:
 * - Client IDs reales en app.json > extra.googleAuth (hoy son placeholders).
 * - Un development/production build (EAS) — no funciona dentro de Expo Go.
 *
 * Hoy resuelve el perfil directamente contra la API de Google para poder
 * probar el flujo de punta a punta sin backend propio.
 *
 * TODO(AWS): el backend de auth va a ser Cognito, no un endpoint propio
 * (ver docs/06-aws-setup.md § 5.3-5.4 — Cognito User Pool + Google como
 * Federated Identity Provider). Cuando el User Pool y el dominio de
 * Cognito existan, reemplazar este hook para que arme la URL de
 * autorización contra el Hosted UI de Cognito
 * (`https://<AWS_COGNITO_DOMAIN>/oauth2/authorize?identity_provider=Google&...`)
 * en vez de hablar directo con Google, y usar el id_token/access_token
 * que devuelva Cognito (los mismos que ya usa el login por email/password)
 * en vez del perfil crudo de Google. Migrar esto junto con el mock de
 * email/password de LoginScreen/RegisterScreen, no por separado.
 */
export function useGoogleAuth() {
  const [profile, setProfile] = useState<GoogleProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: googleAuthConfig.iosClientId,
    androidClientId: googleAuthConfig.androidClientId,
    webClientId: googleAuthConfig.webClientId,
  });

  useEffect(() => {
    if (response?.type !== 'success') return;

    const accessToken = response.authentication?.accessToken;
    if (!accessToken) return;

    let cancelled = false;

    fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('No se pudo obtener el perfil de Google');
        return res.json();
      })
      .then(data => {
        if (cancelled) return;
        setProfile({
          id: data.id,
          email: data.email,
          name: data.name,
          picture: data.picture,
        });
      })
      .catch(() => {
        if (!cancelled) setError('No se pudo completar el inicio de sesión con Google');
      });

    return () => {
      cancelled = true;
    };
  }, [response]);

  // La app está "resolviendo Google" entre el redirect exitoso y tener perfil o error.
  const isLoading = response?.type === 'success' && !profile && !error;

  return {
    isReady: !!request,
    isLoading,
    profile,
    error,
    signInWithGoogle: promptAsync,
  };
}
