export type Review = {
  id: string;
  author: string;
  rating: number;
  timeAgo: string;
  comment: string;
};

export type Artist = {
  id: string;
  name: string;
  specialty: string;
  image: number; // foto del círculo en el menú
  heroImage?: number; // foto hero en el perfil (si es diferente al círculo)
  rating: number;
  reviewCount: number;
  availableToday: boolean;
  styles: string[];
  gallery: number[];
  experience: string;
  location: string;
  whatsapp: string;
  reviews: Review[];
};

export const ARTISTS: Artist[] = [
  {
    id: 'julio',
    name: 'Julio',
    specialty: 'Realismo & Blackwork',
    image: require('../../../assets/images/tattoo/julio/profile.jpg') as number,
    rating: 4.8,
    reviewCount: 120,
    availableToday: true,
    styles: ['Realismo', 'Blackwork', 'Tradicional', 'Lettering'],
    gallery: [
      require('../../../assets/images/tattoo/julio/gallery-1.jpg') as number,
      require('../../../assets/images/tattoo/julio/gallery-2.jpg') as number,
      require('../../../assets/images/tattoo/julio/gallery-3.jpg') as number,
      require('../../../assets/images/tattoo/julio/gallery-4.jpg') as number,
      require('../../../assets/images/tattoo/julio/gallery-5.jpg') as number,
      require('../../../assets/images/tattoo/julio/gallery-6.jpg') as number,
      require('../../../assets/images/tattoo/julio/gallery-7.jpg') as number,
      require('../../../assets/images/tattoo/julio/gallery-8.jpg') as number,
    ],
    experience: '15 años',
    location: 'HR Tattoo Studio – Centro',
    whatsapp: '521234567890',
    reviews: [
      {
        id: '1',
        author: 'Andrea',
        rating: 5,
        timeAgo: '1m',
        comment: 'Increíble trabajo, super detallado y realista.',
      },
      {
        id: '2',
        author: 'Miguel',
        rating: 4,
        timeAgo: '1 mes',
        comment: 'Muy profesional, la atención de 10.',
      },
      {
        id: '3',
        author: 'Laura',
        rating: 5,
        timeAgo: '3 meses',
        comment: 'El mejor de la ciudad, quedé encantada con mi tatuaje.',
      },
    ],
  },
  {
    id: 'gera',
    name: 'Gera',
    specialty: 'Neo-tradicional & Color',
    image: require('../../../assets/images/tattoo/gera/profile.jpg') as number,
    heroImage: require('../../../assets/images/tattoo/gera/hero.jpg') as number,
    rating: 4.7,
    reviewCount: 98,
    availableToday: false,
    styles: ['Neo-tradicional', 'Color', 'Geométrico', 'Acuarela'],
    gallery: [
      require('../../../assets/images/tattoo/gera/gallery-1.jpg') as number,
      require('../../../assets/images/tattoo/gera/gallery-2.jpg') as number,
      require('../../../assets/images/tattoo/gera/gallery-3.jpg') as number,
      require('../../../assets/images/tattoo/gera/gallery-4.jpg') as number,
      require('../../../assets/images/tattoo/gera/gallery-5.jpg') as number,
      require('../../../assets/images/tattoo/gera/gallery-6.jpg') as number,
      require('../../../assets/images/tattoo/gera/gallery-7.jpg') as number,
      require('../../../assets/images/tattoo/gera/gallery-8.jpg') as number,
    ],
    experience: '10 años',
    location: 'HR Tattoo Studio – Norte',
    whatsapp: '521234567891',
    reviews: [
      {
        id: '1',
        author: 'Carlos',
        rating: 5,
        timeAgo: '2 sem',
        comment: 'Excelente trabajo, muy creativo.',
      },
      {
        id: '2',
        author: 'Sofía',
        rating: 4,
        timeAgo: '2 meses',
        comment: 'Muy buena atención y resultado increíble.',
      },
      {
        id: '3',
        author: 'Rodrigo',
        rating: 5,
        timeAgo: '4 meses',
        comment: 'El mejor tatuador de color que he visto.',
      },
    ],
  },
];
