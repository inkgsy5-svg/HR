# Documento 1 — Qué se construyó en el esqueleto

## Resumen

Se construyó el cascaron completo de la app móvil **Haciéndolo Real (HR)** para Android e iOS usando Expo + React Native + TypeScript. El objetivo fue que cualquier desarrollador pueda hacer `git clone` + `npm install` y empezar a trabajar en su módulo sin configurar nada manualmente.

---

## Stack tecnológico

| Tecnología          | Versión    | Para qué sirve                                   |
| ------------------- | ---------- | ------------------------------------------------ |
| Expo                | SDK latest | Framework para React Native (iOS + Android)      |
| React Native        | 0.81+      | Base de la app                                   |
| TypeScript          | ~5.9       | Tipado estático                                  |
| React Navigation v7 | ^7         | Navegación entre pantallas                       |
| Zustand             | ^5         | Estado de UI y sesión del usuario                |
| TanStack Query v5   | ^5         | Peticiones HTTP, cache, loading states           |
| Axios               | ^1         | Cliente HTTP                                     |
| Expo SecureStore    | ^55        | Guardar tokens de forma segura en el dispositivo |
| Expo Constants      | ^55        | Leer variables de entorno                        |
| Sentry              | ^8         | Reportar crashes en producción                   |
| ESLint v9           | ^9         | Análisis estático de código                      |
| Prettier            | ^3         | Formateo de código                               |
| Husky               | ^9         | Hooks de Git (pre-commit)                        |
| lint-staged         | ^16        | Correr lint solo en archivos modificados         |
| Jest + jest-expo    | ^30 / ^55  | Tests unitarios                                  |
| EAS Build           | CLI        | Builds en la nube para App Store / Play Store    |

---

## Estructura de carpetas

```
hr-app/
├── app/
│   ├── navigation/          ← Toda la navegación de la app
│   │   ├── RootNavigator    ← Decide si mostrar Auth o App
│   │   ├── AuthNavigator    ← Stack: Login → Register
│   │   ├── AppNavigator     ← App principal + módulos
│   │   ├── BottomTabNavigator ← 4 tabs: Home, Buscar, Promos, Perfil
│   │   └── types.ts         ← Tipos TypeScript de todas las rutas
│   │
│   ├── theme/               ← Diseño visual centralizado
│   │   ├── colors.ts        ← Paleta de colores (tema oscuro)
│   │   ├── typography.ts    ← Tamaños de fuente, pesos, familias
│   │   ├── spacing.ts       ← Espaciado y border radius
│   │   └── index.ts         ← Exporta todo junto
│   │
│   └── components/          ← Componentes reutilizables en toda la app
│       ├── Button/          ← 4 variantes: primary, secondary, outline, ghost
│       ├── Card/            ← Contenedor con borde y fondo
│       ├── Input/           ← Campo de texto con label, error, hint
│       ├── Header/          ← Barra superior con logo y lupa
│       ├── Toast/           ← Notificaciones flotantes (success/error/info/warning)
│       └── ErrorBoundary/   ← Captura errores sin que la app crashee
│
├── modules/                 ← Un directorio por módulo de negocio
│   ├── auth/                ← Login y Register
│   ├── home/                ← Pantalla principal con grid de módulos
│   ├── search/              ← Búsqueda global
│   ├── promos/              ← Promociones del día
│   ├── profile/             ← Perfil del usuario
│   ├── tattoo/              ← Módulo tatuajes (Dev 1)
│   ├── barber/              ← Módulo barbería (Dev 2)
│   ├── smoke-shop/          ← Módulo tienda
│   ├── music/               ← Módulo eventos musicales
│   ├── piercing/            ← Módulo piercing
│   └── resin/               ← Módulo cuadros de resina
│
├── services/
│   └── api/
│       ├── client.ts        ← Axios configurado con token automático + manejo 401
│       └── endpoints.ts     ← Todas las URLs de la API centralizadas
│
├── store/                   ← Estado global con Zustand
│   ├── authStore.ts         ← Sesión del usuario (login, logout, restaurar sesión)
│   └── uiStore.ts           ← Loading global y sistema de toasts
│
├── hooks/                   ← Hooks compartidos (carpeta lista para usar)
├── types/                   ← Tipos TypeScript compartidos
│   ├── api.types.ts         ← ApiResponse, PaginatedResponse, ApiError
│   └── common.types.ts      ← BaseEntity, ImageAsset, BookingSlot
│
├── utils/                   ← Funciones de utilidad
│   ├── constants.ts         ← Nombre de la app, QUERY_KEYS centralizados
│   ├── formatDate.ts        ← formatDate, formatTime, timeUntil
│   └── validators.ts        ← email, password, phone, required
│
├── assets/
│   ├── images/              ← hr-logo.png y demás imágenes
│   ├── fonts/               ← Fuentes custom
│   └── icons/modules/       ← Íconos de cada módulo
│
├── __tests__/               ← Carpeta para tests
├── .github/workflows/       ← CI/CD automático
│   ├── lint.yml             ← Corre ESLint en cada PR
│   └── build.yml            ← EAS Build automático al hacer push a main
│
├── App.tsx                  ← Punto de entrada. Configura providers globales
├── app.json                 ← Config de Expo (nombre, bundle ID, splash, plugins)
├── eas.json                 ← Perfiles de build: development, preview, production
├── babel.config.js          ← Config de Babel con path aliases
├── tsconfig.json            ← Config de TypeScript con path aliases
├── eslint.config.js         ← ESLint v9 (flat config)
├── .prettierrc              ← Reglas de formato
├── jest.config.js           ← Config de Jest con path aliases
├── .env.example             ← Plantilla de variables de entorno (sin credenciales)
├── .gitignore               ← Ignora node_modules, .env, .expo, builds
└── README.md                ← Instrucciones del proyecto
```

