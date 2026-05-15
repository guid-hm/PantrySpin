-- ================================================================
-- PantrySpin seed data
-- Run AFTER schema.sql.  Safe to re-run (ON CONFLICT DO NOTHING).
-- ================================================================

-- ----------------------------------------------------------------
-- Ingredients (global catalog)
-- ----------------------------------------------------------------
INSERT INTO ingredients (name, cat, color, swatch) VALUES
  ('Tomato',        'Vegetables', '#E94F37', '#FBE1DA'),
  ('Onion',         'Vegetables', '#C8924F', '#F5E4CC'),
  ('Garlic',        'Vegetables', '#FFD166', '#FFF1CC'),
  ('Spinach',       'Vegetables', '#2A9D8F', '#D4ECE9'),
  ('Bell Pepper',   'Vegetables', '#E94F37', '#FBE1DA'),
  ('Broccoli',      'Vegetables', '#2A9D8F', '#D4ECE9'),
  ('Mushroom',      'Vegetables', '#8A857D', '#E7DEC8'),
  ('Carrot',        'Vegetables', '#E89A4B', '#FFE1CC'),
  ('Lemon',         'Vegetables', '#FFD166', '#FFF1CC'),
  ('Avocado',       'Vegetables', '#7CA552', '#E2EBD0'),
  ('Lime',          'Vegetables', '#A3C53C', '#E8EFC8'),
  ('Cilantro',      'Vegetables', '#2A9D8F', '#D4ECE9'),
  ('Kale',          'Vegetables', '#1F7A6F', '#D4ECE9'),
  ('Potato',        'Vegetables', '#C8924F', '#F5E4CC'),
  ('Sweet Potato',  'Vegetables', '#E89A4B', '#FFE1CC'),
  ('Ginger',        'Vegetables', '#E6B43A', '#FFF1CC'),
  ('Chicken',       'Protein',    '#E89A4B', '#FFE7C8'),
  ('Beef',          'Protein',    '#C8371F', '#FBE1DA'),
  ('Eggs',          'Protein',    '#FFD166', '#FFFBF1'),
  ('Tofu',          'Protein',    '#F5EAD0', '#FFF1CC'),
  ('Beans',         'Protein',    '#8B5A2B', '#E8C5A0'),
  ('Chickpeas',     'Protein',    '#E6B43A', '#FFF1CC'),
  ('Shrimp',        'Protein',    '#E89A4B', '#FFE7C8'),
  ('Salmon',        'Protein',    '#E94F37', '#FBE1DA'),
  ('Rice',          'Grains',     '#F5EAD0', '#FFFBF1'),
  ('Pasta',         'Grains',     '#FFD166', '#FFF1CC'),
  ('Bread',         'Grains',     '#E89A4B', '#F5E4CC'),
  ('Tortillas',     'Grains',     '#F5EAD0', '#FFF1CC'),
  ('Quinoa',        'Grains',     '#E6B43A', '#FFF1CC'),
  ('Oats',          'Grains',     '#F5EAD0', '#FFF1CC'),
  ('Cheese',        'Dairy',      '#FFD166', '#FFF1CC'),
  ('Butter',        'Dairy',      '#FFD166', '#FFF1CC'),
  ('Milk',          'Dairy',      '#FFFBF1', '#FFFBF1'),
  ('Yogurt',        'Dairy',      '#FFFBF1', '#FFFBF1'),
  ('Parmesan',      'Dairy',      '#FFD166', '#FFF1CC'),
  ('Olive Oil',     'Pantry',     '#2A9D8F', '#D4ECE9'),
  ('Soy Sauce',     'Pantry',     '#5C3A1E', '#E8C5A0'),
  ('Vinegar',       'Pantry',     '#F5EAD0', '#FFFBF1'),
  ('Honey',         'Pantry',     '#E6B43A', '#FFF1CC'),
  ('Flour',         'Pantry',     '#F5EAD0', '#FFFBF1'),
  ('Canned Tomato', 'Pantry',     '#E94F37', '#FBE1DA'),
  ('Coconut Milk',  'Pantry',     '#FFFBF1', '#FFFBF1'),
  ('Hummus',        'Pantry',     '#E6B43A', '#FFF1CC'),
  ('Basil',         'Spices',     '#2A9D8F', '#D4ECE9'),
  ('Chili Flakes',  'Spices',     '#E94F37', '#FBE1DA'),
  ('Cumin',         'Spices',     '#8B5A2B', '#E8C5A0'),
  ('Paprika',       'Spices',     '#E94F37', '#FBE1DA'),
  ('Black Pepper',  'Spices',     '#2D2A26', '#E7DEC8')
