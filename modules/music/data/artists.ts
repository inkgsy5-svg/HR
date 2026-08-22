export type Review = {
  id: string;
  author: string;
  rating: number;
  timeAgo: string;
  comment: string;
};

export type Video = {
  title: string;
  url: string;
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
  bio: string;
  location: string;
  whatsapp: string;
  videos: Video[];
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
    bio: 'Pily Pacheco es DJ residente de HR Music. Le apasiona el rap — de los clásicos a las propuestas más nuevas del género — y esa es la base de sus sets, mezclados con energía en vivo para que la pista no pare.',
    location: 'HR Music',
    whatsapp: '521234567890',
    videos: [
      { title: 'Solo algunos', url: 'https://www.youtube.com/watch?v=_-iydVdk6Vc' },
      { title: 'Ya no llames', url: 'https://www.youtube.com/watch?v=lAZhQ-w_KYo' },
      { title: 'Trance', url: 'https://www.youtube.com/watch?v=VpZMj2AgpGI' },
    ],
    reviews: [],
  },
];