---

## Path aliases configurados

En lugar de escribir rutas relativas como `../../../components/Button`, se usan aliases:

| Alias        | Apunta a      |
| ------------ | ------------- |
| `@app/`      | `./app/`      |
| `@modules/`  | `./modules/`  |
| `@services/` | `./services/` |
| `@store/`    | `./store/`    |
| `@hooks/`    | `./hooks/`    |
| `@types/`    | `./types/`    |
| `@utils/`    | `./utils/`    |
| `@assets/`   | `./assets/`   |

**Ejemplo:**

```ts
// Sin alias (malo)
import Button from '../../../app/components/Button';

// Con alias (correcto)
import Button from '@app/components/Button';
```

---

## Navegación — cómo funciona

```
RootNavigator
├── AuthNavigator (si NO está autenticado)
│   ├── LoginScreen
│   └── RegisterScreen
│
└── AppNavigator (si SÍ está autenticado)
    ├── BottomTabNavigator
    │   ├── Home (HomeScreen)
    │   ├── Search (SearchScreen)
    │   ├── Promos (PromosScreen)
    │   └── Profile (ProfileScreen)
    │
    ├── TattooNavigator → TattooHomeScreen
    ├── BarberNavigator → BarberHomeScreen
    ├── SmokeShopNavigator → SmokeShopHomeScreen
    ├── MusicNavigator → MusicHomeScreen
    ├── PiercingNavigator → PiercingHomeScreen
    └── ResinNavigator → ResinHomeScreen
```

El `RootNavigator` lee el estado de `authStore`. Cuando el usuario hace login, Zustand actualiza `isAuthenticated = true` y la navegación cambia automáticamente al flujo de App sin necesidad de navegar manualmente.

---

## Zustand Stores

### authStore — sesión del usuario

```ts
useAuthStore(state => state.user); // datos del usuario
useAuthStore(state => state.isAuthenticated); // boolean
useAuthStore(state => state.setUser); // login
useAuthStore(state => state.logout); // logout
useAuthStore(state => state.restoreSession); // recuperar sesión al abrir app
```

El token se guarda en **Expo SecureStore** (encriptado en el dispositivo). Al abrir la app, `restoreSession()` lo recupera automáticamente.

### uiStore — estado de interfaz

```ts
useUIStore(state => state.showToast); // mostrar notificación
useUIStore(state => state.showLoading); // mostrar loading global
useUIStore(state => state.hideLoading); // ocultar loading global
```

---

## Axios Client — cómo funciona

El cliente en `services/api/client.ts` tiene dos interceptores automáticos:

1. **Request interceptor**: antes de cada petición, lee el token de SecureStore y lo agrega al header `Authorization: Bearer <token>`. El dev no tiene que hacer esto manualmente.

2. **Response interceptor**: si el servidor responde con `401 (Unauthorized)`, elimina el token y el usuario del dispositivo. El `RootNavigator` detecta el cambio y redirige al Login automáticamente.

---

## Calidad de código — ESLint + Prettier + Husky

- **ESLint v9** con reglas de TypeScript, React y React Hooks.
- **Prettier** para formateo consistente (comillas simples, trailing commas, printWidth 100).
- **Husky** ejecuta lint-staged antes de cada `git commit`.
- **lint-staged** corre ESLint y Prettier SOLO en los archivos modificados (no en todo el proyecto).

Si el código tiene errores de lint, el commit es rechazado automáticamente.

---

## EAS Build — ambientes

| Perfil        | Uso                                      | Distribución     |
| ------------- | ---------------------------------------- | ---------------- |
| `development` | Para desarrollar con Expo Dev Client     | Interno (equipo) |
| `preview`     | Para QA y pruebas en dispositivos reales | Interno (equipo) |
| `production`  | Para publicar en App Store / Play Store  | Público          |

---

## GitHub Actions — CI/CD

### lint.yml

- Se ejecuta en cada Pull Request hacia `main` o `develop`
- Corre ESLint y TypeScript type-check
- Si falla, bloquea el merge del PR

### build.yml

- Se ejecuta al hacer push a `main`
- Puede correrse manualmente eligiendo plataforma y perfil
- Requiere el secret `EXPO_TOKEN` configurado en el repositorio