ON CONFLICT (name) DO NOTHING;

-- ----------------------------------------------------------------
-- Recipes
-- ----------------------------------------------------------------

INSERT INTO recipes (id, name, category, time_minutes, difficulty, servings, diet, blurb, illus_key) VALUES
  ('tomato-garlic-pasta',    'Tomato Garlic Pasta',           'pasta',     20, 'Easy', 2, ARRAY['vegetarian'], 'Sweet jammy tomatoes melt with garlic into a glossy sauce. The whole thing comes together in the time it takes pasta to cook.', 'pasta-tomato'),
  ('chicken-rice-skillet',   'Chicken & Rice Skillet',        'skillet',   30, 'Easy', 3, ARRAY[]::TEXT[],     'Everything cooks in one skillet — juicy seared chicken, then rice that soaks up all the pan flavor.', 'skillet'),
  ('white-bean-spinach-soup','White Bean & Spinach Soup',     'soup',      25, 'Easy', 4, ARRAY['vegetarian'], 'A 25-minute pantry soup with broth so good you''ll want to drink it from a mug.', 'soup'),
  ('lemon-spinach-pasta',    'Lemon Spinach Pasta',           'pasta',     20, 'Easy', 2, ARRAY['vegetarian'], 'Bright, herby, and ready in 20 minutes. A perfect Tuesday-night pasta.', 'lemon-pasta'),
  ('cheesy-rice-beans',      'Cheesy Rice & Beans',           'rice',      25, 'Easy', 3, ARRAY['vegetarian'], 'A burrito-bowl-style one-pot dinner. Cheap, fast, deeply satisfying.', 'rice-beans'),
  ('garlic-egg-fried-rice',  'Garlic Egg Fried Rice',         'rice',      15, 'Easy', 2, ARRAY['vegetarian'], 'Cold leftover rice is the secret to perfect fried rice. Fifteen minutes start to finish.', 'fried-rice'),
  ('veggie-wrap',            'Loaded Veggie Wrap',            'wrap',      10, 'Easy', 1, ARRAY['vegetarian'], 'Ten minutes from fridge to lunch. Everything you have, all wrapped up.', 'wrap'),
  ('tomato-spinach-salad',   'Tomato Spinach Salad',          'salad',     10, 'Easy', 2, ARRAY['vegetarian'], 'The platonic ideal of a side salad: ripe tomato, peppery greens, a slick of good oil.', 'salad'),
  ('spinach-eggs',           'Spinach & Eggs on Toast',       'breakfast', 15, 'Easy', 1, ARRAY['vegetarian'], 'Breakfast-for-dinner that uses up that last handful of spinach.', 'eggs-toast'),
  ('pepper-skillet',         'Sausage-less Pepper Skillet',   'skillet',   25, 'Easy', 3, ARRAY['vegetarian'], 'Sweet peppers and onions stewed soft with tomatoes — a Spanish-style one-pan.', 'pepper-skillet'),
  ('garlic-broccoli-pasta',  'Garlic Broccoli Pasta',         'pasta',     20, 'Easy', 2, ARRAY['vegetarian'], 'Tender-crisp broccoli, golden garlic, plenty of black pepper. Don''t underestimate the simple plate.', 'pasta-broccoli'),
  ('veggie-soup',            'Anything-in-the-Fridge Soup',   'soup',      30, 'Easy', 4, ARRAY['vegetarian'], 'The recipe for when you have a lot of half-vegetables. Forgiving in every way.', 'veggie-soup')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- Recipe ingredients
