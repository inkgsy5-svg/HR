# Documento 4 — Cómo trabajar con Git, Terraform, EAS y más

---

## 1. Git — comandos del día a día

Ya cubierto en detalle en `03-git-workflow.md`. Resumen de los más usados:

```bash
git pull origin develop          # Actualizar antes de empezar
git checkout -b feature/nombre  # Nueva rama de trabajo
git add <archivo>                # Stagear cambio específico
git commit -m "feat: ..."        # Commitear (lint corre automáticamente)
git push origin feature/nombre  # Subir rama al remoto
```

---

## 2. Expo / React Native — comandos del día a día

### Iniciar en desarrollo

```bash
npm start              # Inicia el servidor de Expo
                       # Presionar i → iOS Simulator
                       # Presionar a → Android Emulator
                       # Escanear QR → Expo Go en celular físico
```

### Limpiar caché (cuando algo raro pasa)

```bash
npm start -- --clear   # Limpia el Metro bundler cache
npx expo start -c      # Alternativa
```

### Instalar una nueva dependencia

```bash
# Para paquetes compatibles con Expo, usar siempre:
npx expo install <paquete>
# Esto instala la versión compatible con tu SDK automáticamente

# Ejemplo:
npx expo install expo-image-picker
npx expo install react-native-maps

# Para paquetes de JavaScript puro:
npm install <paquete>
```

**Importante:** después de instalar un nuevo paquete que tenga código nativo, avisar al otro dev para que corra `npm install` también.

---

## 3. EAS Build — builds en la nube

EAS (Expo Application Services) es el servicio de Expo para hacer builds sin necesidad de tener Xcode o Android Studio configurados localmente.

### Configuración inicial (solo una vez)

```bash
# Instalar EAS CLI globalmente
npm install -g eas-cli

# Iniciar sesión con tu cuenta de Expo
eas login

# Configurar el proyecto (genera el projectId en app.json)
eas build:configure
```

### Hacer un build

```bash
# Build para ambas plataformas (Android + iOS) — perfil preview
eas build --platform all --profile preview

# Solo Android
eas build --platform android --profile preview

# Solo iOS
eas build --platform ios --profile preview
```

### Cuándo usar cada perfil

| Perfil        | Cuándo usarlo                                          | Resultado                                         |
| ------------- | ------------------------------------------------------ | ------------------------------------------------- |
| `development` | Para instalar Expo Dev Client en tu dispositivo físico | APK/IPA de desarrollo                             |
| `preview`     | Para compartir con el cliente o hacer QA               | APK directo (Android) / IPA para TestFlight (iOS) |
| `production`  | Para publicar en las tiendas                           | Build firmado para App Store / Play Store         |

### Ver el estado de tus builds

```bash
eas build:list          # Lista todos los builds
```

