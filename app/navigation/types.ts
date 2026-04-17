import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Bottom Tabs
export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  Promos: undefined;
  Profile: undefined;
};

// Module Stacks
export type TattooStackParamList = {
  TattooHome: undefined;
  TattooGallery: undefined;
  TattooDetail: { id: string };
  TattooBooking: { artistId: string };
};

export type BarberStackParamList = {
  BarberHome: undefined;
  BarberServices: undefined;
  BarberDetail: { id: string };
  BarberBooking: { barberId: string };
};

export type SmokeShopStackParamList = {
  SmokeShopHome: undefined;
  ProductList: { categoryId?: string };
  ProductDetail: { id: string };
  Cart: undefined;
};

export type MusicStackParamList = {
  MusicHome: undefined;
  EventList: undefined;
  EventDetail: { id: string };
};

export type PiercingStackParamList = {
  PiercingHome: undefined;
  PiercingGallery: undefined;
  PiercingBooking: { piercingId?: string };
};

export type ResinStackParamList = {
  ResinHome: undefined;
  ResinGallery: undefined;
  ResinDetail: { id: string };
  ResinOrder: undefined;
};

// App Stack (wraps bottom tabs + module stacks)
export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  Tattoo: NavigatorScreenParams<TattooStackParamList>;
  Barber: NavigatorScreenParams<BarberStackParamList>;
  SmokeShop: NavigatorScreenParams<SmokeShopStackParamList>;
  Music: NavigatorScreenParams<MusicStackParamList>;
  Piercing: NavigatorScreenParams<PiercingStackParamList>;
  Resin: NavigatorScreenParams<ResinStackParamList>;
};

// Root
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};
