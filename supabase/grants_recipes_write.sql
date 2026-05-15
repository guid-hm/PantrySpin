-- Grant write permissions on recipe tables to authenticated users.
-- SELECT was already granted in grants.sql; this adds INSERT/UPDATE/DELETE
-- so authenticated users can create, edit, and delete their own recipes.
-- RLS policies still restrict each user to their own rows.

GRANT INSERT, UPDATE, DELETE ON recipes             TO authenticated;
GRANT INSERT,         DELETE ON recipe_ingredients  TO authenticated;
GRANT INSERT,         DELETE ON recipe_steps        TO authenticated;
GRANT INSERT,         DELETE ON recipe_tags         TO authenticated;
