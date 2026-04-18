# Documento 3 — Git: subir el repo y flujo de trabajo

---

## Parte A — Subir el proyecto a GitHub por primera vez (solo el líder)

### 1. Crear el repositorio en GitHub

1. Ir a [github.com](https://github.com) → **New repository**
2. Nombre: `hr-app`
3. Visibilidad: **Private**
4. NO marcar "Initialize with README" (ya tenemos uno)
5. Clic en **Create repository**

### 2. Conectar el repo local con GitHub

```bash
# Estando dentro de la carpeta hr-app
cd /Users/isaacrodriguez/Desktop/App-HR/hr-app

# Agregar el remote de GitHub (reemplazar con tu URL real)
git remote add origin https://github.com/<TU_USUARIO>/hr-app.git

# Renombrar la rama actual a main
git branch -M main

# Primer push
git push -u origin main
```

### 3. Crear la rama develop

```bash
git checkout -b develop
git push -u origin develop
```

A partir de aquí:

- `main` → código en producción, solo se toca con PRs aprobados
- `develop` → integración de trabajo de ambos devs
- `feature/*` → ramas de trabajo individuales

### 4. Proteger las ramas en GitHub

En el repositorio → **Settings → Branches → Add rule**:

Para `main`:

- ✅ Require a pull request before merging
- ✅ Require status checks to pass (lint)
- ✅ Require at least 1 approval

Para `develop`:

- ✅ Require a pull request before merging

### 5. Invitar al otro desarrollador

GitHub → **Settings → Collaborators → Add people**

Agregar el usuario de GitHub del Dev 2 con rol **Write**.

---

## Parte B — El otro dev clona y arranca (Dev 2)

```bash
# 1. Clonar
git clone https://github.com/<USUARIO>/hr-app.git
cd hr-app

# 2. Instalar dependencias
npm install

# 3. Crear archivo de variables de entorno
cp .env.example .env.development
# Pedirle al Dev 1 las credenciales reales para llenar el archivo

# 4. Verificar que corra
npm start
```

---

## Parte C — Flujo de trabajo diario (ambos devs)

### Antes de empezar a trabajar cada día

```bash
# Asegurarse de estar en tu rama
git branch                          # Ver en qué rama estás

# Actualizar develop
git checkout develop
git pull origin develop

# Actualizar tu rama con los últimos cambios
git checkout feature/mi-modulo
git merge develop                   # Trae cambios de develop a tu rama
```

### Durante el trabajo

```bash
# Ver qué archivos modificaste
git status

# Agregar archivos específicos (NUNCA git add . en un proyecto compartido)
git add modules/tattoo/screens/TattooHomeScreen.tsx
git add modules/tattoo/components/TattooCard.tsx

# Hacer commit (Husky corre lint automáticamente antes de commitear)
git commit -m "feat(tattoo): add gallery screen with react query"

# Si el commit es rechazado por lint, corregir el error y repetir
npm run lint:fix
git add <archivos corregidos>
git commit -m "feat(tattoo): add gallery screen with react query"
```

### Convención de mensajes de commit

```
tipo(modulo): descripción corta en minúsculas

Tipos válidos:
  feat     → nueva funcionalidad
  fix      → corrección de bug
  style    → cambios de CSS/estilos, sin lógica
  refactor → reestructura de código sin cambiar funcionalidad
  chore    → instalación de dependencias, configuración
  test     → agregar o modificar tests
  docs     → documentación

Ejemplos:
  feat(tattoo): add gallery screen and TattooCard component
  fix(auth): handle 401 error on token expiry
  chore(deps): add react-native-image-picker
  style(barber): adjust card spacing to match design
```

### Subir cambios y crear Pull Request

```bash
# Subir tu rama a GitHub
git push origin feature/mi-modulo

# Ir a GitHub → el repo mostrará un banner "Compare & pull request"
# Clic en ese banner
# Base: develop  ←  Compare: feature/mi-modulo
# Título: feat(tattoo): gallery screen completa
# Descripción: qué hiciste, qué probar, capturas si aplica
# Asignar al otro dev para review
# Clic en Create Pull Request
```

### Después de que aprueban el PR

```bash
# En GitHub, hacer Merge (Squash and merge recomendado)

# Localmente, actualizar develop
git checkout develop
git pull origin develop

# Eliminar la rama ya mergeada
git branch -d feature/mi-modulo
git push origin --delete feature/mi-modulo

# Crear nueva rama para el siguiente módulo
git checkout -b feature/tattoo-booking
```

---

## Parte D — Resolver conflictos

Los conflictos ocurren cuando dos personas modificaron el mismo archivo. Así se resuelven:

```bash
# Al hacer git merge develop en tu rama, Git avisa del conflicto
# Ejemplo: conflicto en app/navigation/types.ts

# Abrir el archivo. Verás algo así:
<<<<<<< HEAD (tus cambios)
  TattooDetail: { id: string; style: string };
=======
  TattooDetail: { id: string };
>>>>>>> develop (cambios de develop)

# Editar el archivo dejando la versión correcta:
  TattooDetail: { id: string; style: string };

# Guardar el archivo, luego:
git add app/navigation/types.ts
git commit -m "chore: resolve merge conflict in navigation types"
```

**Tip para evitar conflictos:** hablar con el otro dev antes de tocar archivos compartidos como `app/navigation/types.ts`.

---

## Parte E — Flujo completo visual

```
main ─────────────────────────────────────────── (producción)
      ↑ PR aprobado
develop ──────────────────────────────────────── (integración)
      ↑ PR aprobado    ↑ PR aprobado
feature/tattoo         feature/barber
  (Dev 1)                (Dev 2)
```

---

## Comandos Git de referencia rápida

```bash
git status                    # Ver archivos modificados
git branch                    # Ver ramas
git branch -a                 # Ver todas las ramas (local + remoto)
git checkout <rama>           # Cambiar de rama
git checkout -b <nueva>       # Crear y cambiar a nueva rama
git pull origin <rama>        # Bajar cambios del remoto
git push origin <rama>        # Subir cambios al remoto
git merge <rama>              # Traer cambios de otra rama
git log --oneline -10         # Ver últimos 10 commits
git diff                      # Ver cambios no commiteados
git stash                     # Guardar cambios temporalmente
git stash pop                 # Recuperar cambios guardados
git reset HEAD~1              # Deshacer último commit (sin perder cambios)
```
