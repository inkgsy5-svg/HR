export type Artwork = {
  id: string;
  title: string;
  artist: string;
  year: number;
  country: string;
  materials: string;
  size: string;
  price: number;
  image: number;
};

export type ResinCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
  subtitle: string;
  description: string;
  whatsapp: string;
  availableToday: boolean;
  artworks: Artwork[];
};

export const RESIN_CATEGORIES: ResinCategory[] = [
  {
    id: 'cuadros',
    name: 'Cuadros Decorativos',
    icon: '🖼️',
    color: '#C9A050',
    subtitle: 'Arte en resina para tu hogar',
    description:
      'Cuadros únicos elaborados a mano con resina epóxica y pigmentos de alta calidad. Cada pieza es irrepetible y está diseñada para transformar cualquier espacio.',
    whatsapp: '521234567890',
    availableToday: true,
    artworks: [
      {
        id: 'c1',
        title: 'Where I Left My Daydream',
        artist: 'Gera',
        year: 2026,
        country: 'México',
        materials: 'Madera y Resina',
        size: '50 x 50 cm',
        price: 500,
        image: require('../../../assets/images/resin/gallery-1.jpg') as number,
      },
      {
        id: 'c2',
        title: 'Ocean Waves',
        artist: 'Gera',
        year: 2026,
        country: 'México',
        materials: 'Madera y Resina',
        size: '50 x 50 cm',
        price: 500,
        image: require('../../../assets/images/resin/gallery-2.jpg') as number,
      },
      {
        id: 'c3',
        title: 'Golden Sunset',
        artist: 'Gera',
        year: 2026,
        country: 'México',
        materials: 'Madera y Resina',
        size: '50 x 50 cm',
        price: 500,
        image: require('../../../assets/images/resin/gallery-3.jpg') as number,
      },
      {
        id: 'c4',
        title: 'Midnight Forest',
        artist: 'Gera',
        year: 2026,
        country: 'México',
        materials: 'Madera y Resina',
        size: '50 x 50 cm',
        price: 500,
        image: require('../../../assets/images/resin/gallery-4.jpg') as number,
      },
    ],
  },
  {
    id: 'piezas',
    name: 'Piezas Personalizadas',
    icon: '✨',
    color: '#E94560',
    subtitle: 'Diseño exclusivo a tu medida',
    description:
      'Creamos piezas únicas bajo pedido. Elige colores, tamaños y materiales para crear una obra que cuente tu historia. Tiempo de entrega: 2 a 3 semanas.',
    whatsapp: '521234567890',
    availableToday: true,
    artworks: [
      {
        id: 'p1',
        title: 'Purple Dream',
        artist: 'Gera',
        year: 2026,
        country: 'México',
        materials: 'Madera y Resina',
        size: '50 x 50 cm',
        price: 500,
        image: require('../../../assets/images/resin/gallery-5.jpg') as number,
      },
      {
        id: 'p2',
        title: 'Fire & Ice',
        artist: 'Gera',
        year: 2026,
        country: 'México',
        materials: 'Madera y Resina',
        size: '50 x 50 cm',
        price: 500,
        image: require('../../../assets/images/resin/gallery-6.jpg') as number,
      },
      {
        id: 'p3',
        title: 'Desert Wind',
        artist: 'Gera',
        year: 2026,
        country: 'México',
        materials: 'Madera y Resina',
        size: '50 x 50 cm',
        price: 500,
        image: require('../../../assets/images/resin/gallery-7.jpg') as number,
      },
      {
        id: 'p4',
        title: 'Neon Galaxy',
        artist: 'Gera',
        year: 2026,
        country: 'México',
        materials: 'Madera y Resina',
        size: '50 x 50 cm',
        price: 500,
        image: require('../../../assets/images/resin/gallery-8.jpg') as number,
      },
    ],
  },
  {
    id: 'regalos',
    name: 'Regalos Especiales',
    icon: '🎁',
    color: '#4CAF50',
    subtitle: 'El regalo perfecto',
    description:
      'Piezas de resina pensadas para regalar en ocasiones especiales. Presentación premium con empaque de regalo incluido. Disponibles para entrega inmediata.',
    whatsapp: '521234567890',
    availableToday: true,
    artworks: [
      {
        id: 'r1',
        title: 'Love in Colors',
        artist: 'Gera',
        year: 2026,
        country: 'México',
        materials: 'Madera y Resina',
        size: '50 x 50 cm',
        price: 500,
        image: require('../../../assets/images/resin/gallery-9.jpg') as number,
      },
      {
        id: 'r2',
        title: 'Eternal Spring',
        artist: 'Gera',
        year: 2026,
        country: 'México',
        materials: 'Madera y Resina',
        size: '50 x 50 cm',
        price: 500,
        image: require('../../../assets/images/resin/gallery-10.jpg') as number,
      },
    ],
  },
];
