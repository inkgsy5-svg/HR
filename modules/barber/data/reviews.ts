export interface Review {
  id: string;
  barberId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatarUrl: string;
}

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    barberId: '1',
    userName: 'Miguel A.',
    rating: 5,
    comment: 'Excelente corte, muy profesional y rápido. Definitivamente regreso.',
    date: '2026-04-10',
    avatarUrl: 'https://i.pravatar.cc/150?img=20',
  },
  {
    id: 'r2',
    barberId: '1',
    userName: 'Roberto C.',
    rating: 5,
    comment: 'El mejor fade que me han hecho. Muy limpio el trabajo.',
    date: '2026-04-05',
    avatarUrl: 'https://i.pravatar.cc/150?img=21',
  },
  {
    id: 'r3',
    barberId: '1',
    userName: 'Jorge M.',
    rating: 4,
    comment: 'Buen servicio, puntual y amable. Le falta un poco más de detalle en las patillas.',
    date: '2026-03-28',
    avatarUrl: 'https://i.pravatar.cc/150?img=22',
  },
  {
    id: 'r4',
    barberId: '2',
    userName: 'Alejandro R.',
    rating: 5,
    comment: 'Diego es un artista, el diseño quedó increíble.',
    date: '2026-04-12',
    avatarUrl: 'https://i.pravatar.cc/150?img=23',
  },
  {
    id: 'r5',
    barberId: '2',
    userName: 'Fernando L.',
    rating: 4,
    comment: 'Muy buen trabajo en el fade, lo recomiendo.',
    date: '2026-04-01',
    avatarUrl: 'https://i.pravatar.cc/150?img=24',
  },
  {
    id: 'r6',
    barberId: '3',
    userName: 'Samuel T.',
    rating: 5,
    comment: 'Andrés tiene mucho talento, el afeitado clásico fue una experiencia.',
    date: '2026-04-08',
    avatarUrl: 'https://i.pravatar.cc/150?img=25',
  },
  {
    id: 'r7',
    barberId: '4',
    userName: 'Cristian V.',
    rating: 4,
    comment: 'La coloración quedó muy natural, justo lo que pedí.',
    date: '2026-04-15',
    avatarUrl: 'https://i.pravatar.cc/150?img=26',
  },
];
