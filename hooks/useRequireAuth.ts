import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@app/navigation/types';
import { useAuthStore } from '@store/authStore';
import { usePendingActionStore } from '@store/pendingActionStore';

type AppNavProp = StackNavigationProp<AppStackParamList>;

/**
 * Envuelve una acción que requiere sesión (agendar, comprar, etc.).
 * Si hay sesión iniciada, la ejecuta de inmediato. Si no, la guarda y abre
 * el login — al iniciar sesión se retoma sola (ver `finishAuthFlow`).
 *
 * Uso:
 *   const requireAuth = useRequireAuth();
 *   const handleBook = () => requireAuth(() => appNavigation.navigate('Booking', {...}));
 */
export function useRequireAuth() {
  const navigation = useNavigation<AppNavProp>();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const setPendingAction = usePendingActionStore(state => state.setPendingAction);

  return (action: () => void) => {
    if (isAuthenticated) {
      action();
      return;
    }
    setPendingAction(action);
    navigation.navigate('Auth', { screen: 'Login' });
  };
}
