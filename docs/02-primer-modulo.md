# Documento 2 — Cómo desarrollar el primer módulo

Este documento aplica para ambos desarrolladores. Cada uno trabajará en su módulo asignado pero el proceso es idéntico.

---

## Asignación de módulos

| Dev   | Módulo principal | Módulo secundario |
| ----- | ---------------- | ----------------- |
| Dev 1 | `tattoo`         | `piercing`        |
| Dev 2 | `barber`         | `smoke-shop`      |
| Ambos | `music`, `resin` | (coordinado)      |

---

## Paso 1 — Clonar el repositorio y configurar el ambiente

```bash
# 1. Clonar el repo
git clone <URL_DEL_REPO>
cd hr-app

# 2. Instalar dependencias
npm install

# 3. Copiar variables de entorno
cp .env.example .env.development

# 4. Llenar las variables en .env.development
# Pedir al líder del proyecto las credenciales de AWS y la URL del backend
```

---

## Paso 2 — Verificar que el proyecto corra

```bash
npm start
```

Escanear el QR con Expo Go en tu celular, o presionar `i` para iOS / `a` para Android en el simulador.

Deberías ver la pantalla de Login con el logo HR.

---

## Paso 3 — Crear tu rama de trabajo

```bash
# Siempre partir de develop (no de main)
git checkout develop
git pull origin develop

# Crear tu rama para el módulo
git checkout -b feature/tattoo-module     # Dev 1
git checkout -b feature/barber-module     # Dev 2
```

**Convención de nombres de ramas:**

```
feature/<nombre>      ← nueva funcionalidad
fix/<nombre>          ← corrección de bug
chore/<nombre>        ← configuración, dependencias
```

---

## Paso 4 — Estructura de tu módulo

Tu módulo ya tiene una carpeta creada con esta estructura:

```
modules/tattoo/                    (ejemplo Dev 1)
├── TattooNavigator.tsx            ← Ya existe, agregar pantallas aquí
├── screens/
│   └── TattooHomeScreen.tsx       ← Ya existe, es el skeleton
├── components/                    ← Crea tus componentes aquí
├── hooks/                         ← Crea tus hooks de React Query aquí
├── services/                      ← Crea tus llamadas a la API aquí
├── store/                         ← Crea tu Zustand slice aquí (si necesitas)
└── types.ts                       ← Crea tus tipos TypeScript aquí
```

---

## Paso 5 — Agregar tipos del módulo

Primero define qué datos maneja tu módulo en `modules/tattoo/types.ts`:

```ts
// modules/tattoo/types.ts
import { BaseEntity, ImageAsset } from '@types/common.types';

export interface TattooArtist extends BaseEntity {
  name: string;
  bio: string;
  avatar: ImageAsset;
  styles: string[];
  rating: number;
}

export interface TattooDesign extends BaseEntity {
  title: string;
  image: ImageAsset;
  artist: TattooArtist;
  style: string;
  size: 'small' | 'medium' | 'large';
  price: number;
}
```

---

## Paso 6 — Crear el servicio (llamadas a la API)

```ts
// modules/tattoo/services/tattooService.ts
import apiClient from '@services/api/client';
import { ENDPOINTS } from '@services/api/endpoints';
import { TattooDesign, TattooArtist } from '../types';
import { PaginatedResponse } from '@types/api.types';

export const tattooService = {
  getGallery: async (): Promise<TattooDesign[]> => {
    const { data } = await apiClient.get<PaginatedResponse<TattooDesign>>(ENDPOINTS.tattoo.gallery);
    return data.data;
  },

  getArtists: async (): Promise<TattooArtist[]> => {
    const { data } = await apiClient.get<{ data: TattooArtist[] }>(ENDPOINTS.tattoo.artists);
    return data.data;
  },
};
```

---

## Paso 7 — Crear hooks con React Query

```ts
// modules/tattoo/hooks/useTattooGallery.ts
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@utils/constants';
import { tattooService } from '../services/tattooService';

export function useTattooGallery() {
  return useQuery({
    queryKey: QUERY_KEYS.tattoo.gallery,
    queryFn: tattooService.getGallery,
  });
}

export function useTattooArtists() {
  return useQuery({
    queryKey: QUERY_KEYS.tattoo.artists,
    queryFn: tattooService.getArtists,
  });
}
```

