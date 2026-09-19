/** Convierte lo que el usuario va tecleando en un input a formato DD/MM/AAAA. */
export function formatDobInput(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return [day, month, year].filter(Boolean).join('/');
}

/**
 * Valida un DD/MM/AAAA (fecha real, no futura, edad razonable) y lo
 * devuelve como fecha ISO 'YYYY-MM-DD'. Devuelve null si es inválida.
 */
export function dobToISO(value: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return null;

  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);

  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  if (!isRealDate) return null;

  const now = new Date();
  const minYear = now.getFullYear() - 120;
  if (year < minYear || date > now) return null;

  return `${yyyy}-${mm}-${dd}`;
}
