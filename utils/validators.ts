export const validators = {
  email: (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  password: (value: string): boolean => value.length >= 8,
  phone: (value: string): boolean => /^\+?[\d\s\-()]{10,}$/.test(value),
  required: (value: string): boolean => value.trim().length > 0,
};

export function getEmailError(email: string): string | undefined {
  if (!validators.required(email)) return 'El correo es requerido';
  if (!validators.email(email)) return 'Correo electrónico inválido';
  return undefined;
}

export function getPasswordError(password: string): string | undefined {
  if (!validators.required(password)) return 'La contraseña es requerida';
  if (!validators.password(password)) return 'Mínimo 8 caracteres';
  return undefined;
}
