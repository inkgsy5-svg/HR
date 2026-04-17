export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImageAsset {
  uri: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface BookingSlot {
  date: string;
  time: string;
  available: boolean;
}
