# Haciéndolo Real — App Móvil

App móvil para Android e iOS construida con Expo + React Native.

## Stack

- **Expo** (SDK latest) + TypeScript
- **React Navigation v7** — Navegación
- **Zustand** — Estado de UI y auth
- **TanStack Query v5** — Estado del servidor (fetch, cache)
- **Axios** — HTTP client
- **EAS Build** — Builds en la nube

## Requisitos

- Node.js 20+
- npm 10+
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)

## Instalación

```bash
git clone <repo-url>
cd hr-app
npm install
cp .env.example .env.development
# Llenar las variables en .env.development
```

## Correr en desarrollo

```bash
npm start          # Expo Go
npm run ios        # Simulador iOS
npm run android    # Emulador Android
```

## Scripts

| Comando                 | Descripción                    |
| ----------------------- | ------------------------------ |
| `npm start`             | Inicia Expo dev server         |
| `npm run lint`          | Corre ESLint                   |
| `npm run lint:fix`      | Corrige errores de lint        |
| `npm run format`        | Formatea con Prettier          |
| `npm test`              | Corre tests                    |
| `npm run test:coverage` | Tests con reporte de cobertura |

## Estructura

```
hr-app/
├── app/
│   ├── navigation/    ← Navegadores (Root, Auth, App, BottomTabs)
│   ├── theme/         ← Colors, typography, spacing
│   └── components/    ← Componentes compartidos (Button, Card, Input...)
├── modules/           ← Un directorio por módulo de negocio
│   ├── home/
│   ├── auth/
│   ├── tattoo/        ← Dev 1
│   ├── barber/        ← Dev 2
│   ├── smoke-shop/
│   ├── music/
│   ├── piercing/
│   └── resin/
├── services/
│   └── api/           ← Axios client + endpoints centralizados
├── store/             ← Zustand stores (auth, ui)
├── hooks/             ← Hooks globales
├── types/             ← Tipos compartidos
└── utils/             ← Helpers (formatDate, validators, constants)
```

## Path Aliases

| Alias        | Ruta          |
| ------------ | ------------- |
| `@app/`      | `./app/`      |
| `@modules/`  | `./modules/`  |
| `@services/` | `./services/` |
| `@store/`    | `./store/`    |
| `@hooks/`    | `./hooks/`    |
| `@utils/`    | `./utils/`    |
| `@assets/`   | `./assets/`   |

## Flujo de trabajo por módulo

1. Cada dev trabaja en su módulo dentro de `modules/<nombre>/`
2. Los componentes reutilizables van en `app/components/`
3. Cada módulo tiene su propio navigator (`<Modulo>Navigator.tsx`)
4. Para agregar pantallas nuevas: agregar en el navigator del módulo y en `types.ts`

## EAS Build

```bash
# Build de desarrollo
eas build --platform all --profile development

# Build de preview (para compartir)
eas build --platform all --profile preview

# Build de producción
eas build --platform all --profile production
```

## Variables de entorno

Copiar `.env.example` a `.env.development` y llenar:

- `API_URL` — URL del backend (EC2 / API Gateway)
- `AWS_*` — Credenciales de AWS (Cognito, S3, SNS)
- `SENTRY_DSN` — Para crash reporting en producción
