-- Starter categories. Must match SEED_CATEGORIES in src/db/seed.ts (a test checks this).
INSERT INTO categories (id, name, color, sort_order) VALUES
  ('food', 'Food', '#F2B183', 0),
  ('tech', 'Tech', '#7FD6D0', 1),
  ('travel', 'Travel', '#F5A3C7', 2),
  ('home', 'Home', '#9CCBEB', 3),
  ('services', 'Services', '#E6E3A1', 4),
  ('health', 'Health', '#A8E39A', 5),
  ('entertain', 'Entertain.', '#B48CF0', 6),
  ('social', 'Social', '#F7D774', 7),
  ('education', 'Education', '#7FB38A', 8),
  ('clothes', 'Clothes', '#E07A6F', 9),
  ('charity', 'Charity', '#7C84E6', 10),
  ('other', 'Other', '#8C8C8C', 11);