-- ----------------------------------------------------------------
INSERT INTO recipe_ingredients (recipe_id, name, optional) VALUES
  ('tomato-garlic-pasta', 'Pasta',       false),
  ('tomato-garlic-pasta', 'Tomato',      false),
  ('tomato-garlic-pasta', 'Garlic',      false),
  ('tomato-garlic-pasta', 'Olive Oil',   false),
  ('tomato-garlic-pasta', 'Cheese',      false),
  ('tomato-garlic-pasta', 'Basil',       true),
  ('tomato-garlic-pasta', 'Chili Flakes',true),

  ('chicken-rice-skillet','Chicken',     false),
  ('chicken-rice-skillet','Rice',        false),
  ('chicken-rice-skillet','Onion',       false),
  ('chicken-rice-skillet','Bell Pepper', false),
  ('chicken-rice-skillet','Garlic',      false),
  ('chicken-rice-skillet','Paprika',     true),
  ('chicken-rice-skillet','Cumin',       true),

  ('white-bean-spinach-soup','Beans',    false),
  ('white-bean-spinach-soup','Spinach',  false),
  ('white-bean-spinach-soup','Garlic',   false),
  ('white-bean-spinach-soup','Onion',    false),
  ('white-bean-spinach-soup','Olive Oil',false),
  ('white-bean-spinach-soup','Parmesan', true),
  ('white-bean-spinach-soup','Lemon',    true),

  ('lemon-spinach-pasta','Pasta',        false),
  ('lemon-spinach-pasta','Spinach',      false),
  ('lemon-spinach-pasta','Lemon',        false),
  ('lemon-spinach-pasta','Garlic',       false),
  ('lemon-spinach-pasta','Olive Oil',    false),
  ('lemon-spinach-pasta','Parmesan',     true),
  ('lemon-spinach-pasta','Black Pepper', true),

  ('cheesy-rice-beans','Rice',           false),
  ('cheesy-rice-beans','Beans',          false),
  ('cheesy-rice-beans','Cheese',         false),
  ('cheesy-rice-beans','Onion',          false),
  ('cheesy-rice-beans','Garlic',         false),
  ('cheesy-rice-beans','Cumin',          true),
  ('cheesy-rice-beans','Cilantro',       true),
  ('cheesy-rice-beans','Lime',           true),

  ('garlic-egg-fried-rice','Rice',       false),
  ('garlic-egg-fried-rice','Eggs',       false),
  ('garlic-egg-fried-rice','Garlic',     false),
  ('garlic-egg-fried-rice','Soy Sauce',  false),
  ('garlic-egg-fried-rice','Olive Oil',  false),
  ('garlic-egg-fried-rice','Onion',      true),
  ('garlic-egg-fried-rice','Bell Pepper',true),

  ('veggie-wrap','Tortillas',            false),
  ('veggie-wrap','Cheese',               false),
  ('veggie-wrap','Spinach',              false),
  ('veggie-wrap','Tomato',               false),
  ('veggie-wrap','Avocado',              false),
  ('veggie-wrap','Hummus',               true),
  ('veggie-wrap','Bell Pepper',          true),

  ('tomato-spinach-salad','Spinach',     false),
  ('tomato-spinach-salad','Tomato',      false),
  ('tomato-spinach-salad','Olive Oil',   false),
  ('tomato-spinach-salad','Lemon',       false),
  ('tomato-spinach-salad','Cheese',      false),
  ('tomato-spinach-salad','Basil',       true),
  ('tomato-spinach-salad','Black Pepper',true),

  ('spinach-eggs','Eggs',                false),
  ('spinach-eggs','Spinach',             false),
  ('spinach-eggs','Bread',               false),
  ('spinach-eggs','Butter',              false),
  ('spinach-eggs','Garlic',              false),
  ('spinach-eggs','Chili Flakes',        true),
  ('spinach-eggs','Lemon',               true),

  ('pepper-skillet','Bell Pepper',       false),
  ('pepper-skillet','Onion',             false),
  ('pepper-skillet','Tomato',            false),
  ('pepper-skillet','Beans',             false),
  ('pepper-skillet','Olive Oil',         false),
  ('pepper-skillet','Paprika',           true),
  ('pepper-skillet','Basil',             true),

  ('garlic-broccoli-pasta','Pasta',      false),
  ('garlic-broccoli-pasta','Broccoli',   false),
  ('garlic-broccoli-pasta','Garlic',     false),
  ('garlic-broccoli-pasta','Olive Oil',  false),
  ('garlic-broccoli-pasta','Cheese',     false),
  ('garlic-broccoli-pasta','Chili Flakes',true),
  ('garlic-broccoli-pasta','Lemon',      true),

  ('veggie-soup','Onion',                false),
  ('veggie-soup','Garlic',               false),
  ('veggie-soup','Tomato',               false),
  ('veggie-soup','Beans',                false),
  ('veggie-soup','Spinach',              false),
  ('veggie-soup','Pasta',                true),
  ('veggie-soup','Olive Oil',            true),
  ('veggie-soup','Parmesan',             true)
