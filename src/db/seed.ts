export const SEED_CATEGORIES = [
  { id: 'food', name: 'Food', color: '#F2B183' },
  { id: 'tech', name: 'Tech', color: '#7FD6D0' },
  { id: 'travel', name: 'Travel', color: '#F5A3C7' },
  { id: 'home', name: 'Home', color: '#9CCBEB' },
  { id: 'services', name: 'Services', color: '#E6E3A1' },
  { id: 'health', name: 'Health', color: '#A8E39A' },
  { id: 'entertain', name: 'Entertain.', color: '#B48CF0' },
  { id: 'social', name: 'Social', color: '#F7D774' },
  { id: 'education', name: 'Education', color: '#7FB38A' },
  { id: 'clothes', name: 'Clothes', color: '#E07A6F' },
  { id: 'charity', name: 'Charity', color: '#7C84E6' },
  { id: 'other', name: 'Other', color: '#8C8C8C' },
].map((c, i) => ({ ...c, sortOrder: i }));

export type Category = (typeof SEED_CATEGORIES)[number];
