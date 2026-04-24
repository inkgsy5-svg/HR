import { Barber } from '../types';

export const BARBERS: Barber[] = [
  {
    id: '1',
    name: 'Carlos Mendoza',
    specialty: 'Corte clásico & Barba',
    rating: 4.9,
    reviewCount: 128,
    experience: '8 años',
    available: true,
    imageUrl: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: '2',
    name: 'Diego Ramírez',
    specialty: 'Fade & Diseños',
    rating: 4.7,
    reviewCount: 94,
    experience: '5 años',
    available: true,
    imageUrl: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: '3',
    name: 'Andrés Torres',
    specialty: 'Corte moderno & Afeitado',
    rating: 4.8,
    reviewCount: 76,
    experience: '6 años',
    available: false,
    imageUrl: 'https://i.pravatar.cc/150?img=13',
  },
  {
    id: '4',
    name: 'Luis Herrera',
    specialty: 'Coloración & Estilo',
    rating: 4.6,
    reviewCount: 52,
    experience: '4 años',
    available: true,
    imageUrl: 'https://i.pravatar.cc/150?img=15',
  },
];
