export type BarberReview = {
  id: string;
  author: string;
  rating: number;
  timeAgo: string;
  comment: string;
};

export type Barber = {
  id: string;
  name: string;
  specialty: string;
  image: number;
  heroImage?: number;
  rating: number;
  reviewCount: number;
  availableToday: boolean;
  styles: string[];
  gallery: number[];
  experience: string;
  location: string;
  whatsapp: string;
  reviews: BarberReview[];
};

export const BARBERS: Barber[] = [
  {
    id: 'jonathan',
    name: 'Jonathan',
    specialty: 'Corte clásico & Barba',
    image: require('../../../assets/images/barber/Jonathan/profile.jpeg') as number,
    heroImage: require('../../../assets/images/barber/Jonathan/profile.jpeg') as number,
    rating: 4.9,
    reviewCount: 128,
    availableToday: true,
    styles: ['Corte clásico', 'Barba', 'Afeitado', 'Degradado'],
    gallery: [
      require('../../../assets/images/barber/Jonathan/gallery-1.jpeg') as number,
      require('../../../assets/images/barber/Jonathan/gallery-2.jpeg') as number,
      require('../../../assets/images/barber/Jonathan/gallery-3.jpeg') as number,
      require('../../../assets/images/barber/Jonathan/gallery-4.jpeg') as number,
      require('../../../assets/images/barber/Jonathan/gallery-5.jpeg') as number,
      require('../../../assets/images/barber/Jonathan/gallery-6.jpeg') as number,
      require('../../../assets/images/barber/Jonathan/gallery-7.jpeg') as number,
    ],
    experience: '8 años',
    location: 'HR Barber Studio – Centro',
    whatsapp: '521234567890',
    reviews: [
      {
        id: '1',
        author: 'Miguel',
        rating: 5,
        timeAgo: '1 sem',
        comment: 'Excelente corte, muy profesional y rápido.',
      },
      {
        id: '2',
        author: 'Roberto',
        rating: 5,
        timeAgo: '1 mes',
        comment: 'El mejor fade que me han hecho. Muy limpio.',
      },
      {
        id: '3',
        author: 'Jorge',
        rating: 4,
        timeAgo: '2 meses',
        comment: 'Buen servicio, puntual y amable.',
      },
    ],
  },
];
