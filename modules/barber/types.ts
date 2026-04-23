export interface Barber {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  experience: string; // ej. "5 años"
  available: boolean;
  imageUrl: string;
}
