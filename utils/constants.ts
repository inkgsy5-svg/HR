export const APP_NAME = 'Haciéndolo Real';
export const APP_SHORT_NAME = 'HR';

export const QUERY_KEYS = {
  promos: ['promos'] as const,
  tattoo: {
    gallery: ['tattoo', 'gallery'] as const,
    artists: ['tattoo', 'artists'] as const,
  },
  barber: {
    list: ['barber', 'list'] as const,
    services: ['barber', 'services'] as const,
  },
  smokeShop: {
    products: ['smoke-shop', 'products'] as const,
    categories: ['smoke-shop', 'categories'] as const,
  },
  music: {
    events: ['music', 'events'] as const,
  },
  piercing: {
    gallery: ['piercing', 'gallery'] as const,
  },
  resin: {
    gallery: ['resin', 'gallery'] as const,
  },
};
