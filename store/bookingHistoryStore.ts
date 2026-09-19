import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { BookingModule } from '@app/booking/booking.types';

export interface BookingHistoryItem {
  id: string;
  module: BookingModule;
  professionalName: string;
  day: string;
  slot: string;
  total: number;
  services: string[];
  status: 'confirmed';
  createdAt: string; // ISO
}

interface BookingHistoryState {
  items: BookingHistoryItem[];
  isLoaded: boolean;
  loadHistory: () => Promise<void>;
  addBooking: (item: Omit<BookingHistoryItem, 'id' | 'status' | 'createdAt'>) => Promise<void>;
}

const HISTORY_KEY = 'hr_booking_history';

// NOTA: esto es un mock local mientras no existe backend real (ver
// services/api/endpoints.ts). Cuando exista, este store se reemplaza por un
// fetch a `/bookings/mine` con react-query, y `addBooking` pasa a ser el
// POST que hoy falta en BookingConfirmScreen — el backend filtra por el
// usuario del JWT, no por lo que guarde el cliente.
export const useBookingHistoryStore = create<BookingHistoryState>((set, get) => ({
  items: [],
  isLoaded: false,

  loadHistory: async () => {
    try {
      const raw = await SecureStore.getItemAsync(HISTORY_KEY);
      set({ items: raw ? (JSON.parse(raw) as BookingHistoryItem[]) : [], isLoaded: true });
    } catch {
      set({ isLoaded: true });
    }
  },

  addBooking: async item => {
    const newItem: BookingHistoryItem = {
      ...item,
      id: `${Date.now()}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    const items = [newItem, ...get().items];
    set({ items });
    await SecureStore.setItemAsync(HISTORY_KEY, JSON.stringify(items));
  },
}));
