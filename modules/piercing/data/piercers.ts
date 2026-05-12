export type PiercerReview = {
  id: string;
  author: string;
  rating: number;
  timeAgo: string;
  comment: string;
};

export type Piercer = {
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
  reviews: PiercerReview[];
};

export const PIERCERS: Piercer[] = [
  {
    id: 'gera',
    name: 'Gera',
    specialty: 'Piercing profesional & Joyería',
    image: require('../../../assets/images/piercing/gera/profile.jpeg') as number,
    heroImage: require('../../../assets/images/piercing/gera/profile.jpeg') as number,
    rating: 4.8,
    reviewCount: 96,
    availableToday: true,
    styles: ['Lóbulo', 'Hélix', 'Septum', 'Nariz', 'Tragus', 'Industrial'],
    gallery: [
      require('../../../assets/images/piercing/gera/gallery-1.jpeg') as number,
      require('../../../assets/images/piercing/gera/gallery-2.jpeg') as number,
      require('../../../assets/images/piercing/gera/gallery-3.jpeg') as number,
      require('../../../assets/images/piercing/gera/gallery-4.jpeg') as number,
      require('../../../assets/images/piercing/gera/gallery-5.jpeg') as number,
      require('../../../assets/images/piercing/gera/gallery-6.jpeg') as number,
    ],
    experience: '7 años',
    location: 'HR Studio — Centro',
    whatsapp: '521234567894',
    reviews: [
      {
        id: '1',
        author: 'Sofía',
        rating: 5,
        timeAgo: '1 sem',
        comment: 'Increíble atención, muy limpio y profesional.',
      },
      {
        id: '2',
        author: 'Daniela',
        rating: 5,
        timeAgo: '2 sem',
        comment: 'Me encantó el resultado, muy delicado y preciso.',
      },
      {
        id: '3',
        author: 'Camila',
        rating: 4,
        timeAgo: '1 mes',
        comment: 'Excelente trabajo, la joya quedó perfecta.',
      },
    ],
  },
];
