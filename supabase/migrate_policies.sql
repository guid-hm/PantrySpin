-- Run this in the Supabase SQL editor to replace the old RLS policies.
-- Safe to run even if old policies don't exist (IF EXISTS).

-- Drop old policies
DROP POLICY IF EXISTS "ingredients_own_write"  ON ingredients;
DROP POLICY IF EXISTS "recipes_own_write"       ON recipes;
DROP POLICY IF EXISTS "ri_write"                ON recipe_ingredients;
DROP POLICY IF EXISTS "rs_write"                ON recipe_steps;
DROP POLICY IF EXISTS "rt_write"                ON recipe_tags;
DROP POLICY IF EXISTS "own_pantry"              ON pantry_items;
DROP POLICY IF EXISTS "own_saved"               ON saved_recipes;
DROP POLICY IF EXISTS "own_grocery"             ON grocery_items;
DROP POLICY IF EXISTS "own_prefs"               ON user_prefs;
DROP POLICY IF EXISTS "own_overrides"           ON ingredient_overrides;

-- New fine-grained policies with explicit WITH CHECK

CREATE POLICY "ingredients_own_insert"   ON ingredients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ingredients_own_update"   ON ingredients FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ingredients_own_delete"   ON ingredients FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "recipes_own_insert"   ON recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "recipes_own_update"   ON recipes FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "recipes_own_delete"   ON recipes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "ri_insert" ON recipe_ingredients FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));
CREATE POLICY "ri_delete" ON recipe_ingredients FOR DELETE
  USING (EXISTS (SELECT 1 FROM recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));

CREATE POLICY "rs_insert" ON recipe_steps FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));
CREATE POLICY "rs_delete" ON recipe_steps FOR DELETE
  USING (EXISTS (SELECT 1 FROM recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));

CREATE POLICY "rt_insert" ON recipe_tags FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));
CREATE POLICY "rt_delete" ON recipe_tags FOR DELETE
  USING (EXISTS (SELECT 1 FROM recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));

CREATE POLICY "own_pantry_select"   ON pantry_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_pantry_insert"   ON pantry_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_pantry_update"   ON pantry_items FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_pantry_delete"   ON pantry_items FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "own_saved_select"    ON saved_recipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_saved_insert"    ON saved_recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_saved_delete"    ON saved_recipes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "own_grocery_select"  ON grocery_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_grocery_insert"  ON grocery_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_grocery_update"  ON grocery_items FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_grocery_delete"  ON grocery_items FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "own_prefs_select"    ON user_prefs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_prefs_insert"    ON user_prefs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_prefs_update"    ON user_prefs FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own_overrides_select" ON ingredient_overrides FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_overrides_insert" ON ingredient_overrides FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_overrides_update" ON ingredient_overrides FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_overrides_delete" ON ingredient_overrides FOR DELETE USING (auth.uid() = user_id);