---

## Paso 8 — Crear componentes del módulo

```tsx
// modules/tattoo/components/TattooCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { TattooDesign } from '../types';
import { colors } from '@app/theme/colors';
import { spacing, borderRadius } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';

interface Props {
  item: TattooDesign;
  onPress: () => void;
}

export default function TattooCard({ item, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: item.image.uri }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.artist}>{item.artist.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: { width: '100%', height: 200 },
  info: { padding: spacing.md },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  artist: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
  },
});
```

---

## Paso 9 — Implementar la pantalla principal del módulo

```tsx
// modules/tattoo/screens/TattooHomeScreen.tsx
import React from 'react';
import { FlatList, StyleSheet, ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '@app/components/Header';
import { colors } from '@app/theme/colors';
import { spacing } from '@app/theme/spacing';
import { typography } from '@app/theme/typography';
import { TattooStackParamList } from '@app/navigation/types';
import { useTattooGallery } from '../hooks/useTattooGallery';
import TattooCard from '../components/TattooCard';

type NavProp = StackNavigationProp<TattooStackParamList, 'TattooHome'>;

export default function TattooHomeScreen() {
  const navigation = useNavigation<NavProp>();
  const { data: gallery, isLoading, isError } = useTattooGallery();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Tatuajes 🗡️" />
        <ActivityIndicator color={colors.secondary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Tatuajes 🗡️" />
        <Text style={styles.error}>Error al cargar la galería</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <Header title="Tatuajes 🗡️" />
      <FlatList
        data={gallery}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TattooCard
            item={item}
            onPress={() => navigation.navigate('TattooDetail', { id: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  loader: { flex: 1 },
  list: { padding: spacing.md },
  error: {
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.xl,
    fontSize: typography.fontSize.base,
  },
});
```

---

## Paso 10 — Registrar las pantallas en el Navigator

```tsx
// modules/tattoo/TattooNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TattooStackParamList } from '@app/navigation/types';
import TattooHomeScreen from './screens/TattooHomeScreen';
import TattooGalleryScreen from './screens/TattooGalleryScreen';
import TattooDetailScreen from './screens/TattooDetailScreen';
import TattooBookingScreen from './screens/TattooBookingScreen';

const Stack = createStackNavigator<TattooStackParamList>();

export default function TattooNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TattooHome" component={TattooHomeScreen} />
      <Stack.Screen name="TattooGallery" component={TattooGalleryScreen} />
      <Stack.Screen name="TattooDetail" component={TattooDetailScreen} />
      <Stack.Screen name="TattooBooking" component={TattooBookingScreen} />
    </Stack.Navigator>
  );
}
```

---

## Reglas de desarrollo por módulo

### Lo que SÍ debes hacer

- Trabajar únicamente dentro de `modules/<tu-modulo>/`
- Si necesitas un componente compartido, hablar con el otro dev antes de crearlo en `app/components/`
- Usar siempre los path aliases (`@app/`, `@modules/`, etc.)
- Usar los QUERY_KEYS de `utils/constants.ts` para React Query
- Usar `useUIStore().showToast()` para mostrar mensajes al usuario
- Tipar todo con TypeScript, sin usar `any`

### Lo que NO debes hacer

- No tocar archivos fuera de `modules/<tu-modulo>/` sin coordinarlo
- No agregar dependencias sin avisarle al otro dev
- No hacer commits directamente a `main` o `develop`
- No hardcodear colores o tamaños — usar siempre el theme
- No hacer peticiones HTTP directamente — siempre a través de un service

---

## Flujo de trabajo diario

```
1. git pull origin develop         ← Actualizar antes de empezar
2. Trabajar en tu módulo
3. git add <archivos>
4. git commit -m "feat: ..."       ← Husky corre lint automáticamente
5. git push origin feature/mi-rama
6. Crear Pull Request hacia develop
```
