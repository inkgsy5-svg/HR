import { BookingService } from '@app/booking/booking.types';

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  subtitle: string;
  description: string;
  whatsapp: string;
  availableToday: boolean;
  styles: string[];
  services: BookingService[];
};

export const CATEGORIES: Category[] = [
  {
    id: 'vaporizadores',
    name: 'Vaporizadores',
    icon: '💨',
    color: '#4FC3F7',
    subtitle: 'Dispositivos premium',
    description:
      'La mejor selección de vaporizadores portátiles y de escritorio. Marcas reconocidas con garantía de fábrica.',
    whatsapp: '521234567890',
    availableToday: true,
    styles: ['Portátil', 'Escritorio', 'Convección', 'Conducción', 'Híbrido'],
    services: [
      {
        id: 'v1',
        name: 'Pax 3',
        description: 'Vaporizador portátil premium',
        price: 1800,
        duration: 0,
        icon: '💨',
      },
      {
        id: 'v2',
        name: 'Mighty+',
        description: 'Vaporizador de alta gama',
        price: 3200,
        duration: 0,
        icon: '⚡',
      },
      {
        id: 'v3',
        name: 'DynaVap M7',
        description: 'Mecánico sin batería',
        price: 900,
        duration: 0,
        icon: '🔥',
      },
      {
        id: 'v4',
        name: 'Arizer Solo 2',
        description: 'Gran duración de batería',
        price: 2100,
        duration: 0,
        icon: '🌀',
      },
    ],
  },
  {
    id: 'rolling',
    name: 'Rolling Papers',
    icon: '🌿',
    color: '#81C784',
    subtitle: 'Papeles y filtros',
    description:
      'Amplio surtido de papeles de enrolar, filtros, tips y accesorios. Las mejores marcas del mercado.',
    whatsapp: '521234567890',
    availableToday: true,
    styles: ['Sin blanquear', 'Orgánicos', 'De arroz', 'King size', 'Mini'],
    services: [
      {
        id: 'r1',
        name: 'Raw Classic',
        description: 'Papeles sin blanquear',
        price: 45,
        duration: 0,
        icon: '📜',
      },
      {
        id: 'r2',
        name: 'Zig Zag Organic',
        description: 'Orgánicos certificados',
        price: 55,
        duration: 0,
        icon: '🌱',
      },
      {
        id: 'r3',
        name: 'Elements Rice',
        description: 'Ultra finos de arroz',
        price: 60,
        duration: 0,
        icon: '🍃',
      },
      {
        id: 'r4',
        name: 'Raw Tips',
        description: 'Filtros de cartón natural',
        price: 30,
        duration: 0,
        icon: '🗂️',
      },
    ],
  },
  {
    id: 'grinders',
    name: 'Grinders',
    icon: '⚙️',
    color: '#FFB74D',
    subtitle: 'Moledores premium',
    description:
      'Grinders de aluminio, titanio y acrílico. Desde básicos hasta coleccionables de edición limitada.',
    whatsapp: '521234567890',
    availableToday: true,
    styles: ['2 piezas', '4 piezas', 'Con kief catcher', 'Eléctrico', 'Madera'],
    services: [
      {
        id: 'g1',
        name: 'Santa Cruz 3pc',
        description: 'Aluminio anodizado',
        price: 450,
        duration: 0,
        icon: '⚙️',
      },
      {
        id: 'g2',
        name: 'Space Case Ti',
        description: 'Titanio grado médico',
        price: 1200,
        duration: 0,
        icon: '🚀',
      },
      {
        id: 'g3',
        name: 'Kannastor GR8TR',
        description: 'Con kief catcher',
        price: 850,
        duration: 0,
        icon: '🏆',
      },
      {
        id: 'g4',
        name: 'SharpStone V2',
        description: 'Relación calidad-precio',
        price: 320,
        duration: 0,
        icon: '⭐',
      },
    ],
  },
  {
    id: 'pipes',
    name: 'Pipes & Bongs',
    icon: '💧',
    color: '#CE93D8',
    subtitle: 'Cristal y silicón',
    description:
      'Bongs de vidrio borosilicato, pipes y waterpipes. Diseños artesanales y piezas de colección.',
    whatsapp: '521234567890',
    availableToday: false,
    styles: ['Borosilicato', 'Silicón', 'Beaker', 'Percolador', 'Sherlock'],
    services: [
      {
        id: 'b1',
        name: 'Beaker Básico',
        description: 'Vidrio 5mm grueso',
        price: 380,
        duration: 0,
        icon: '🧪',
      },
      {
        id: 'b2',
        name: 'Silicone Bong',
        description: 'Inrompible, fácil de limpiar',
        price: 280,
        duration: 0,
        icon: '💧',
      },
      {
        id: 'b3',
        name: 'Sherlock Pipe',
        description: 'Borosilicato clásico',
        price: 220,
        duration: 0,
        icon: '🔍',
      },
      {
        id: 'b4',
        name: 'Percolator Bong',
        description: 'Doble filtrado de agua',
        price: 950,
        duration: 0,
        icon: '🌀',
      },
    ],
  },
  {
    id: 'accesorios',
    name: 'Accesorios',
    icon: '🛍️',
    color: '#F48FB1',
    subtitle: 'Todo lo que necesitas',
    description:
      'Encendedores, bandejas, estuches, balanzas y todo lo que necesitas para tu experiencia completa.',
    whatsapp: '521234567890',
    availableToday: true,
    styles: ['Encendedores', 'Bandejas', 'Almacenamiento', 'Básulas', 'Limpieza'],
    services: [
      {
        id: 'a1',
        name: 'Clipper Lighter',
        description: 'Encendedor recargable',
        price: 45,
        duration: 0,
        icon: '🔥',
      },
      {
        id: 'a2',
        name: 'RAW Rolling Tray',
        description: 'Bandeja con diseño',
        price: 180,
        duration: 0,
        icon: '🗂️',
      },
      {
        id: 'a3',
        name: 'Stash Box',
        description: 'Estuche con cerradura',
        price: 350,
        duration: 0,
        icon: '📦',
      },
      {
        id: 'a4',
        name: 'Digital Scale',
        description: 'Báscula 0.01g precisión',
        price: 220,
        duration: 0,
        icon: '⚖️',
      },
    ],
  },
];
