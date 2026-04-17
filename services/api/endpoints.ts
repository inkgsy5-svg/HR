export const ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    refreshToken: '/auth/refresh',
  },

  // Search
  search: {
    global: '/search',
  },

  // Promos
  promos: {
    list: '/promos',
    detail: (id: string) => `/promos/${id}`,
  },

  // Tattoo
  tattoo: {
    gallery: '/tattoo/gallery',
    detail: (id: string) => `/tattoo/${id}`,
    artists: '/tattoo/artists',
    booking: '/tattoo/bookings',
  },

  // Barber
  barber: {
    list: '/barber/barbers',
    detail: (id: string) => `/barber/${id}`,
    services: '/barber/services',
    booking: '/barber/bookings',
  },

  // Smoke Shop
  smokeShop: {
    products: '/smoke-shop/products',
    detail: (id: string) => `/smoke-shop/products/${id}`,
    categories: '/smoke-shop/categories',
    orders: '/smoke-shop/orders',
  },

  // Music
  music: {
    events: '/music/events',
    detail: (id: string) => `/music/events/${id}`,
    artists: '/music/artists',
  },

  // Piercing
  piercing: {
    gallery: '/piercing/gallery',
    booking: '/piercing/bookings',
  },

  // Resin
  resin: {
    gallery: '/resin/gallery',
    detail: (id: string) => `/resin/${id}`,
    orders: '/resin/orders',
  },
};
