import * as SecureStore from 'expo-secure-store';

const DIRECTORY_KEY = 'hr_mock_user_directory';

interface DirectoryEntry {
  id: string;
  name: string;
  dateOfBirth?: string; // ISO 'YYYY-MM-DD'
  avatar?: string; // URI local (mock); backend real guardaría una URL
}

// Mock local de "base de datos de usuarios" mientras no existe backend real
// (ver TODO(AWS) en LoginScreen/RegisterScreen — Cognito hará esto de forma
// nativa: el User Pool ya sabe el nombre de cada correo registrado). Esto
// solo evita que, en este prototipo, el nombre que alguien dio al
// registrarse se pierda si vuelve a iniciar sesión con email/contraseña.
async function readDirectory(): Promise<Record<string, DirectoryEntry>> {
  const raw = await SecureStore.getItemAsync(DIRECTORY_KEY);
  return raw ? (JSON.parse(raw) as Record<string, DirectoryEntry>) : {};
}

export async function saveMockUser(
  email: string,
  id: string,
  name: string,
  dateOfBirth?: string,
  avatar?: string,
): Promise<void> {
  const directory = await readDirectory();
  directory[email.toLowerCase()] = { id, name, dateOfBirth, avatar };
  await SecureStore.setItemAsync(DIRECTORY_KEY, JSON.stringify(directory));
}

export async function findMockUser(email: string): Promise<DirectoryEntry | null> {
  const directory = await readDirectory();
  return directory[email.toLowerCase()] ?? null;
}

// Fallback cuando el correo no está en el directorio (p. ej. login sin haber
// pasado por Register en este dispositivo): mejor que un nombre fijo tipo
// "Dev User" — usa la parte antes del @ y la capitaliza.
export function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? '';
  const words = local
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1));
  return words.join(' ') || 'Usuario';
}
