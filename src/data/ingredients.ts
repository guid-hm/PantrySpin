import type { IngredientCategory, IngredientData } from "@/types";

export const INGREDIENT_DATA: Record<string, IngredientData> = {
  // Vegetables
  Tomato:       { cat: "Vegetables", color: "#E94F37", swatch: "#FBE1DA" },
  Onion:        { cat: "Vegetables", color: "#C8924F", swatch: "#F5E4CC" },
  Garlic:       { cat: "Vegetables", color: "#FFD166", swatch: "#FFF1CC" },
  Spinach:      { cat: "Vegetables", color: "#2A9D8F", swatch: "#D4ECE9" },
  "Bell Pepper":{ cat: "Vegetables", color: "#E94F37", swatch: "#FBE1DA" },
  Broccoli:     { cat: "Vegetables", color: "#2A9D8F", swatch: "#D4ECE9" },
  Mushroom:     { cat: "Vegetables", color: "#8A857D", swatch: "#E7DEC8" },
  Carrot:       { cat: "Vegetables", color: "#E89A4B", swatch: "#FFE1CC" },
  Lemon:        { cat: "Vegetables", color: "#FFD166", swatch: "#FFF1CC" },
  Avocado:      { cat: "Vegetables", color: "#7CA552", swatch: "#E2EBD0" },
  Lime:         { cat: "Vegetables", color: "#A3C53C", swatch: "#E8EFC8" },
  Cilantro:     { cat: "Vegetables", color: "#2A9D8F", swatch: "#D4ECE9" },
  Kale:         { cat: "Vegetables", color: "#1F7A6F", swatch: "#D4ECE9" },
  Potato:       { cat: "Vegetables", color: "#C8924F", swatch: "#F5E4CC" },
  "Sweet Potato":{ cat: "Vegetables", color: "#E89A4B", swatch: "#FFE1CC" },
  Ginger:       { cat: "Vegetables", color: "#E6B43A", swatch: "#FFF1CC" },

  // Protein
  Chicken:      { cat: "Protein", color: "#E89A4B", swatch: "#FFE7C8" },
  Beef:         { cat: "Protein", color: "#C8371F", swatch: "#FBE1DA" },
  Eggs:         { cat: "Protein", color: "#FFD166", swatch: "#FFFBF1" },
  Tofu:         { cat: "Protein", color: "#F5EAD0", swatch: "#FFF1CC" },
  Beans:        { cat: "Protein", color: "#8B5A2B", swatch: "#E8C5A0" },
  Chickpeas:    { cat: "Protein", color: "#E6B43A", swatch: "#FFF1CC" },
  Shrimp:       { cat: "Protein", color: "#E89A4B", swatch: "#FFE7C8" },
  Salmon:       { cat: "Protein", color: "#E94F37", swatch: "#FBE1DA" },

  // Grains
  Rice:         { cat: "Grains", color: "#F5EAD0", swatch: "#FFFBF1" },
  Pasta:        { cat: "Grains", color: "#FFD166", swatch: "#FFF1CC" },
  Bread:        { cat: "Grains", color: "#E89A4B", swatch: "#F5E4CC" },
  Tortillas:    { cat: "Grains", color: "#F5EAD0", swatch: "#FFF1CC" },
  Quinoa:       { cat: "Grains", color: "#E6B43A", swatch: "#FFF1CC" },
  Oats:         { cat: "Grains", color: "#F5EAD0", swatch: "#FFF1CC" },

  // Dairy
  Cheese:       { cat: "Dairy", color: "#FFD166", swatch: "#FFF1CC" },
  Butter:       { cat: "Dairy", color: "#FFD166", swatch: "#FFF1CC" },
  Milk:         { cat: "Dairy", color: "#FFFBF1", swatch: "#FFFBF1" },
  Yogurt:       { cat: "Dairy", color: "#FFFBF1", swatch: "#FFFBF1" },
  Parmesan:     { cat: "Dairy", color: "#FFD166", swatch: "#FFF1CC" },

  // Pantry
  "Olive Oil":     { cat: "Pantry", color: "#2A9D8F", swatch: "#D4ECE9" },
  "Soy Sauce":     { cat: "Pantry", color: "#5C3A1E", swatch: "#E8C5A0" },
  Vinegar:         { cat: "Pantry", color: "#F5EAD0", swatch: "#FFFBF1" },
  Honey:           { cat: "Pantry", color: "#E6B43A", swatch: "#FFF1CC" },
  Flour:           { cat: "Pantry", color: "#F5EAD0", swatch: "#FFFBF1" },
  "Canned Tomato": { cat: "Pantry", color: "#E94F37", swatch: "#FBE1DA" },
  "Coconut Milk":  { cat: "Pantry", color: "#FFFBF1", swatch: "#FFFBF1" },

  // Spices
  Basil:         { cat: "Spices", color: "#2A9D8F", swatch: "#D4ECE9" },
  "Chili Flakes":{ cat: "Spices", color: "#E94F37", swatch: "#FBE1DA" },
  Cumin:         { cat: "Spices", color: "#8B5A2B", swatch: "#E8C5A0" },
  Paprika:       { cat: "Spices", color: "#E94F37", swatch: "#FBE1DA" },
  "Black Pepper":{ cat: "Spices", color: "#2D2A26", swatch: "#E7DEC8" },
};