ON CONFLICT (recipe_id, name, optional) DO NOTHING;

-- ----------------------------------------------------------------
-- Recipe steps
-- ----------------------------------------------------------------
INSERT INTO recipe_steps (recipe_id, step_index, body) VALUES
  ('tomato-garlic-pasta', 0, 'Bring a pot of well-salted water to a boil. Add **pasta** and cook to package directions, about 9 minutes.'),
  ('tomato-garlic-pasta', 1, 'While pasta cooks, warm a glug of **olive oil** in a wide pan over medium heat. Add sliced **garlic** and sizzle 30 seconds until fragrant — don''t let it brown.'),
  ('tomato-garlic-pasta', 2, 'Add halved **tomatoes** and a pinch of salt. Cook 5–6 minutes, smashing gently with a spoon, until they slump into a sauce.'),
  ('tomato-garlic-pasta', 3, 'Reserve ½ cup pasta water, then drain. Toss pasta into the pan with a splash of pasta water. Finish with grated **cheese** and a crack of pepper.'),
  ('tomato-garlic-pasta', 4, 'Plate, taste, adjust salt. Eat immediately.'),

  ('chicken-rice-skillet', 0, 'Pat **chicken** dry and season generously with salt and pepper. Sear in a hot skillet 4 minutes per side until deeply golden. Set aside.'),
  ('chicken-rice-skillet', 1, 'In the same pan, sauté diced **onion** and **bell pepper** for 4 minutes. Add minced **garlic** and cook 30 seconds more.'),
  ('chicken-rice-skillet', 2, 'Stir in **rice**, toast for a minute, then add 1½ cups water and a pinch of salt. Nestle chicken back in.'),
  ('chicken-rice-skillet', 3, 'Cover and simmer on low for 18 minutes, until rice is tender. Rest off heat 5 minutes before serving.'),

  ('white-bean-spinach-soup', 0, 'Warm **olive oil** in a pot. Add diced **onion** with a pinch of salt and cook 5 minutes until soft.'),
  ('white-bean-spinach-soup', 1, 'Add minced **garlic** and cook 30 seconds.'),
  ('white-bean-spinach-soup', 2, 'Pour in 4 cups of water or broth and rinsed **beans**. Simmer 10 minutes.'),
  ('white-bean-spinach-soup', 3, 'Stir in **spinach** by the handful until wilted. Finish with a squeeze of **lemon** and grated **parmesan** if you have it.'),

  ('lemon-spinach-pasta', 0, 'Boil **pasta** in salty water to package directions.'),
  ('lemon-spinach-pasta', 1, 'Meanwhile, warm **olive oil** in a wide pan. Sizzle sliced **garlic** until just golden.'),
  ('lemon-spinach-pasta', 2, 'Add **spinach** in batches and wilt. Off heat, add the zest and juice of one **lemon**.'),
  ('lemon-spinach-pasta', 3, 'Toss drained pasta in the pan with a splash of pasta water. Finish with **parmesan** and lots of black pepper.'),

  ('cheesy-rice-beans', 0, 'Sauté diced **onion** in oil. Add **garlic** and a pinch of **cumin**.'),
  ('cheesy-rice-beans', 1, 'Stir in **rice** and 2 cups water. Cover and simmer 15 min.'),
  ('cheesy-rice-beans', 2, 'Add rinsed **beans** and warm through. Stir in **cheese** off heat.'),
  ('cheesy-rice-beans', 3, 'Top with **cilantro** and a squeeze of **lime**.'),

  ('garlic-egg-fried-rice', 0, 'Heat **olive oil** in a wok or wide pan over high heat. Add minced **garlic** and sizzle 15 seconds.'),
  ('garlic-egg-fried-rice', 1, 'Push aside; crack in **eggs** and scramble until just set.'),
  ('garlic-egg-fried-rice', 2, 'Add cold **rice**, breaking up clumps. Toss for 2–3 minutes until heated and a little crispy.'),
  ('garlic-egg-fried-rice', 3, 'Splash with **soy sauce**, toss, and serve hot.'),

  ('veggie-wrap', 0, 'Warm a **tortilla** in a dry pan for 30 seconds per side.'),
  ('veggie-wrap', 1, 'Layer with **spinach**, sliced **tomato**, smashed **avocado**, and grated **cheese**.'),
  ('veggie-wrap', 2, 'Roll tight, cut on the diagonal.'),

  ('tomato-spinach-salad', 0, 'Toss **spinach** and chopped **tomato** in a wide bowl.'),
  ('tomato-spinach-salad', 1, 'Whisk **olive oil** with **lemon** juice, salt, and pepper. Pour over.'),
  ('tomato-spinach-salad', 2, 'Crumble **cheese** on top. Eat before it wilts.'),

  ('spinach-eggs', 0, 'Toast **bread** until golden. Rub with a halved garlic clove. Spread with **butter**.'),
  ('spinach-eggs', 1, 'Wilt **spinach** in a pan with a knob of butter and a pinch of salt.'),
  ('spinach-eggs', 2, 'In the same pan, fry **eggs** to your liking.'),
  ('spinach-eggs', 3, 'Pile spinach on toast, top with eggs and a pinch of **chili flakes**.'),

  ('pepper-skillet', 0, 'Slice **bell pepper** and **onion** into thick strips. Sauté in **olive oil** 10 minutes.'),
  ('pepper-skillet', 1, 'Add chopped **tomato** and **beans**. Season with paprika, salt, pepper.'),
  ('pepper-skillet', 2, 'Simmer 10 minutes until thick. Finish with **basil**.'),

  ('garlic-broccoli-pasta', 0, 'Boil **pasta**. Three minutes before it''s done, drop **broccoli** florets into the same water.'),
  ('garlic-broccoli-pasta', 1, 'Meanwhile, sizzle sliced **garlic** in plenty of **olive oil**.'),
  ('garlic-broccoli-pasta', 2, 'Drain pasta + broccoli (save a cup of water). Toss in the garlic oil with **cheese**. Add splashes of pasta water until silky.'),

  ('veggie-soup', 0, 'Sauté **onion** in olive oil. Add **garlic**.'),
  ('veggie-soup', 1, 'Add chopped **tomato**, **beans**, and 4 cups water. Simmer 15 minutes.'),
  ('veggie-soup', 2, 'Stir in **spinach** to wilt. Eat hot with bread.')
