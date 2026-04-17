export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(
    'es-MX',
    options ?? { day: '2-digit', month: 'short', year: 'numeric' },
  );
}

export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

export function timeUntil(target: string | Date): string {
  const now = Date.now();
  const end = new Date(target).getTime();
  const diff = end - now;

  if (diff <= 0) return 'Expirado';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}
