export interface BarberService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutos
  icon: string;
}

export const SERVICES: BarberService[] = [
  {
    id: 's1',
    name: 'Corte Clásico',
    description: 'Corte tradicional con tijera y máquina',
    price: 150,
    duration: 30,
    icon: '✂️',
  },
  {
    id: 's2',
    name: 'Fade',
    description: 'Degradado a máquina, bajo, medio o alto',
    price: 180,
    duration: 40,
    icon: '💈',
  },
  {
    id: 's3',
    name: 'Barba',
    description: 'Perfilado y arreglo de barba con navaja',
    price: 100,
    duration: 20,
    icon: '🪒',
  },
  {
    id: 's4',
    name: 'Combo Corte + Barba',
    description: 'Corte clásico más arreglo completo de barba',
    price: 220,
    duration: 50,
    icon: '⭐',
  },
  {
    id: 's5',
    name: 'Afeitado Clásico',
    description: 'Afeitado con toalla caliente y navaja',
    price: 120,
    duration: 25,
    icon: '🫧',
  },
  {
    id: 's6',
    name: 'Diseño & Líneas',
    description: 'Diseños personalizados y líneas de precisión',
    price: 200,
    duration: 45,
    icon: '🎨',
  },
];
