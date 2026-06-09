export type MerchCategory = {
  id: string;
  label: string;
  emoji: string;
};

export const MERCH_CATEGORIES: MerchCategory[] = [
  { id: 'playeras', label: 'Playeras', emoji: '👕' },
  { id: 'sudaderas', label: 'Sudaderas', emoji: '🧥' },
  { id: 'gorras', label: 'Gorras', emoji: '🧢' },
  { id: 'pants', label: 'Pants', emoji: '👖' },
  { id: 'conjuntos', label: 'Conjuntos', emoji: '✨' },
];
