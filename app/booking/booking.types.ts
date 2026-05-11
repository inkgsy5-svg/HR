export interface BookingService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  icon: string;
}

export interface BookingProfessional {
  id: string;
  name: string;
  specialty: string;
  image: number | { uri: string };
  heroImage?: number | { uri: string };
  whatsapp?: string;
}

export type BookingModule = 'barber' | 'tattoo' | 'piercing' | 'smoke-shop' | 'music' | 'resin';