O en la web: [expo.dev](https://expo.dev) → Tu proyecto → Builds

### Publicar actualización OTA (sin nuevo build)

Para cambios que no tocan código nativo (pantallas, estilos, lógica):

```bash
eas update --branch preview --message "fix: corregir botón de login"
```

Los usuarios ven la actualización la próxima vez que abran la app.

---

## 4. Terraform — infraestructura en AWS

Terraform es la herramienta para crear y gestionar la infraestructura en la nube (base de datos, servidor, almacenamiento, etc.) de forma reproducible y versionada.

### Instalación

```bash
# macOS con Homebrew
brew install terraform

# Verificar instalación
terraform version
```

### Estructura del proyecto de infraestructura

```
infrastructure/
├── main.tf                   ← Archivo principal
├── modules/
│   ├── rds/                  ← Base de datos (PostgreSQL en Amazon RDS)
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── ec2/                  ← Servidor de la API (Amazon EC2)
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── s3/                   ← Almacenamiento de fotos (Amazon S3)
│   ├── cognito/              ← Autenticación (Amazon Cognito)
│   └── api-gateway/          ← API Gateway
└── environments/
    ├── dev/                  ← Variables para desarrollo
    │   ├── main.tf
    │   └── terraform.tfvars  ← NO subir a Git (tiene credenciales)
    └── prod/                 ← Variables para producción
        ├── main.tf
        └── terraform.tfvars  ← NO subir a Git
```

### Comandos básicos de Terraform

```bash
# Siempre trabajar desde la carpeta del ambiente
cd infrastructure/environments/dev

# 1. Inicializar (solo la primera vez o al agregar módulos)
terraform init

# 2. Ver qué va a crear/modificar/eliminar
terraform plan

# 3. Aplicar los cambios (crear infraestructura)
terraform apply
# Escribir "yes" cuando pide confirmación

# 4. Ver el estado actual
terraform show

# 5. Destruir infraestructura (CUIDADO — solo para ambientes de dev)
terraform destroy
```

### Flujo de trabajo con Terraform

```
1. Hacer cambios en los archivos .tf
2. terraform plan          ← Ver qué va a cambiar
3. Revisar el plan con cuidado
4. terraform apply         ← Aplicar
5. git add + git commit    ← Versionar el cambio de infraestructura
```

**Regla de oro:** nunca crear recursos manualmente en la consola de AWS. Todo debe estar en Terraform para que sea reproducible.

---

## 5. AWS — servicios que usa la app

### Cognito — autenticación

- Maneja el registro e inicio de sesión de usuarios
- La app usa `expo-secure-store` para guardar el token de Cognito
- El cliente Axios lo adjunta automáticamente en cada petición

### S3 — almacenamiento de fotos

- Fotos de tatuajes, galerías de piercing y resina se suben aquí
- Para subir desde la app se usará `expo-image-picker` + SDK de AWS

### EC2 — servidor de la API

- El backend (Node.js/Express o el que se decida) corre aquí
- La URL base va en `.env.development` como `API_URL`

### SNS — notificaciones push

- Para enviar notificaciones de promociones nuevas a los usuarios

### RDS — base de datos

- PostgreSQL para guardar citas, productos, usuarios, etc.

---

## 6. Sentry — monitoreo de errores en producción

### Configuración inicial (ya instalado, falta activar)

```bash
npx @sentry/wizard@latest -i reactNative
```

Esto genera el `SENTRY_DSN` que va en `.env.production`.

### Uso en código

El `ErrorBoundary` ya reporta automáticamente. Para capturar errores específicos:

```ts
import * as Sentry from '@sentry/react-native';

// Reportar error manualmente
Sentry.captureException(error);

// Agregar contexto al error
Sentry.setUser({ id: user.id, email: user.email });
```

---

## 7. Checklist antes de cada Pull Request

Antes de abrir un PR, verificar:

```
□ El código corre sin errores en el simulador
□ npm run lint → sin errores
□ No hay console.log de debug en el código
□ Los tipos de TypeScript están definidos (sin any)
□ Las pantallas nuevas están registradas en el Navigator
□ Los endpoints nuevos están en services/api/endpoints.ts
□ Los QUERY_KEYS nuevos están en utils/constants.ts
□ No se hardcodearon colores ni tamaños (usar theme)
□ Las credenciales NO están en el código (usar .env)
```

---

## 8. Flujo completo del proyecto — visión general

```
Desarrollo local
    ↓ git push → feature branch
Code Review en GitHub
    ↓ PR aprobado → merge a develop
Develop branch
    ↓ eas build --profile preview
Build de preview
    ↓ Testing en dispositivos reales
QA aprobado
    ↓ PR aprobado → merge a main
Main branch
    ↓ eas build --profile production
App Store + Play Store
```

---

## 9. Variables de entorno — cómo agregar una nueva

1. Agregarla en `.env.example` (sin el valor real):

```
NUEVA_VARIABLE=
```

2. Agregarla en `.env.development` con el valor real (no se sube a Git):

```
NUEVA_VARIABLE=valor_real
```

3. Leerla en el código a través de `expo-constants`:

```ts
import Constants from 'expo-constants';

const miVariable = Constants.expoConfig?.extra?.nuevaVariable;
```

4. Registrarla en `app.json` bajo `extra`:

```json
"extra": {
  "nuevaVariable": process.env.NUEVA_VARIABLE
}
```

5. Para builds de EAS, agregarla en el dashboard de Expo:
   - expo.dev → Tu proyecto → Environment variables
