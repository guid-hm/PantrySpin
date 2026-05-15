-- Grant table-level privileges to Supabase roles.
-- RLS policies control which ROWS are accessible; GRANTs control whether
-- the role can touch the table at all. Both are required.

GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Global/read-only tables: readable by anon too (needed for seed data before auth resolves)
GRANT SELECT ON
  ingredients,
  recipes,
  recipe_ingredients,
  recipe_steps,
  recipe_tags
TO anon, authenticated;

-- User data tables: authenticated only
GRANT SELECT, INSERT, UPDATE, DELETE ON pantry_items         TO authenticated;
GRANT SELECT, INSERT,          DELETE ON saved_recipes        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON grocery_items         TO authenticated;
GRANT SELECT, INSERT, UPDATE          ON user_prefs            TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ingredient_overrides  TO authenticated;