export const CATEGORY_DEFAULTS: Record<IngredientCategory, { color: string; swatch: string }> = {
  Vegetables: { color: "#2A9D8F", swatch: "#D4ECE9" },
  Protein:    { color: "#E89A4B", swatch: "#FFE7C8" },
  Grains:     { color: "#E6B43A", swatch: "#FFF1CC" },
  Dairy:      { color: "#FFD166", swatch: "#FFF1CC" },
  Pantry:     { color: "#8B5A2B", swatch: "#E8C5A0" },
  Spices:     { color: "#E94F37", swatch: "#FBE1DA" },
  Fruits:     { color: "#E94F37", swatch: "#FBE1DA" },
  Other:      { color: "#8A857D", swatch: "#E7DEC8" },
};

export const ING_CATEGORIES_LIST: IngredientCategory[] = [
  "Vegetables", "Protein", "Grains", "Dairy", "Pantry", "Spices", "Fruits", "Other",
];

export const QUICK_ADD = [
  "Rice", "Pasta", "Eggs", "Cheese", "Beans", "Tortillas",
  "Canned Tomato", "Garlic", "Onion", "Olive Oil", "Butter", "Flour",
  "Milk", "Tomato", "Spinach", "Chicken", "Bell Pepper", "Lemon",
];

export const SUBSTITUTIONS: Record<string, string> = {
  Basil:       "Use spinach or parsley — or skip it entirely.",
  Parmesan:    "Any hard cheese works: pecorino, aged cheddar, or nutritional yeast.",
  Chicken:     "Swap in beans, tofu, or chickpeas for a vegetarian version.",
  Pasta:       "Any noodle shape works — penne, fusilli, rice noodles, even rice itself.",
  Tomato:      "Canned tomatoes are a great stand-in. Use 1 cup canned per fresh tomato.",
  Lemon:       "Lime works, or a splash of vinegar.",
  "Olive Oil": "Any neutral cooking oil — avocado, vegetable, or even butter.",
  Cheese:      "Skip it, or top with a drizzle of olive oil for richness.",
  Onion:       "Shallots, leeks, or even a pinch of onion powder.",
  Garlic:      "Garlic powder — ¼ tsp per clove.",
};

