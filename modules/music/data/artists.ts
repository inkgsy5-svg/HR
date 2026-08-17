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

// TODO: contenido pendiente de definir con el equipo de música
export const ARTISTS: Artist[] = [
  {
    id: 'pily-pacheco',
    name: 'Pily Pacheco',
    specialty: 'DJ',
    image: require('../../../assets/images/music/pily-pacheco/profile.jpeg') as number,
    rating: 5,
    reviewCount: 0,
    availableToday: true,
    styles: [],
    gallery: [],
    experience: '',
    location: 'HR Music',
    whatsapp: '521234567890',
    reviews: [],
  },
];
