import { create } from 'zustand';

interface PendingActionState {
  pendingAction: (() => void) | null;
  setPendingAction: (fn: () => void) => void;
  runPendingAction: () => void;
  clearPendingAction: () => void;
}

/**
 * Guarda una acción (agendar, comprar, etc.) que el usuario intentó hacer
 * sin sesión iniciada, para retomarla justo después de loguearse.
 * Ver `useRequireAuth` (quien la guarda) y `finishAuthFlow` (quien la retoma).
 */
export const usePendingActionStore = create<PendingActionState>((set, get) => ({
  pendingAction: null,

  setPendingAction: fn => set({ pendingAction: fn }),

  runPendingAction: () => {
    const fn = get().pendingAction;
    set({ pendingAction: null });
    fn?.();
  },

  clearPendingAction: () => set({ pendingAction: null }),
}));

interface AuthFlowNavigation {
  getParent: () => { goBack: () => void } | undefined;
}

/**
 * Cierra el modal de Login/Registro y retoma la acción que el usuario
 * quería hacer antes de que se le pidiera iniciar sesión (si había alguna).
 * Úsalo en vez de `navigation.getParent()?.goBack()` tras un login exitoso.
 */
export function finishAuthFlow(navigation: AuthFlowNavigation) {
  navigation.getParent()?.goBack();
  usePendingActionStore.getState().runPendingAction();
}
