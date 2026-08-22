export const ENDPOINTS = {
  // Auth
  // Auth: el proveedor real va a ser AWS Cognito (User Pool + Google como
  // Federated Identity Provider, ver docs/06-aws-setup.md § 5). Cognito emite
  // sus propios tokens directo al cliente (Hosted UI / Amplify Auth), así que
  // esta API no necesita endpoints propios de login/registro — solo valida
  // el JWT de Cognito en cada request. Se deja `me` por si se necesita un
  // endpoint propio de perfil extendido más adelante.
  auth: {
    me: '/auth/me',
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
