-- ================================================================
-- PantrySpin schema
-- Run this once in the Supabase SQL editor.
-- ================================================================

-- Global ingredient catalog (user_id IS NULL = global seed, NOT NULL = user-created)
CREATE TABLE IF NOT EXISTS ingredients (
  name        TEXT        PRIMARY KEY,
  cat         TEXT        NOT NULL,
  color       TEXT        NOT NULL DEFAULT '#8A857D',
  swatch      TEXT        NOT NULL DEFAULT '#E7DEC8',
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Recipes: global (user_id IS NULL) or user-created (user_id NOT NULL)
CREATE TABLE IF NOT EXISTS recipes (
  id              TEXT        PRIMARY KEY,
  user_id         UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL,
  category        TEXT        NOT NULL,
  time_minutes    INT         NOT NULL DEFAULT 20,
  difficulty      TEXT        NOT NULL DEFAULT 'Easy',
  servings        INT         NOT NULL DEFAULT 2,
  diet            TEXT[]      NOT NULL DEFAULT '{}',
  blurb           TEXT        NOT NULL DEFAULT '',
  illus_key       TEXT        NOT NULL DEFAULT 'pasta-tomato',
  is_user_created BOOLEAN     NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  recipe_id TEXT    NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name      TEXT    NOT NULL,
  optional  BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (recipe_id, name, optional)
);

CREATE TABLE IF NOT EXISTS recipe_steps (
  recipe_id   TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_index  INT  NOT NULL,
  body        TEXT NOT NULL,
  PRIMARY KEY (recipe_id, step_index)
);

CREATE TABLE IF NOT EXISTS recipe_tags (
  recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  tag       TEXT NOT NULL,
  PRIMARY KEY (recipe_id, tag)
);

-- User data tables
CREATE TABLE IF NOT EXISTS pantry_items (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL,
  expires_in_days INT         NOT NULL DEFAULT 14,
  location        TEXT        NOT NULL DEFAULT 'Pantry',
  qty             TEXT        NOT NULL DEFAULT '',
  unit            TEXT        NOT NULL DEFAULT '',
  notes           TEXT        NOT NULL DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, name)
);

CREATE TABLE IF NOT EXISTS saved_recipes (
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id  TEXT        NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  saved_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS grocery_items (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  cat        TEXT        NOT NULL DEFAULT 'Other',
  qty        TEXT        NOT NULL DEFAULT '',
  checked    BOOLEAN     NOT NULL DEFAULT false,
  src        TEXT        NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, name)
);

CREATE TABLE IF NOT EXISTS user_prefs (
  user_id    UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  diet       TEXT        NOT NULL DEFAULT 'No preference',
  avoid      TEXT[]      NOT NULL DEFAULT '{}',
  max_time   INT         NOT NULL DEFAULT 30,
  difficulty TEXT        NOT NULL DEFAULT 'Easy',
  servings   INT         NOT NULL DEFAULT 2,
  priority   TEXT        NOT NULL DEFAULT 'use-what-i-have',
  onboarded  BOOLEAN     NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ingredient_overrides (
  user_id    UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT    NOT NULL,
  cat        TEXT,
  color      TEXT,
  swatch     TEXT,
  is_custom  BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (user_id, name)
);

-- ================================================================
-- Row Level Security
-- ================================================================

ALTER TABLE ingredients          ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients   ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_steps         ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_tags          ENABLE ROW LEVEL SECURITY;
ALTER TABLE pantry_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_recipes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_prefs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_overrides ENABLE ROW LEVEL SECURITY;

-- ingredients: global readable by all authenticated users; custom by owner
CREATE POLICY "ingredients_global_read"  ON ingredients FOR SELECT USING (user_id IS NULL);
CREATE POLICY "ingredients_own_read"     ON ingredients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ingredients_own_insert"   ON ingredients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ingredients_own_update"   ON ingredients FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ingredients_own_delete"   ON ingredients FOR DELETE USING (auth.uid() = user_id);

-- recipes: global readable; user recipes by owner
CREATE POLICY "recipes_global_read"  ON recipes FOR SELECT USING (user_id IS NULL);
CREATE POLICY "recipes_own_read"     ON recipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "recipes_own_insert"   ON recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "recipes_own_update"   ON recipes FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "recipes_own_delete"   ON recipes FOR DELETE USING (auth.uid() = user_id);

-- recipe child tables follow recipe ownership
CREATE POLICY "ri_read" ON recipe_ingredients FOR SELECT
  USING (EXISTS (SELECT 1 FROM recipes r WHERE r.id = recipe_id AND (r.user_id IS NULL OR r.user_id = auth.uid())));
CREATE POLICY "ri_insert" ON recipe_ingredients FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));
CREATE POLICY "ri_delete" ON recipe_ingredients FOR DELETE
  USING (EXISTS (SELECT 1 FROM recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));

CREATE POLICY "rs_read" ON recipe_steps FOR SELECT
  USING (EXISTS (SELECT 1 FROM recipes r WHERE r.id = recipe_id AND (r.user_id IS NULL OR r.user_id = auth.uid())));
CREATE POLICY "rs_insert" ON recipe_steps FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));
CREATE POLICY "rs_delete" ON recipe_steps FOR DELETE
  USING (EXISTS (SELECT 1 FROM recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));

CREATE POLICY "rt_read" ON recipe_tags FOR SELECT
  USING (EXISTS (SELECT 1 FROM recipes r WHERE r.id = recipe_id AND (r.user_id IS NULL OR r.user_id = auth.uid())));
CREATE POLICY "rt_insert" ON recipe_tags FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));
CREATE POLICY "rt_delete" ON recipe_tags FOR DELETE
  USING (EXISTS (SELECT 1 FROM recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));

-- User data tables: owner only
CREATE POLICY "own_pantry_select"   ON pantry_items        FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_pantry_insert"   ON pantry_items        FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_pantry_update"   ON pantry_items        FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_pantry_delete"   ON pantry_items        FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "own_saved_select"    ON saved_recipes       FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_saved_insert"    ON saved_recipes       FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_saved_delete"    ON saved_recipes       FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "own_grocery_select"  ON grocery_items       FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_grocery_insert"  ON grocery_items       FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_grocery_update"  ON grocery_items       FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_grocery_delete"  ON grocery_items       FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "own_prefs_select"    ON user_prefs          FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_prefs_insert"    ON user_prefs          FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_prefs_update"    ON user_prefs          FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own_overrides_select" ON ingredient_overrides FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_overrides_insert" ON ingredient_overrides FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_overrides_update" ON ingredient_overrides FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_overrides_delete" ON ingredient_overrides FOR DELETE USING (auth.uid() = user_id);