// SVG icon glyphs — small flat silhouettes (cream-on-color).
export const ICON_SVGS: Record<string, string> = {
  Tomato:       '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5c-.6 0-1 .4-1 1v.3c-1.8.3-3.5 1.2-4.7 2.5C4.7 9.7 4 11.7 4 13.8c0 3.4 3.5 6.2 8 6.2s8-2.8 8-6.2c0-2.1-.7-4.1-2.3-5.5-1.2-1.3-2.9-2.2-4.7-2.5v-.3c0-.6-.4-1-1-1zm-2 .7c.3-.5.8-.8 1.4-.8.6-.6 1.5-1 2.3-1 .3 0 .5.1.7.3-.3.4-.8.6-1.4.7-.6.2-1.2.6-1.6 1-.4-.1-.9-.2-1.4-.2zm-1.5 1.6c.4 0 .8.1 1.1.3-.5.5-.9 1.1-1.2 1.8-.3-.1-.6-.1-.9-.1-.5 0-1 .1-1.4.2.5-1 1.4-1.8 2.4-2.2z"/></svg>',
  Onion:        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-.4 0-.7.3-.8.6L10 6c-2.8.7-5 3.3-5 6.5C5 16.6 8.1 20 12 20s7-3.4 7-7.5c0-3.2-2.2-5.8-5-6.5l-1.2-2.4c-.1-.3-.4-.6-.8-.6zm-2 4c.6 1.1 1.2 2.3 1.4 3.5h-1c-.4-1.2-1-2.4-1.7-3.5h1.3zm3 0h1.3c-.7 1.1-1.3 2.3-1.7 3.5h-1c.2-1.2.8-2.4 1.4-3.5z"/></svg>',
  Garlic:       '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-.5 0-.9.4-1 .9-.7.6-1.5 1.6-2.3 2.8C7.6 8 7 9.6 7 11c0 4 2.2 8 5 8s5-4 5-8c0-1.4-.6-3-1.7-4.3-.8-1.2-1.6-2.2-2.3-2.8-.1-.5-.5-.9-1-.9zm-2 5c-.5 1-1 2.2-1 3 0 1.5.5 3 1.2 4-.7-1.5-1.2-3.2-1.2-4.5 0-.9.4-1.8 1-2.5zm4 0c.6.7 1 1.6 1 2.5 0 1.3-.5 3-1.2 4.5.7-1 1.2-2.5 1.2-4 0-.8-.5-2-1-3z"/></svg>',
  Pasta:        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 14c0-.6.4-1 1-1h14c.6 0 1 .4 1 1v2c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4v-2zm2 1v1c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-1H6zm.5-3c-.3 0-.5-.2-.5-.5C6 8.5 8.5 6 11.5 6h1C15.5 6 18 8.5 18 11.5c0 .3-.2.5-.5.5h-11zm1 0c.3 0 .5-.2.5-.5C8 9.5 9.5 8 11.5 8s3.5 1.5 3.5 3.5c0 .3.2.5.5.5h-9z"/></svg>',
  Rice:         '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 12c0-3.3 3.6-6 8-6s8 2.7 8 6v3c0 .6-.4 1-1 1H5c-.6 0-1-.4-1-1v-3zm3 0c.6 0 1-.4 1-1 0-.6-.4-1-1-1s-1 .4-1 1c0 .6.4 1 1 1zm5-2c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm4 2c.6 0 1-.4 1-1 0-.6-.4-1-1-1s-1 .4-1 1c0 .6.4 1 1 1zm-7 4c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2H9z"/></svg>',
  Cheese:       '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 10c0-.4.2-.7.5-.9l8-4c.3-.1.6-.1.9 0l5 2c.4.2.6.5.6.9v6c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-4zm3 1c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm6 0c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm-3 2c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z"/></svg>',
  Spinach:      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-2 0-4 1-5.5 2.5C5 7 4 9 4 11c0 4 2.5 6.5 6 8 .3.1.6.1.9 0C14.5 17.5 17 15 17 11c0-2-1-4-2.5-5.5C13 4 11 3 9 3h3zm-4 5c.3-.3.6-.5 1-.6-.2.6-.3 1.2-.3 1.8 0 1 .3 1.9.8 2.7-.6-.3-1.1-.9-1.4-1.6-.4-.7-.4-1.5-.1-2.3zm5 6c.6-.8.9-1.7.9-2.7 0-.6-.1-1.2-.3-1.8.4.1.7.3 1 .6.3.8.2 1.6-.1 2.3-.3.7-.9 1.3-1.5 1.6z"/></svg>',
  Beans:        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7c-1.7 0-3 1.3-3 3v4c0 1.7 1.3 3 3 3 1.2 0 2.2-.7 2.7-1.7.6.4 1.4.7 2.3.7.8 0 1.6-.3 2.3-.7.5 1 1.5 1.7 2.7 1.7 1.7 0 3-1.3 3-3v-4c0-1.7-1.3-3-3-3-1.2 0-2.2.7-2.7 1.7-.7-.4-1.5-.7-2.3-.7-.9 0-1.7.3-2.3.7C9.2 7.7 8.2 7 7 7zm0 2c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm10 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"/></svg>',
  Eggs:         '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-3.3 0-6 4-6 9 0 4.4 2.7 8 6 8s6-3.6 6-8c0-5-2.7-9-6-9zm-1.5 4c1.4-1.3 2.6-1 3 .5.3 1.5-.6 2.5-2 2.5s-2.4-1.5-1-3z"/></svg>',
  "Bell Pepper":'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5c-.6 0-1-.4-1-1 0-.6.4-1 1-1s1 .4 1 1c0 .6-.4 1-1 1zm-1 0v2c-3 0-5 1.5-5 5v3c0 2.8 2.2 5 5 5h2c2.8 0 5-2.2 5-5v-3c0-3.5-2-5-5-5V5h-2zm0 4c-1.5.5-2.5 1.5-3 3 0-1.7 1.3-3 3-3z"/></svg>',
  Chicken:      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 8c0-1.7 1.3-3 3-3h4c1.7 0 3 1.3 3 3v3c0 2.8-2.2 5-5 5s-5-2.2-5-5V8zm3 5c0 1.1.9 2 2 2s2-.9 2-2H10zm-2 4l-2 4h2l2-4H8zm8 0l2 4h-2l-2-4h2z"/></svg>',
  "Olive Oil":  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 3h2v3l1 1v3c1.1 0 2 .9 2 2v8c0 .6-.4 1-1 1H9c-.6 0-1-.4-1-1v-8c0-1.1.9-2 2-2V7l1-1V3zm-1 11h4v5h-4v-5z"/></svg>',
  Lemon:        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 12c0-3.9 3.1-7 7-7s7 3.1 7 7-3.1 7-7 7-7-3.1-7-7zm3 0c0 2.2 1.8 4 4 4s4-1.8 4-4-1.8-4-4-4-4 1.8-4 4zm9-5l2-2-1-1-2 2 1 1z"/></svg>',
  Mushroom:     '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 11c0-3.9 3.1-7 7-7s7 3.1 7 7c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1zm5 3h4v4c0 1.1-.9 2-2 2s-2-.9-2-2v-4z"/></svg>',
  Carrot:       '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 4l1-1 1 1-1 1 1 1-2 1-1-2 1-1zM6 19l8-8 3 3-8 8c-.4.4-1 .4-1.4 0L6 20.4c-.4-.4-.4-1 0-1.4zm6-7l-2 4 2-2 2 2-4-4z"/></svg>',
  Broccoli:     '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4c-1.5 0-3 1-3.5 2.5C7 7 6 8.5 6 10c0 1 .5 2 1.5 2.5L8 19c0 .6.4 1 1 1h6c.6 0 1-.4 1-1l.5-6.5c1-.5 1.5-1.5 1.5-2.5 0-1.5-1-3-2.5-3.5C15 5 13.5 4 12 4z"/></svg>',
  Beef:         '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 9c0-1.7 1.3-3 3-3h6c1.7 0 3 1.3 3 3v6c0 1.7-1.3 3-3 3H9c-1.7 0-3-1.3-3-3V9zm3 2c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm6 4c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"/></svg>',
  Tofu:         '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 8c0-.6.4-1 1-1h12c.6 0 1 .4 1 1v8c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1V8zm2 1v6h10V9H7zm2 1h2v2H9v-2zm4 0h2v2h-2v-2zm-4 3h2v2H9v-2zm4 0h2v2h-2v-2z"/></svg>',
  Chickpeas:    '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="10" r="2.5"/><circle cx="14" cy="9" r="2"/><circle cx="11" cy="14" r="2.5"/><circle cx="16" cy="14" r="2"/><circle cx="7" cy="15" r="1.7"/></svg>',
  Shrimp:       '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 14c-.5-2 .5-5 4-6 3-1 5 1 6 3 1 2 2 5-1 7-3 1-7 0-9-2-.5-.5-.4-1.5 0-2zm9-3c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm-9 3l-2 2 1 1 2-2-1-1zm12 0l1 3-2-1-1-2 2 0z"/></svg>',
  Salmon:       '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 12c0-1 .5-2 2-2h11l3-2v8l-3-2H6c-1.5 0-2-1-2-2zm12-1c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"/></svg>',
  Bread:        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 10c0-2.2 1.8-4 4-4h6c2.2 0 4 1.8 4 4v6c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-6zm3 2v3h2v-3H8zm4 0v3h2v-3h-2z"/></svg>',
  Tortillas:    '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="5" fill="rgba(0,0,0,0.15)"/><circle cx="9" cy="9" r="1"/><circle cx="14" cy="11" r="1.2"/><circle cx="11" cy="14" r="1"/></svg>',
  Quinoa:       '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="9" r="1.4"/><circle cx="12" cy="8" r="1.2"/><circle cx="16" cy="10" r="1.4"/><circle cx="10" cy="12" r="1.3"/><circle cx="14" cy="13" r="1.3"/><circle cx="9" cy="15" r="1.2"/><circle cx="13" cy="16" r="1.4"/></svg>',
  Oats:         '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5l1 4-1-1-1 1 1-4zm-5 4l3 2-2 0v1l-1-3zm10 0l-1 3v-1l-2 0 3-2zm-5 4l1 4-1-1-1 1 1-4z"/></svg>',
  Butter:       '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 11c0-.6.4-1 1-1h12c.6 0 1 .4 1 1v6c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-6zm2-2l3-4h4l3 4H7z"/></svg>',
  Milk:         '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3h6v3l2 2v11c0 .6-.4 1-1 1H8c-.6 0-1-.4-1-1V8l2-2V3zm0 7v8h6v-8H9z"/></svg>',
  Yogurt:       '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 8h10l-1 11c0 .6-.4 1-1 1H9c-.6 0-1-.4-1-1L7 8zm0-1c0-.6.4-1 1-1h8c.6 0 1 .4 1 1H7zm3 4v6h4v-6h-4z"/></svg>',
  Parmesan:     '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 17l8-12 8 12-8 1-8-1zm8-7c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm-3 4c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm6 0c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z"/></svg>',
  "Soy Sauce":  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 3h4v4l3 1v11c0 .6-.4 1-1 1H8c-.6 0-1-.4-1-1V8l3-1V3zm0 8v6h4v-6h-4z"/></svg>',
  Vinegar:      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 3h2v3l2 3v9c0 .6-.4 1-1 1h-4c-.6 0-1-.4-1-1V9l2-3V3zm-1 9v5h4v-5h-4z"/></svg>',
  Honey:        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l5 3v6l-5 3-5-3V7l5-3zm0 2.3L9 8v4l3 1.7L15 12V8l-3-1.7z"/></svg>',
  Flour:        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v3H6V6zm0 4h12v9c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1v-9zm3 2v4h2v-4H9zm4 0v4h2v-4h-2z"/></svg>',
  "Canned Tomato":'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 6h10v2H7V6zm0 3h10v10c0 .6-.4 1-1 1H8c-.6 0-1-.4-1-1V9zm2 2v6h2v-6H9zm4 0v6h2v-6h-2z"/></svg>',
  "Coconut Milk":'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3h6v3l2 2v11c0 .6-.4 1-1 1H8c-.6 0-1-.4-1-1V8l2-2V3zm0 8h6v3H9v-3z"/></svg>',
  Basil:        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 4c-2 0-4 1-5 3-1.5 3 0 7 3 8 .3 0 .5 0 .8-.3C15 12 16 9 15 6c-.3-1-1-2-1-2zm-4 5c-2 1-3 4-1 6-2-3 0-5 1-6z"/></svg>',
  "Chili Flakes":'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="7" cy="8" r="1.5"/><circle cx="12" cy="7" r="1.2"/><circle cx="17" cy="9" r="1.3"/><circle cx="9" cy="12" r="1.3"/><circle cx="15" cy="13" r="1.5"/><circle cx="8" cy="16" r="1.2"/><circle cx="13" cy="16" r="1.4"/><circle cx="17" cy="15" r="1.2"/></svg>',
  Cumin:        '<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="8" cy="8" rx="1.2" ry="2.4" transform="rotate(20 8 8)"/><ellipse cx="14" cy="9" rx="1.2" ry="2.4" transform="rotate(-15 14 9)"/><ellipse cx="10" cy="13" rx="1.2" ry="2.4" transform="rotate(30 10 13)"/><ellipse cx="16" cy="14" rx="1.2" ry="2.4" transform="rotate(-20 16 14)"/><ellipse cx="9" cy="17" rx="1.2" ry="2.4"/></svg>',
  Paprika:      '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="9" r="1.2"/><circle cx="12" cy="8" r="1"/><circle cx="16" cy="9" r="1.1"/><circle cx="10" cy="12" r="1.1"/><circle cx="14" cy="12" r="1.2"/><circle cx="8" cy="15" r="1"/><circle cx="12" cy="15" r="1.2"/><circle cx="16" cy="15" r="1"/></svg>',
  "Black Pepper":'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="9" r="1.6"/><circle cx="14" cy="10" r="1.4"/><circle cx="11" cy="13" r="1.5"/><circle cx="15" cy="15" r="1.3"/><circle cx="9" cy="16" r="1.4"/></svg>',
  Avocado:      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4c-3 0-5 2-5 7 0 4 2 8 5 8s5-4 5-8c0-5-2-7-5-7zm0 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/></svg>',
  Lime:         '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="4" fill="rgba(0,0,0,0.15)"/><path d="M12 8v8M8 12h8" stroke="rgba(0,0,0,0.2)" stroke-width="1" fill="none"/></svg>',
  Cilantro:     '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4v4c-2 0-3 1-3 3 0 1 .5 2 1.5 2.5L9 19h6l-1.5-5.5C14.5 13 15 12 15 11c0-2-1-3-3-3V4h0z"/></svg>',
  Kale:         '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4c-2 0-4 2-4 5 0 1-1 2-2 3-1 1-1 3 0 4 2 1 5 1 6-2 1 3 4 3 6 2 1-1 1-3 0-4-1-1-2-2-2-3 0-3-2-5-4-5z"/></svg>',
  Potato:       '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 11c0-3 2-6 5-6s5 3 5 6c0 4-2 8-5 8s-5-4-5-8zm3 0c0 .6.4 1 1 1s1-.4 1-1-.4-1-1-1-1 .4-1 1zm3 3c0 .6.4 1 1 1s1-.4 1-1-.4-1-1-1-1 .4-1 1z"/></svg>',
  "Sweet Potato":'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 12c0-3 2-7 6-7s6 4 6 7-2 7-6 7-6-4-6-7zm3 0c0 .6.4 1 1 1s1-.4 1-1-.4-1-1-1-1 .4-1 1zm4 3c0 .6.4 1 1 1s1-.4 1-1-.4-1-1-1-1 .4-1 1z"/></svg>',
  Ginger:       '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 13c1-2 3-3 5-2 1 0 2-1 3-2 2-1 4 0 5 2 1 2 0 4-2 5-1 0-2 1-3 2-2 1-4 1-6-1-2-1-2-3-2-4z"/></svg>',
};

export function ingredientIcon(name: string): string {
  if (ICON_SVGS[name]) return ICON_SVGS[name];
  const letter = (name || "?").trim().charAt(0).toUpperCase();
  return `<svg viewBox="0 0 24 24" fill="currentColor"><text x="12" y="17" text-anchor="middle" font-size="13" font-weight="800" font-family="Fraunces, serif" letter-spacing="-0.02em">${letter}</text></svg>`;
}