ON CONFLICT (recipe_id, step_index) DO NOTHING;

-- ----------------------------------------------------------------
-- Recipe tags
-- ----------------------------------------------------------------
INSERT INTO recipe_tags (recipe_id, tag) VALUES
  ('tomato-garlic-pasta', 'Vegetarian'),
  ('tomato-garlic-pasta', 'One pan'),
  ('tomato-garlic-pasta', 'Comfort'),

  ('chicken-rice-skillet', 'High protein'),
  ('chicken-rice-skillet', 'One pan'),

  ('white-bean-spinach-soup', 'Vegetarian'),
  ('white-bean-spinach-soup', 'High protein'),
  ('white-bean-spinach-soup', 'Cozy'),

  ('lemon-spinach-pasta', 'Vegetarian'),
  ('lemon-spinach-pasta', 'Quick'),
  ('lemon-spinach-pasta', 'Bright'),

  ('cheesy-rice-beans', 'Vegetarian'),
  ('cheesy-rice-beans', 'Budget'),
  ('cheesy-rice-beans', 'Comfort'),

  ('garlic-egg-fried-rice', 'Quick'),
  ('garlic-egg-fried-rice', 'High protein'),
  ('garlic-egg-fried-rice', 'Uses leftovers'),

  ('veggie-wrap', 'Vegetarian'),
  ('veggie-wrap', 'Quick'),
  ('veggie-wrap', 'No cook'),

  ('tomato-spinach-salad', 'Vegetarian'),
  ('tomato-spinach-salad', 'No cook'),
  ('tomato-spinach-salad', 'Quick'),

  ('spinach-eggs', 'Vegetarian'),
  ('spinach-eggs', 'Quick'),
  ('spinach-eggs', 'High protein'),

  ('pepper-skillet', 'Vegetarian'),
  ('pepper-skillet', 'One pan'),
  ('pepper-skillet', 'Mediterranean'),

  ('garlic-broccoli-pasta', 'Vegetarian'),
  ('garlic-broccoli-pasta', 'Healthy'),

  ('veggie-soup', 'Vegetarian'),
  ('veggie-soup', 'Uses leftovers'),
  ('veggie-soup', 'Cozy')
ON CONFLICT (recipe_id, tag) DO NOTHING;
