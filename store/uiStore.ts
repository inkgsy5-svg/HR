import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface UIState {
  isLoading: boolean;
  toasts: Toast[];

  showLoading: () => void;
  hideLoading: () => void;
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>(set => ({
  isLoading: false,
  toasts: [],

  showLoading: () => set({ isLoading: true }),
  hideLoading: () => set({ isLoading: false }),

  showToast: (message, type = 'info') => {
    const id = Date.now().toString();
    set(state => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 3500);
  },

  removeToast: id => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}));
