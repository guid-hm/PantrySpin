/* data.js — recipes, ingredients, icons. Loaded as plain JS (no JSX). */

// Curated ingredient list with food-icon SVGs and category metadata.
// Icons drawn as cream-on-color flat silhouettes to match brand pictogram set.
const INGREDIENT_DATA = {
  // Vegetables
  "Tomato":      { cat: "Vegetables", color: "#E94F37", swatch: "#FBE1DA" },
  "Onion":       { cat: "Vegetables", color: "#C8924F", swatch: "#F5E4CC" },
  "Garlic":      { cat: "Vegetables", color: "#FFD166", swatch: "#FFF1CC" },
  "Spinach":     { cat: "Vegetables", color: "#2A9D8F", swatch: "#D4ECE9" },
  "Bell Pepper": { cat: "Vegetables", color: "#E94F37", swatch: "#FBE1DA" },
  "Broccoli":    { cat: "Vegetables", color: "#2A9D8F", swatch: "#D4ECE9" },
  "Mushroom":    { cat: "Vegetables", color: "#8A857D", swatch: "#E7DEC8" },
  "Carrot":      { cat: "Vegetables", color: "#E89A4B", swatch: "#FFE1CC" },
  "Lemon":       { cat: "Vegetables", color: "#FFD166", swatch: "#FFF1CC" },
  "Avocado":     { cat: "Vegetables", color: "#7CA552", swatch: "#E2EBD0" },
  "Lime":        { cat: "Vegetables", color: "#A3C53C", swatch: "#E8EFC8" },
  "Cilantro":    { cat: "Vegetables", color: "#2A9D8F", swatch: "#D4ECE9" },
  "Kale":        { cat: "Vegetables", color: "#1F7A6F", swatch: "#D4ECE9" },
  "Potato":      { cat: "Vegetables", color: "#C8924F", swatch: "#F5E4CC" },
  "Sweet Potato":{ cat: "Vegetables", color: "#E89A4B", swatch: "#FFE1CC" },
  "Ginger":      { cat: "Vegetables", color: "#E6B43A", swatch: "#FFF1CC" },

  // Protein
  "Chicken":     { cat: "Protein", color: "#E89A4B", swatch: "#FFE7C8" },
  "Beef":        { cat: "Protein", color: "#C8371F", swatch: "#FBE1DA" },
  "Eggs":        { cat: "Protein", color: "#FFD166", swatch: "#FFFBF1" },
  "Tofu":        { cat: "Protein", color: "#F5EAD0", swatch: "#FFF1CC" },
  "Beans":       { cat: "Protein", color: "#8B5A2B", swatch: "#E8C5A0" },
  "Chickpeas":   { cat: "Protein", color: "#E6B43A", swatch: "#FFF1CC" },
  "Shrimp":      { cat: "Protein", color: "#E89A4B", swatch: "#FFE7C8" },
  "Salmon":      { cat: "Protein", color: "#E94F37", swatch: "#FBE1DA" },

  // Grains
  "Rice":        { cat: "Grains", color: "#F5EAD0", swatch: "#FFFBF1" },
  "Pasta":       { cat: "Grains", color: "#FFD166", swatch: "#FFF1CC" },
  "Bread":       { cat: "Grains", color: "#E89A4B", swatch: "#F5E4CC" },
  "Tortillas":   { cat: "Grains", color: "#F5EAD0", swatch: "#FFF1CC" },
  "Quinoa":      { cat: "Grains", color: "#E6B43A", swatch: "#FFF1CC" },
  "Oats":        { cat: "Grains", color: "#F5EAD0", swatch: "#FFF1CC" },

  // Dairy
  "Cheese":      { cat: "Dairy", color: "#FFD166", swatch: "#FFF1CC" },
  "Butter":      { cat: "Dairy", color: "#FFD166", swatch: "#FFF1CC" },
  "Milk":        { cat: "Dairy", color: "#FFFBF1", swatch: "#FFFBF1" },
  "Yogurt":      { cat: "Dairy", color: "#FFFBF1", swatch: "#FFFBF1" },
  "Parmesan":    { cat: "Dairy", color: "#FFD166", swatch: "#FFF1CC" },

  // Pantry
  "Olive Oil":   { cat: "Pantry", color: "#2A9D8F", swatch: "#D4ECE9" },
  "Soy Sauce":   { cat: "Pantry", color: "#5C3A1E", swatch: "#E8C5A0" },
  "Vinegar":     { cat: "Pantry", color: "#F5EAD0", swatch: "#FFFBF1" },
  "Honey":       { cat: "Pantry", color: "#E6B43A", swatch: "#FFF1CC" },
  "Flour":       { cat: "Pantry", color: "#F5EAD0", swatch: "#FFFBF1" },
  "Canned Tomato":{ cat: "Pantry", color: "#E94F37", swatch: "#FBE1DA" },
  "Coconut Milk":{ cat: "Pantry", color: "#FFFBF1", swatch: "#FFFBF1" },

  // Spices
  "Basil":       { cat: "Spices", color: "#2A9D8F", swatch: "#D4ECE9" },
  "Chili Flakes":{ cat: "Spices", color: "#E94F37", swatch: "#FBE1DA" },
  "Cumin":       { cat: "Spices", color: "#8B5A2B", swatch: "#E8C5A0" },
  "Paprika":     { cat: "Spices", color: "#E94F37", swatch: "#FBE1DA" },
  "Black Pepper":{ cat: "Spices", color: "#2D2A26", swatch: "#E7DEC8" },
};

// SVG icon glyphs — small flat silhouettes (cream-on-color).
// Each icon: stroke none, fill="currentColor" so we can recolor easily.
const ICON_SVGS = {
  "Tomato": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5c-.6 0-1 .4-1 1v.3c-1.8.3-3.5 1.2-4.7 2.5C4.7 9.7 4 11.7 4 13.8c0 3.4 3.5 6.2 8 6.2s8-2.8 8-6.2c0-2.1-.7-4.1-2.3-5.5-1.2-1.3-2.9-2.2-4.7-2.5v-.3c0-.6-.4-1-1-1zm-2 .7c.3-.5.8-.8 1.4-.8.6-.6 1.5-1 2.3-1 .3 0 .5.1.7.3-.3.4-.8.6-1.4.7-.6.2-1.2.6-1.6 1-.4-.1-.9-.2-1.4-.2zm-1.5 1.6c.4 0 .8.1 1.1.3-.5.5-.9 1.1-1.2 1.8-.3-.1-.6-.1-.9-.1-.5 0-1 .1-1.4.2.5-1 1.4-1.8 2.4-2.2z"/></svg>',
  "Onion": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-.4 0-.7.3-.8.6L10 6c-2.8.7-5 3.3-5 6.5C5 16.6 8.1 20 12 20s7-3.4 7-7.5c0-3.2-2.2-5.8-5-6.5l-1.2-2.4c-.1-.3-.4-.6-.8-.6zm-2 4c.6 1.1 1.2 2.3 1.4 3.5h-1c-.4-1.2-1-2.4-1.7-3.5h1.3zm3 0h1.3c-.7 1.1-1.3 2.3-1.7 3.5h-1c.2-1.2.8-2.4 1.4-3.5z"/></svg>',
  "Garlic": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-.5 0-.9.4-1 .9-.7.6-1.5 1.6-2.3 2.8C7.6 8 7 9.6 7 11c0 4 2.2 8 5 8s5-4 5-8c0-1.4-.6-3-1.7-4.3-.8-1.2-1.6-2.2-2.3-2.8-.1-.5-.5-.9-1-.9zm-2 5c-.5 1-1 2.2-1 3 0 1.5.5 3 1.2 4-.7-1.5-1.2-3.2-1.2-4.5 0-.9.4-1.8 1-2.5zm4 0c.6.7 1 1.6 1 2.5 0 1.3-.5 3-1.2 4.5.7-1 1.2-2.5 1.2-4 0-.8-.5-2-1-3z"/></svg>',
  "Pasta": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 14c0-.6.4-1 1-1h14c.6 0 1 .4 1 1v2c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4v-2zm2 1v1c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-1H6zm.5-3c-.3 0-.5-.2-.5-.5C6 8.5 8.5 6 11.5 6h1C15.5 6 18 8.5 18 11.5c0 .3-.2.5-.5.5h-11zm1 0c.3 0 .5-.2.5-.5C8 9.5 9.5 8 11.5 8s3.5 1.5 3.5 3.5c0 .3.2.5.5.5h-9z"/></svg>',
  "Rice": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 12c0-3.3 3.6-6 8-6s8 2.7 8 6v3c0 .6-.4 1-1 1H5c-.6 0-1-.4-1-1v-3zm3 0c.6 0 1-.4 1-1 0-.6-.4-1-1-1s-1 .4-1 1c0 .6.4 1 1 1zm5-2c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm4 2c.6 0 1-.4 1-1 0-.6-.4-1-1-1s-1 .4-1 1c0 .6.4 1 1 1zm-7 4c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2H9z"/></svg>',
  "Cheese": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 10c0-.4.2-.7.5-.9l8-4c.3-.1.6-.1.9 0l5 2c.4.2.6.5.6.9v6c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-4zm3 1c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm6 0c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm-3 2c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z"/></svg>',
  "Spinach": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-2 0-4 1-5.5 2.5C5 7 4 9 4 11c0 4 2.5 6.5 6 8 .3.1.6.1.9 0C14.5 17.5 17 15 17 11c0-2-1-4-2.5-5.5C13 4 11 3 9 3h3zm-4 5c.3-.3.6-.5 1-.6-.2.6-.3 1.2-.3 1.8 0 1 .3 1.9.8 2.7-.6-.3-1.1-.9-1.4-1.6-.4-.7-.4-1.5-.1-2.3zm5 6c.6-.8.9-1.7.9-2.7 0-.6-.1-1.2-.3-1.8.4.1.7.3 1 .6.3.8.2 1.6-.1 2.3-.3.7-.9 1.3-1.5 1.6z"/></svg>',
  "Beans": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7c-1.7 0-3 1.3-3 3v4c0 1.7 1.3 3 3 3 1.2 0 2.2-.7 2.7-1.7.6.4 1.4.7 2.3.7.8 0 1.6-.3 2.3-.7.5 1 1.5 1.7 2.7 1.7 1.7 0 3-1.3 3-3v-4c0-1.7-1.3-3-3-3-1.2 0-2.2.7-2.7 1.7-.7-.4-1.5-.7-2.3-.7-.9 0-1.7.3-2.3.7C9.2 7.7 8.2 7 7 7zm0 2c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm10 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"/></svg>',
  "Eggs": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-3.3 0-6 4-6 9 0 4.4 2.7 8 6 8s6-3.6 6-8c0-5-2.7-9-6-9zm-1.5 4c1.4-1.3 2.6-1 3 .5.3 1.5-.6 2.5-2 2.5s-2.4-1.5-1-3z"/></svg>',
  "Bell Pepper": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5c-.6 0-1-.4-1-1 0-.6.4-1 1-1s1 .4 1 1c0 .6-.4 1-1 1zm-1 0v2c-3 0-5 1.5-5 5v3c0 2.8 2.2 5 5 5h2c2.8 0 5-2.2 5-5v-3c0-3.5-2-5-5-5V5h-2zm0 4c-1.5.5-2.5 1.5-3 3 0-1.7 1.3-3 3-3z"/></svg>',
  "Chicken": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 8c0-1.7 1.3-3 3-3h4c1.7 0 3 1.3 3 3v3c0 2.8-2.2 5-5 5s-5-2.2-5-5V8zm3 5c0 1.1.9 2 2 2s2-.9 2-2H10zm-2 4l-2 4h2l2-4H8zm8 0l2 4h-2l-2-4h2z"/></svg>',
  "Olive Oil": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 3h2v3l1 1v3c1.1 0 2 .9 2 2v8c0 .6-.4 1-1 1H9c-.6 0-1-.4-1-1v-8c0-1.1.9-2 2-2V7l1-1V3zm-1 11h4v5h-4v-5z"/></svg>',
  "Lemon": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 12c0-3.9 3.1-7 7-7s7 3.1 7 7-3.1 7-7 7-7-3.1-7-7zm3 0c0 2.2 1.8 4 4 4s4-1.8 4-4-1.8-4-4-4-4 1.8-4 4zm9-5l2-2-1-1-2 2 1 1z"/></svg>',
  "Mushroom": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 11c0-3.9 3.1-7 7-7s7 3.1 7 7c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1zm5 3h4v4c0 1.1-.9 2-2 2s-2-.9-2-2v-4z"/></svg>',
  "Carrot": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 4l1-1 1 1-1 1 1 1-2 1-1-2 1-1zM6 19l8-8 3 3-8 8c-.4.4-1 .4-1.4 0L6 20.4c-.4-.4-.4-1 0-1.4zm6-7l-2 4 2-2 2 2-4-4z"/></svg>',
  "Broccoli": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4c-1.5 0-3 1-3.5 2.5C7 7 6 8.5 6 10c0 1 .5 2 1.5 2.5L8 19c0 .6.4 1 1 1h6c.6 0 1-.4 1-1l.5-6.5c1-.5 1.5-1.5 1.5-2.5 0-1.5-1-3-2.5-3.5C15 5 13.5 4 12 4z"/></svg>',
  "Beef": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 9c0-1.7 1.3-3 3-3h6c1.7 0 3 1.3 3 3v6c0 1.7-1.3 3-3 3H9c-1.7 0-3-1.3-3-3V9zm3 2c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm6 4c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"/></svg>',
  "Tofu": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 8c0-.6.4-1 1-1h12c.6 0 1 .4 1 1v8c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1V8zm2 1v6h10V9H7zm2 1h2v2H9v-2zm4 0h2v2h-2v-2zm-4 3h2v2H9v-2zm4 0h2v2h-2v-2z"/></svg>',
  "Chickpeas": '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="10" r="2.5"/><circle cx="14" cy="9" r="2"/><circle cx="11" cy="14" r="2.5"/><circle cx="16" cy="14" r="2"/><circle cx="7" cy="15" r="1.7"/></svg>',
  "Shrimp": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 14c-.5-2 .5-5 4-6 3-1 5 1 6 3 1 2 2 5-1 7-3 1-7 0-9-2-.5-.5-.4-1.5 0-2zm9-3c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm-9 3l-2 2 1 1 2-2-1-1zm12 0l1 3-2-1-1-2 2 0z"/></svg>',
  "Salmon": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 12c0-1 .5-2 2-2h11l3-2v8l-3-2H6c-1.5 0-2-1-2-2zm12-1c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"/></svg>',
  "Bread": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 10c0-2.2 1.8-4 4-4h6c2.2 0 4 1.8 4 4v6c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-6zm3 2v3h2v-3H8zm4 0v3h2v-3h-2z"/></svg>',
  "Tortillas": '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="5" fill="rgba(0,0,0,0.15)"/><circle cx="9" cy="9" r="1"/><circle cx="14" cy="11" r="1.2"/><circle cx="11" cy="14" r="1"/></svg>',
  "Quinoa": '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="9" r="1.4"/><circle cx="12" cy="8" r="1.2"/><circle cx="16" cy="10" r="1.4"/><circle cx="10" cy="12" r="1.3"/><circle cx="14" cy="13" r="1.3"/><circle cx="9" cy="15" r="1.2"/><circle cx="13" cy="16" r="1.4"/></svg>',
  "Oats": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5l1 4-1-1-1 1 1-4zm-5 4l3 2-2 0v1l-1-3zm10 0l-1 3v-1l-2 0 3-2zm-5 4l1 4-1-1-1 1 1-4z"/></svg>',
  "Butter": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 11c0-.6.4-1 1-1h12c.6 0 1 .4 1 1v6c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-6zm2-2l3-4h4l3 4H7z"/></svg>',
  "Milk": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3h6v3l2 2v11c0 .6-.4 1-1 1H8c-.6 0-1-.4-1-1V8l2-2V3zm0 7v8h6v-8H9z"/></svg>',
  "Yogurt": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 8h10l-1 11c0 .6-.4 1-1 1H9c-.6 0-1-.4-1-1L7 8zm0-1c0-.6.4-1 1-1h8c.6 0 1 .4 1 1H7zm3 4v6h4v-6h-4z"/></svg>',
  "Parmesan": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 17l8-12 8 12-8 1-8-1zm8-7c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm-3 4c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm6 0c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z"/></svg>',
  "Soy Sauce": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 3h4v4l3 1v11c0 .6-.4 1-1 1H8c-.6 0-1-.4-1-1V8l3-1V3zm0 8v6h4v-6h-4z"/></svg>',
  "Vinegar": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 3h2v3l2 3v9c0 .6-.4 1-1 1h-4c-.6 0-1-.4-1-1V9l2-3V3zm-1 9v5h4v-5h-4z"/></svg>',
  "Honey": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l5 3v6l-5 3-5-3V7l5-3zm0 2.3L9 8v4l3 1.7L15 12V8l-3-1.7z"/></svg>',
  "Flour": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v3H6V6zm0 4h12v9c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1v-9zm3 2v4h2v-4H9zm4 0v4h2v-4h-2z"/></svg>',
  "Canned Tomato": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 6h10v2H7V6zm0 3h10v10c0 .6-.4 1-1 1H8c-.6 0-1-.4-1-1V9zm2 2v6h2v-6H9zm4 0v6h2v-6h-2z"/></svg>',
  "Coconut Milk": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3h6v3l2 2v11c0 .6-.4 1-1 1H8c-.6 0-1-.4-1-1V8l2-2V3zm0 8h6v3H9v-3z"/></svg>',
  "Basil": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 4c-2 0-4 1-5 3-1.5 3 0 7 3 8 .3 0 .5 0 .8-.3C15 12 16 9 15 6c-.3-1-1-2-1-2zm-4 5c-2 1-3 4-1 6-2-3 0-5 1-6z"/></svg>',
  "Chili Flakes": '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="7" cy="8" r="1.5"/><circle cx="12" cy="7" r="1.2"/><circle cx="17" cy="9" r="1.3"/><circle cx="9" cy="12" r="1.3"/><circle cx="15" cy="13" r="1.5"/><circle cx="8" cy="16" r="1.2"/><circle cx="13" cy="16" r="1.4"/><circle cx="17" cy="15" r="1.2"/></svg>',
  "Cumin": '<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="8" cy="8" rx="1.2" ry="2.4" transform="rotate(20 8 8)"/><ellipse cx="14" cy="9" rx="1.2" ry="2.4" transform="rotate(-15 14 9)"/><ellipse cx="10" cy="13" rx="1.2" ry="2.4" transform="rotate(30 10 13)"/><ellipse cx="16" cy="14" rx="1.2" ry="2.4" transform="rotate(-20 16 14)"/><ellipse cx="9" cy="17" rx="1.2" ry="2.4"/></svg>',
  "Paprika": '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="9" r="1.2"/><circle cx="12" cy="8" r="1"/><circle cx="16" cy="9" r="1.1"/><circle cx="10" cy="12" r="1.1"/><circle cx="14" cy="12" r="1.2"/><circle cx="8" cy="15" r="1"/><circle cx="12" cy="15" r="1.2"/><circle cx="16" cy="15" r="1"/></svg>',
  "Black Pepper": '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="9" r="1.6"/><circle cx="14" cy="10" r="1.4"/><circle cx="11" cy="13" r="1.5"/><circle cx="15" cy="15" r="1.3"/><circle cx="9" cy="16" r="1.4"/></svg>',
  "Avocado": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4c-3 0-5 2-5 7 0 4 2 8 5 8s5-4 5-8c0-5-2-7-5-7zm0 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/></svg>',
  "Lime": '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="4" fill="rgba(0,0,0,0.15)"/><path d="M12 8v8M8 12h8" stroke="rgba(0,0,0,0.2)" stroke-width="1" fill="none"/></svg>',
  "Cilantro": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4v4c-2 0-3 1-3 3 0 1 .5 2 1.5 2.5L9 19h6l-1.5-5.5C14.5 13 15 12 15 11c0-2-1-3-3-3V4h0z"/></svg>',
  "Kale": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4c-2 0-4 2-4 5 0 1-1 2-2 3-1 1-1 3 0 4 2 1 5 1 6-2 1 3 4 3 6 2 1-1 1-3 0-4-1-1-2-2-2-3 0-3-2-5-4-5z"/></svg>',
  "Potato": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 11c0-3 2-6 5-6s5 3 5 6c0 4-2 8-5 8s-5-4-5-8zm3 0c0 .6.4 1 1 1s1-.4 1-1-.4-1-1-1-1 .4-1 1zm3 3c0 .6.4 1 1 1s1-.4 1-1-.4-1-1-1-1 .4-1 1z"/></svg>',
  "Sweet Potato": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 12c0-3 2-7 6-7s6 4 6 7-2 7-6 7-6-4-6-7zm3 0c0 .6.4 1 1 1s1-.4 1-1-.4-1-1-1-1 .4-1 1zm4 3c0 .6.4 1 1 1s1-.4 1-1-.4-1-1-1-1 .4-1 1z"/></svg>',
  "Ginger": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 13c1-2 3-3 5-2 1 0 2-1 3-2 2-1 4 0 5 2 1 2 0 4-2 5-1 0-2 1-3 2-2 1-4 1-6-1-2-1-2-3-2-4z"/></svg>',
};

function ingredientIcon(name) {
  if (ICON_SVGS[name]) return ICON_SVGS[name];
  // Fallback for custom ingredients: a single bold initial letter glyph
  const letter = (name || "?").trim().charAt(0).toUpperCase();
  return `<svg viewBox="0 0 24 24" fill="currentColor"><text x="12" y="17" text-anchor="middle" font-size="13" font-weight="800" font-family="Fraunces, serif" letter-spacing="-0.02em">${letter}</text></svg>`;
}

// Default color/swatch per category — used for newly created custom ingredients.
const CATEGORY_DEFAULTS = {
  "Vegetables": { color: "#2A9D8F", swatch: "#D4ECE9" },
  "Protein":    { color: "#E89A4B", swatch: "#FFE7C8" },
  "Grains":     { color: "#E6B43A", swatch: "#FFF1CC" },
  "Dairy":      { color: "#FFD166", swatch: "#FFF1CC" },
  "Pantry":     { color: "#8B5A2B", swatch: "#E8C5A0" },
  "Spices":     { color: "#E94F37", swatch: "#FBE1DA" },
  "Fruits":     { color: "#E94F37", swatch: "#FBE1DA" },
  "Other":      { color: "#8A857D", swatch: "#E7DEC8" },
};
const ING_CATEGORIES_LIST = ["Vegetables", "Protein", "Grains", "Dairy", "Pantry", "Spices", "Fruits", "Other"];

// Resolve ingredient data by name, checking custom + overrides + built-in.
// Override layer (window.__ingOverrides) wins over everything so users can
// re-classify built-in ingredients without mutating the base library.
function ingData(name) {
  const base = INGREDIENT_DATA[name]
    || (window.__customIngs && window.__customIngs[name])
    || null;
  const override = window.__ingOverrides && window.__ingOverrides[name];
  if (!base && !override) return null;
  return { ...(base || {}), ...(override || {}) };
}

// Returns array of all known ingredient names (built-in + custom)
function allIngredientNames() {
  const builtIn = Object.keys(INGREDIENT_DATA);
  const custom = window.__customIngs ? Object.keys(window.__customIngs) : [];
  return [...builtIn, ...custom];
}

// Recipe roulette wheel wedges. 8 categories that determine wheel landing.
const WHEEL_CATEGORIES = [
  { key: "pasta",     label: "Pasta",     color: "#E94F37", iconName: "Pasta" },
  { key: "rice",      label: "Rice bowl", color: "#FFD166", iconName: "Rice" },
  { key: "soup",      label: "Soup",      color: "#2A9D8F", iconName: "Tomato" },
  { key: "skillet",   label: "Skillet",   color: "#C8371F", iconName: "Chicken" },
  { key: "wrap",      label: "Wrap",      color: "#FFD166", iconName: "Tortillas" },
  { key: "salad",     label: "Salad",     color: "#2A9D8F", iconName: "Spinach" },
  { key: "breakfast", label: "Breakfast", color: "#FFD166", iconName: "Eggs" },
  { key: "surprise",  label: "Surprise",  color: "#E94F37", iconName: "Cheese" },
];

// Recipes
const RECIPES = [
  {
    id: "tomato-garlic-pasta",
    name: "Tomato Garlic Pasta",
    category: "pasta",
    time: 20,
    difficulty: "Easy",
    servings: 2,
    tags: ["Vegetarian", "One pan", "Comfort"],
    needs: ["Pasta", "Tomato", "Garlic", "Olive Oil", "Cheese"],
    optional: ["Basil", "Chili Flakes"],
    diet: ["vegetarian"],
    blurb: "Sweet jammy tomatoes melt with garlic into a glossy sauce. The whole thing comes together in the time it takes pasta to cook.",
    illusKey: "pasta-tomato",
    steps: [
      "Bring a pot of well-salted water to a boil. Add **pasta** and cook to package directions, about 9 minutes.",
      "While pasta cooks, warm a glug of **olive oil** in a wide pan over medium heat. Add sliced **garlic** and sizzle 30 seconds until fragrant — don't let it brown.",
      "Add halved **tomatoes** and a pinch of salt. Cook 5–6 minutes, smashing gently with a spoon, until they slump into a sauce.",
      "Reserve ½ cup pasta water, then drain. Toss pasta into the pan with a splash of pasta water. Finish with grated **cheese** and a crack of pepper.",
      "Plate, taste, adjust salt. Eat immediately.",
    ],
  },
  {
    id: "chicken-rice-skillet",
    name: "Chicken & Rice Skillet",
    category: "skillet",
    time: 30,
    difficulty: "Easy",
    servings: 3,
    tags: ["High protein", "One pan"],
    needs: ["Chicken", "Rice", "Onion", "Bell Pepper", "Garlic"],
    optional: ["Paprika", "Cumin"],
    diet: [],
    blurb: "Everything cooks in one skillet — juicy seared chicken, then rice that soaks up all the pan flavor.",
    illusKey: "skillet",
    steps: [
      "Pat **chicken** dry and season generously with salt and pepper. Sear in a hot skillet 4 minutes per side until deeply golden. Set aside.",
      "In the same pan, sauté diced **onion** and **bell pepper** for 4 minutes. Add minced **garlic** and cook 30 seconds more.",
      "Stir in **rice**, toast for a minute, then add 1½ cups water and a pinch of salt. Nestle chicken back in.",
      "Cover and simmer on low for 18 minutes, until rice is tender. Rest off heat 5 minutes before serving.",
    ],
  },
  {
    id: "white-bean-spinach-soup",
    name: "White Bean & Spinach Soup",
    category: "soup",
    time: 25,
    difficulty: "Easy",
    servings: 4,
    tags: ["Vegetarian", "High protein", "Cozy"],
    needs: ["Beans", "Spinach", "Garlic", "Onion", "Olive Oil"],
    optional: ["Parmesan", "Lemon"],
    diet: ["vegetarian"],
    blurb: "A 25-minute pantry soup with broth so good you'll want to drink it from a mug.",
    illusKey: "soup",
    steps: [
      "Warm **olive oil** in a pot. Add diced **onion** with a pinch of salt and cook 5 minutes until soft.",
      "Add minced **garlic** and cook 30 seconds.",
      "Pour in 4 cups of water or broth and rinsed **beans**. Simmer 10 minutes.",
      "Stir in **spinach** by the handful until wilted. Finish with a squeeze of **lemon** and grated **parmesan** if you have it.",
    ],
  },
  {
    id: "lemon-spinach-pasta",
    name: "Lemon Spinach Pasta",
    category: "pasta",
    time: 20,
    difficulty: "Easy",
    servings: 2,
    tags: ["Vegetarian", "Quick", "Bright"],
    needs: ["Pasta", "Spinach", "Lemon", "Garlic", "Olive Oil"],
    optional: ["Parmesan", "Black Pepper"],
    diet: ["vegetarian"],
    blurb: "Bright, herby, and ready in 20 minutes. A perfect Tuesday-night pasta.",
    illusKey: "lemon-pasta",
    steps: [
      "Boil **pasta** in salty water to package directions.",
      "Meanwhile, warm **olive oil** in a wide pan. Sizzle sliced **garlic** until just golden.",
      "Add **spinach** in batches and wilt. Off heat, add the zest and juice of one **lemon**.",
      "Toss drained pasta in the pan with a splash of pasta water. Finish with **parmesan** and lots of black pepper.",
    ],
  },
  {
    id: "cheesy-rice-beans",
    name: "Cheesy Rice & Beans",
    category: "rice",
    time: 25,
    difficulty: "Easy",
    servings: 3,
    tags: ["Vegetarian", "Budget", "Comfort"],
    needs: ["Rice", "Beans", "Cheese", "Onion", "Garlic"],
    optional: ["Cumin", "Cilantro", "Lime"],
    diet: ["vegetarian"],
    blurb: "A burrito-bowl-style one-pot dinner. Cheap, fast, deeply satisfying.",
    illusKey: "rice-beans",
    steps: [
      "Sauté diced **onion** in oil. Add **garlic** and a pinch of **cumin**.",
      "Stir in **rice** and 2 cups water. Cover and simmer 15 min.",
      "Add rinsed **beans** and warm through. Stir in **cheese** off heat.",
      "Top with **cilantro** and a squeeze of **lime**.",
    ],
  },
  {
    id: "garlic-egg-fried-rice",
    name: "Garlic Egg Fried Rice",
    category: "rice",
    time: 15,
    difficulty: "Easy",
    servings: 2,
    tags: ["Quick", "High protein", "Uses leftovers"],
    needs: ["Rice", "Eggs", "Garlic", "Soy Sauce", "Olive Oil"],
    optional: ["Onion", "Bell Pepper"],
    diet: ["vegetarian"],
    blurb: "Cold leftover rice is the secret to perfect fried rice. Fifteen minutes start to finish.",
    illusKey: "fried-rice",
    steps: [
      "Heat **olive oil** in a wok or wide pan over high heat. Add minced **garlic** and sizzle 15 seconds.",
      "Push aside; crack in **eggs** and scramble until just set.",
      "Add cold **rice**, breaking up clumps. Toss for 2–3 minutes until heated and a little crispy.",
      "Splash with **soy sauce**, toss, and serve hot.",
    ],
  },
  {
    id: "veggie-wrap",
    name: "Loaded Veggie Wrap",
    category: "wrap",
    time: 10,
    difficulty: "Easy",
    servings: 1,
    tags: ["Vegetarian", "Quick", "No cook"],
    needs: ["Tortillas", "Cheese", "Spinach", "Tomato", "Avocado"],
    optional: ["Hummus", "Bell Pepper"],
    diet: ["vegetarian"],
    blurb: "Ten minutes from fridge to lunch. Everything you have, all wrapped up.",
    illusKey: "wrap",
    steps: [
      "Warm a **tortilla** in a dry pan for 30 seconds per side.",
      "Layer with **spinach**, sliced **tomato**, smashed **avocado**, and grated **cheese**.",
      "Roll tight, cut on the diagonal.",
    ],
  },
  {
    id: "tomato-spinach-salad",
    name: "Tomato Spinach Salad",
    category: "salad",
    time: 10,
    difficulty: "Easy",
    servings: 2,
    tags: ["Vegetarian", "No cook", "Quick"],
    needs: ["Spinach", "Tomato", "Olive Oil", "Lemon", "Cheese"],
    optional: ["Basil", "Black Pepper"],
    diet: ["vegetarian"],
    blurb: "The platonic ideal of a side salad: ripe tomato, peppery greens, a slick of good oil.",
    illusKey: "salad",
    steps: [
      "Toss **spinach** and chopped **tomato** in a wide bowl.",
      "Whisk **olive oil** with **lemon** juice, salt, and pepper. Pour over.",
      "Crumble **cheese** on top. Eat before it wilts.",
    ],
  },
  {
    id: "spinach-eggs",
    name: "Spinach & Eggs on Toast",
    category: "breakfast",
    time: 15,
    difficulty: "Easy",
    servings: 1,
    tags: ["Vegetarian", "Quick", "High protein"],
    needs: ["Eggs", "Spinach", "Bread", "Butter", "Garlic"],
    optional: ["Chili Flakes", "Lemon"],
    diet: ["vegetarian"],
    blurb: "Breakfast-for-dinner that uses up that last handful of spinach.",
    illusKey: "eggs-toast",
    steps: [
      "Toast **bread** until golden. Rub with a halved garlic clove. Spread with **butter**.",
      "Wilt **spinach** in a pan with a knob of butter and a pinch of salt.",
      "In the same pan, fry **eggs** to your liking.",
      "Pile spinach on toast, top with eggs and a pinch of **chili flakes**.",
    ],
  },
  {
    id: "pepper-skillet",
    name: "Sausage-less Pepper Skillet",
    category: "skillet",
    time: 25,
    difficulty: "Easy",
    servings: 3,
    tags: ["Vegetarian", "One pan", "Mediterranean"],
    needs: ["Bell Pepper", "Onion", "Tomato", "Beans", "Olive Oil"],
    optional: ["Paprika", "Basil"],
    diet: ["vegetarian"],
    blurb: "Sweet peppers and onions stewed soft with tomatoes — a Spanish-style one-pan.",
    illusKey: "pepper-skillet",
    steps: [
      "Slice **bell pepper** and **onion** into thick strips. Sauté in **olive oil** 10 minutes.",
      "Add chopped **tomato** and **beans**. Season with paprika, salt, pepper.",
      "Simmer 10 minutes until thick. Finish with **basil**.",
    ],
  },
  {
    id: "garlic-broccoli-pasta",
    name: "Garlic Broccoli Pasta",
    category: "pasta",
    time: 20,
    difficulty: "Easy",
    servings: 2,
    tags: ["Vegetarian", "Healthy"],
    needs: ["Pasta", "Broccoli", "Garlic", "Olive Oil", "Cheese"],
    optional: ["Chili Flakes", "Lemon"],
    diet: ["vegetarian"],
    blurb: "Tender-crisp broccoli, golden garlic, plenty of black pepper. Don't underestimate the simple plate.",
    illusKey: "pasta-broccoli",
    steps: [
      "Boil **pasta**. Three minutes before it's done, drop **broccoli** florets into the same water.",
      "Meanwhile, sizzle sliced **garlic** in plenty of **olive oil**.",
      "Drain pasta + broccoli (save a cup of water). Toss in the garlic oil with **cheese**. Add splashes of pasta water until silky.",
    ],
  },
  {
    id: "veggie-soup",
    name: "Anything-in-the-Fridge Soup",
    category: "soup",
    time: 30,
    difficulty: "Easy",
    servings: 4,
    tags: ["Vegetarian", "Uses leftovers", "Cozy"],
    needs: ["Onion", "Garlic", "Tomato", "Beans", "Spinach"],
    optional: ["Pasta", "Olive Oil", "Parmesan"],
    diet: ["vegetarian"],
    blurb: "The recipe for when you have a lot of half-vegetables. Forgiving in every way.",
    illusKey: "veggie-soup",
    steps: [
      "Sauté **onion** in olive oil. Add **garlic**.",
      "Add chopped **tomato**, **beans**, and 4 cups water. Simmer 15 minutes.",
      "Stir in **spinach** to wilt. Eat hot with bread.",
    ],
  },
];

// Quick-add staples shown in the add modal
const QUICK_ADD = [
  "Rice", "Pasta", "Eggs", "Cheese", "Beans", "Tortillas",
  "Canned Tomato", "Garlic", "Onion", "Olive Oil", "Butter", "Flour",
  "Milk", "Tomato", "Spinach", "Chicken", "Bell Pepper", "Lemon",
];

// Initial pantry — 8 realistic ingredients
const INITIAL_PANTRY = [
  { name: "Tomato",    expiresInDays: 3, location: "Fridge" },
  { name: "Pasta",     expiresInDays: 999, location: "Pantry" },
  { name: "Garlic",    expiresInDays: 30, location: "Pantry" },
  { name: "Olive Oil", expiresInDays: 999, location: "Pantry" },
  { name: "Spinach",   expiresInDays: 2, location: "Fridge" },
  { name: "Cheese",    expiresInDays: 12, location: "Fridge" },
  { name: "Eggs",      expiresInDays: 14, location: "Fridge" },
  { name: "Onion",     expiresInDays: 21, location: "Pantry" },
];

// Initial saved recipes
const INITIAL_SAVED = ["tomato-garlic-pasta", "white-bean-spinach-soup", "garlic-egg-fried-rice"];

// Initial grocery list
const INITIAL_GROCERY = [
  { name: "Basil",     qty: "1 bunch",  cat: "Produce", checked: false, src: "Tomato Garlic Pasta" },
  { name: "Parmesan",  qty: "1 wedge",  cat: "Dairy",   checked: false, src: "Lemon Spinach Pasta" },
  { name: "Chickpeas", qty: "2 cans",   cat: "Pantry",  checked: true,  src: "manual" },
  { name: "Lime",      qty: "3",        cat: "Produce", checked: false, src: "Cheesy Rice & Beans" },
  { name: "Tortillas", qty: "1 pack",   cat: "Pantry",  checked: false, src: "Loaded Veggie Wrap" },
];

// Smart substitutions
const SUBSTITUTIONS = {
  "Basil":     "Use spinach or parsley — or skip it entirely.",
  "Parmesan":  "Any hard cheese works: pecorino, aged cheddar, or nutritional yeast.",
  "Chicken":   "Swap in beans, tofu, or chickpeas for a vegetarian version.",
  "Pasta":     "Any noodle shape works — penne, fusilli, rice noodles, even rice itself.",
  "Tomato":    "Canned tomatoes are a great stand-in. Use 1 cup canned per fresh tomato.",
  "Lemon":     "Lime works, or a splash of vinegar.",
  "Olive Oil": "Any neutral cooking oil — avocado, vegetable, or even butter.",
  "Cheese":    "Skip it, or top with a drizzle of olive oil for richness.",
  "Onion":     "Shallots, leeks, or even a pinch of onion powder.",
  "Garlic":    "Garlic powder — ¼ tsp per clove.",
};

// Recipe illustrations as inline SVG. Each is a flat editorial dish illustration.
function recipeIllustration(key, opts) {
  opts = opts || {};
  const size = opts.size || 200;
  const ILLUS = {
    "pasta-tomato": `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#FFE7B0"/>
        <ellipse cx="100" cy="105" rx="78" ry="20" fill="#F5EAD0"/>
        <ellipse cx="100" cy="100" rx="78" ry="40" fill="#FFFBF1"/>
        <ellipse cx="100" cy="100" rx="68" ry="32" fill="#FFE7B0"/>
        <!-- pasta nest -->
        <g stroke="#E6B43A" stroke-width="2.5" fill="none" stroke-linecap="round">
          <path d="M45,95 Q70,80 100,90 T155,95"/>
          <path d="M50,105 Q80,90 110,100 T150,108"/>
          <path d="M55,115 Q85,98 115,108 T160,118"/>
          <path d="M50,90 Q80,75 100,85 T155,85"/>
        </g>
        <!-- tomato sauce -->
        <ellipse cx="100" cy="100" rx="40" ry="18" fill="#E94F37" opacity="0.85"/>
        <ellipse cx="105" cy="98" rx="38" ry="16" fill="#C8371F" opacity="0.6"/>
        <!-- tomato halves -->
        <circle cx="80" cy="95" r="7" fill="#E94F37" stroke="#C8371F" stroke-width="1.5"/>
        <circle cx="115" cy="100" rx="6" r="6" fill="#E94F37" stroke="#C8371F" stroke-width="1.5"/>
        <!-- basil -->
        <ellipse cx="92" cy="92" rx="4" ry="6" fill="#2A9D8F" transform="rotate(-25 92 92)"/>
        <ellipse cx="118" cy="93" rx="3" ry="5" fill="#2A9D8F" transform="rotate(30 118 93)"/>
        <!-- cheese shavings -->
        <rect x="95" y="86" width="4" height="2" fill="#FFFBF1"/>
        <rect x="108" y="90" width="5" height="2" fill="#FFFBF1"/>
        <rect x="86" y="106" width="4" height="2" fill="#FFFBF1"/>
      </svg>
    `,
    "skillet": `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#FBE1DA"/>
        <!-- pan -->
        <ellipse cx="100" cy="110" rx="72" ry="16" fill="#1F1B16"/>
        <ellipse cx="100" cy="105" rx="72" ry="50" fill="#2D2A26"/>
        <ellipse cx="100" cy="100" rx="68" ry="46" fill="#3A332C"/>
        <!-- rice -->
        <ellipse cx="100" cy="100" rx="60" ry="38" fill="#F5EAD0"/>
        <ellipse cx="100" cy="98" rx="58" ry="34" fill="#FFFBF1"/>
        <!-- chicken pieces -->
        <ellipse cx="80" cy="92" rx="14" ry="9" fill="#C8924F"/>
        <ellipse cx="80" cy="90" rx="13" ry="8" fill="#E89A4B"/>
        <ellipse cx="118" cy="98" rx="14" ry="9" fill="#C8924F"/>
        <ellipse cx="118" cy="96" rx="13" ry="8" fill="#E89A4B"/>
        <ellipse cx="100" cy="108" rx="12" ry="8" fill="#C8924F"/>
        <ellipse cx="100" cy="106" rx="11" ry="7" fill="#E89A4B"/>
        <!-- peppers -->
        <path d="M70,100 Q66,95 70,90 Q74,92 73,98 Z" fill="#E94F37"/>
        <path d="M130,90 Q133,86 137,90 Q135,95 130,93 Z" fill="#E94F37"/>
        <path d="M95,85 Q92,80 97,78 Q100,82 98,86 Z" fill="#2A9D8F"/>
        <!-- handle -->
        <rect x="168" y="98" width="22" height="6" fill="#2D2A26" rx="2"/>
        <!-- steam -->
        <path d="M70,55 Q75,45 70,38 Q65,30 70,22" stroke="#D6C9A8" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
        <path d="M100,50 Q105,40 100,33 Q95,25 100,18" stroke="#D6C9A8" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
        <path d="M130,55 Q135,45 130,38 Q125,30 130,22" stroke="#D6C9A8" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
      </svg>
    `,
    "soup": `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#D4ECE9"/>
        <!-- bowl -->
        <ellipse cx="100" cy="120" rx="78" ry="18" fill="#1F7A6F"/>
        <path d="M22,120 Q22,170 100,175 Q178,170 178,120 Z" fill="#FFFBF1"/>
        <ellipse cx="100" cy="120" rx="72" ry="14" fill="#F5EAD0"/>
        <!-- broth -->
        <ellipse cx="100" cy="118" rx="68" ry="12" fill="#FFF1CC"/>
        <ellipse cx="100" cy="118" rx="64" ry="10" fill="#FFE7B0"/>
        <!-- beans -->
        <ellipse cx="78" cy="115" rx="5" ry="4" fill="#FFFBF1" stroke="#E6B43A" stroke-width="1"/>
        <ellipse cx="92" cy="118" rx="5" ry="4" fill="#FFFBF1" stroke="#E6B43A" stroke-width="1"/>
        <ellipse cx="110" cy="113" rx="5" ry="4" fill="#FFFBF1" stroke="#E6B43A" stroke-width="1"/>
        <ellipse cx="125" cy="118" rx="5" ry="4" fill="#FFFBF1" stroke="#E6B43A" stroke-width="1"/>
        <ellipse cx="85" cy="122" rx="5" ry="4" fill="#FFFBF1" stroke="#E6B43A" stroke-width="1"/>
        <ellipse cx="118" cy="123" rx="5" ry="4" fill="#FFFBF1" stroke="#E6B43A" stroke-width="1"/>
        <!-- spinach leaves -->
        <ellipse cx="72" cy="111" rx="6" ry="3" fill="#2A9D8F" transform="rotate(-20 72 111)"/>
        <ellipse cx="100" cy="108" rx="7" ry="3.5" fill="#2A9D8F"/>
        <ellipse cx="130" cy="111" rx="6" ry="3" fill="#2A9D8F" transform="rotate(20 130 111)"/>
        <!-- steam -->
        <path d="M85,90 Q90,80 85,70" stroke="#1F7A6F" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>
        <path d="M115,90 Q120,80 115,70" stroke="#1F7A6F" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>
      </svg>
    `,
    "lemon-pasta": `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#FFF1CC"/>
        <ellipse cx="100" cy="105" rx="78" ry="20" fill="#F5EAD0"/>
        <ellipse cx="100" cy="100" rx="78" ry="40" fill="#FFFBF1"/>
        <ellipse cx="100" cy="100" rx="68" ry="32" fill="#FFE7B0"/>
        <g stroke="#E6B43A" stroke-width="2.5" fill="none" stroke-linecap="round">
          <path d="M40,95 Q70,80 100,90 T160,95"/>
          <path d="M45,105 Q80,90 110,100 T155,108"/>
          <path d="M50,115 Q85,98 115,108 T160,118"/>
          <path d="M48,90 Q80,75 100,85 T160,85"/>
        </g>
        <!-- spinach -->
        <ellipse cx="80" cy="90" rx="9" ry="4" fill="#2A9D8F" transform="rotate(-20 80 90)"/>
        <ellipse cx="118" cy="95" rx="9" ry="4" fill="#2A9D8F" transform="rotate(15 118 95)"/>
        <ellipse cx="95" cy="105" rx="9" ry="4" fill="#2A9D8F"/>
        <!-- lemon slices -->
        <circle cx="120" cy="85" r="9" fill="#FFD166" stroke="#E6B43A" stroke-width="1.5"/>
        <circle cx="120" cy="85" r="5" fill="#FFFBF1"/>
        <path d="M115,85 L125,85 M120,80 L120,90" stroke="#E6B43A" stroke-width="1"/>
        <circle cx="75" cy="110" r="8" fill="#FFD166" stroke="#E6B43A" stroke-width="1.5"/>
        <circle cx="75" cy="110" r="4" fill="#FFFBF1"/>
      </svg>
    `,
    "rice-beans": `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#FFF1CC"/>
        <ellipse cx="100" cy="115" rx="76" ry="18" fill="#E6B43A"/>
        <path d="M24,115 Q24,165 100,170 Q176,165 176,115 Z" fill="#FFFBF1"/>
        <ellipse cx="100" cy="115" rx="70" ry="14" fill="#F5EAD0"/>
        <!-- rice -->
        <ellipse cx="100" cy="105" rx="65" ry="22" fill="#FFFBF1"/>
        <ellipse cx="100" cy="103" rx="62" ry="20" fill="#F5EAD0"/>
        <!-- rice grains -->
        <g fill="#FFFBF1" stroke="#D6C9A8" stroke-width="0.5">
          <ellipse cx="65" cy="100" rx="2.5" ry="1.2"/>
          <ellipse cx="75" cy="95" rx="2.5" ry="1.2"/>
          <ellipse cx="120" cy="98" rx="2.5" ry="1.2"/>
          <ellipse cx="135" cy="105" rx="2.5" ry="1.2"/>
          <ellipse cx="90" cy="115" rx="2.5" ry="1.2"/>
        </g>
        <!-- beans -->
        <ellipse cx="80" cy="100" rx="6" ry="4" fill="#8B5A2B"/>
        <ellipse cx="105" cy="95" rx="6" ry="4" fill="#8B5A2B"/>
        <ellipse cx="125" cy="105" rx="6" ry="4" fill="#8B5A2B"/>
        <ellipse cx="92" cy="110" rx="6" ry="4" fill="#8B5A2B"/>
        <!-- melty cheese -->
        <path d="M70,90 Q90,85 110,92 Q130,88 140,95 L140,108 Q120,105 100,110 Q80,108 65,103 Z" fill="#FFD166" opacity="0.85"/>
        <!-- cilantro -->
        <ellipse cx="100" cy="92" rx="3" ry="5" fill="#2A9D8F"/>
      </svg>
    `,
    "fried-rice": `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#F5E4CC"/>
        <ellipse cx="100" cy="115" rx="76" ry="18" fill="#2D2A26"/>
        <path d="M24,115 Q24,150 100,158 Q176,150 176,115 Z" fill="#3A332C"/>
        <ellipse cx="100" cy="113" rx="70" ry="14" fill="#5C3A1E"/>
        <ellipse cx="100" cy="100" rx="65" ry="28" fill="#E6B43A"/>
        <ellipse cx="100" cy="98" rx="62" ry="25" fill="#FFD166"/>
        <!-- rice grains -->
        <g fill="#FFFBF1">
          <ellipse cx="68" cy="92" rx="2.5" ry="1.5"/>
          <ellipse cx="82" cy="88" rx="2.5" ry="1.5"/>
          <ellipse cx="95" cy="92" rx="2.5" ry="1.5"/>
          <ellipse cx="110" cy="89" rx="2.5" ry="1.5"/>
          <ellipse cx="125" cy="93" rx="2.5" ry="1.5"/>
          <ellipse cx="75" cy="105" rx="2.5" ry="1.5"/>
          <ellipse cx="100" cy="108" rx="2.5" ry="1.5"/>
          <ellipse cx="120" cy="106" rx="2.5" ry="1.5"/>
        </g>
        <!-- egg yellow chunks -->
        <ellipse cx="80" cy="100" rx="5" ry="3" fill="#FFE07A"/>
        <ellipse cx="115" cy="98" rx="6" ry="3" fill="#FFE07A"/>
        <!-- green onion bits -->
        <rect x="92" y="85" width="6" height="2" fill="#2A9D8F" transform="rotate(15 92 85)"/>
        <rect x="105" y="105" width="6" height="2" fill="#2A9D8F" transform="rotate(-25 105 105)"/>
      </svg>
    `,
    "wrap": `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#F5EAD0"/>
        <!-- plate -->
        <ellipse cx="100" cy="105" rx="80" ry="50" fill="#FFFBF1"/>
        <ellipse cx="100" cy="103" rx="74" ry="44" fill="#FFF7E8"/>
        <!-- wrap halves -->
        <g transform="rotate(-12 100 100)">
          <rect x="55" y="70" width="40" height="70" rx="6" fill="#F5EAD0" stroke="#E6B43A" stroke-width="1.5"/>
          <rect x="58" y="74" width="34" height="6" fill="#E94F37"/>
          <rect x="58" y="82" width="34" height="5" fill="#2A9D8F"/>
          <rect x="58" y="89" width="34" height="5" fill="#FFD166"/>
          <rect x="58" y="96" width="34" height="6" fill="#E89A4B"/>
          <rect x="58" y="104" width="34" height="5" fill="#2A9D8F"/>
        </g>
        <g transform="rotate(12 100 100)">
          <rect x="105" y="70" width="40" height="70" rx="6" fill="#F5EAD0" stroke="#E6B43A" stroke-width="1.5"/>
          <rect x="108" y="74" width="34" height="6" fill="#E94F37"/>
          <rect x="108" y="82" width="34" height="5" fill="#2A9D8F"/>
          <rect x="108" y="89" width="34" height="5" fill="#FFD166"/>
          <rect x="108" y="96" width="34" height="6" fill="#E89A4B"/>
        </g>
      </svg>
    `,
    "salad": `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#D4ECE9"/>
        <ellipse cx="100" cy="110" rx="82" ry="22" fill="#1F7A6F"/>
        <ellipse cx="100" cy="105" rx="80" ry="40" fill="#FFFBF1"/>
        <ellipse cx="100" cy="100" rx="72" ry="34" fill="#D4ECE9"/>
        <!-- spinach leaves -->
        <g fill="#2A9D8F">
          <ellipse cx="65" cy="92" rx="12" ry="6" transform="rotate(-25 65 92)"/>
          <ellipse cx="85" cy="85" rx="13" ry="6" transform="rotate(15 85 85)"/>
          <ellipse cx="110" cy="90" rx="12" ry="6" transform="rotate(-15 110 90)"/>
          <ellipse cx="135" cy="95" rx="11" ry="5" transform="rotate(25 135 95)"/>
          <ellipse cx="75" cy="105" rx="11" ry="5" transform="rotate(20 75 105)"/>
          <ellipse cx="100" cy="108" rx="14" ry="6" transform="rotate(-10 100 108)"/>
          <ellipse cx="128" cy="110" rx="11" ry="5" transform="rotate(-20 128 110)"/>
        </g>
        <g fill="#1F7A6F" opacity="0.55">
          <ellipse cx="65" cy="92" rx="6" ry="2" transform="rotate(-25 65 92)"/>
          <ellipse cx="85" cy="85" rx="6" ry="2" transform="rotate(15 85 85)"/>
          <ellipse cx="100" cy="108" rx="7" ry="2" transform="rotate(-10 100 108)"/>
        </g>
        <!-- tomato halves -->
        <circle cx="80" cy="98" r="7" fill="#E94F37"/>
        <circle cx="115" cy="100" r="6" fill="#E94F37"/>
        <circle cx="95" cy="115" r="5" fill="#E94F37"/>
        <circle cx="125" cy="92" r="5" fill="#E94F37"/>
        <!-- cheese -->
        <rect x="75" y="92" width="4" height="2" fill="#FFFBF1"/>
        <rect x="105" y="105" width="5" height="2" fill="#FFFBF1"/>
        <rect x="120" y="103" width="4" height="2" fill="#FFFBF1"/>
      </svg>
    `,
    "eggs-toast": `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#FFE7B0"/>
        <ellipse cx="100" cy="120" rx="78" ry="18" fill="#F5EAD0"/>
        <ellipse cx="100" cy="115" rx="78" ry="40" fill="#FFFBF1"/>
        <!-- toast -->
        <path d="M50,110 Q50,75 65,72 Q75,68 100,68 Q125,68 135,72 Q150,75 150,110 Z" fill="#C8924F"/>
        <path d="M55,108 Q55,80 70,77 Q80,73 100,73 Q120,73 130,77 Q145,80 145,108 Z" fill="#E89A4B"/>
        <!-- spinach pile -->
        <g fill="#2A9D8F">
          <ellipse cx="80" cy="95" rx="9" ry="4" transform="rotate(-20 80 95)"/>
          <ellipse cx="100" cy="92" rx="11" ry="5"/>
          <ellipse cx="120" cy="95" rx="9" ry="4" transform="rotate(20 120 95)"/>
          <ellipse cx="90" cy="100" rx="8" ry="4" transform="rotate(10 90 100)"/>
        </g>
        <!-- egg -->
        <ellipse cx="100" cy="90" rx="22" ry="14" fill="#FFFBF1"/>
        <circle cx="100" cy="88" r="9" fill="#FFD166"/>
        <circle cx="100" cy="88" r="7" fill="#FFE07A"/>
        <!-- chili flakes -->
        <circle cx="92" cy="85" r="1.2" fill="#E94F37"/>
        <circle cx="108" cy="87" r="1.2" fill="#E94F37"/>
        <circle cx="100" cy="80" r="1" fill="#E94F37"/>
      </svg>
    `,
    "pepper-skillet": `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#FBE1DA"/>
        <ellipse cx="100" cy="115" rx="76" ry="16" fill="#1F1B16"/>
        <ellipse cx="100" cy="110" rx="76" ry="48" fill="#2D2A26"/>
        <ellipse cx="100" cy="105" rx="70" ry="42" fill="#3A332C"/>
        <ellipse cx="100" cy="105" rx="65" ry="35" fill="#C8371F"/>
        <ellipse cx="100" cy="103" rx="62" ry="32" fill="#E94F37"/>
        <!-- pepper strips -->
        <rect x="70" y="92" width="22" height="6" rx="3" fill="#C8371F" transform="rotate(-15 81 95)"/>
        <rect x="110" y="95" width="22" height="6" rx="3" fill="#C8371F" transform="rotate(20 121 98)"/>
        <rect x="85" y="105" width="22" height="6" rx="3" fill="#E89A4B" transform="rotate(-5 96 108)"/>
        <rect x="65" y="110" width="22" height="6" rx="3" fill="#FFD166" transform="rotate(15 76 113)"/>
        <rect x="105" y="112" width="22" height="6" rx="3" fill="#2A9D8F" transform="rotate(-20 116 115)"/>
        <!-- beans -->
        <ellipse cx="75" cy="100" rx="4" ry="3" fill="#F5EAD0"/>
        <ellipse cx="135" cy="105" rx="4" ry="3" fill="#F5EAD0"/>
        <ellipse cx="100" cy="118" rx="4" ry="3" fill="#F5EAD0"/>
        <!-- handle -->
        <rect x="170" y="103" width="20" height="6" fill="#2D2A26" rx="2"/>
      </svg>
    `,
    "pasta-broccoli": `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#D4ECE9"/>
        <ellipse cx="100" cy="105" rx="78" ry="20" fill="#F5EAD0"/>
        <ellipse cx="100" cy="100" rx="78" ry="40" fill="#FFFBF1"/>
        <ellipse cx="100" cy="100" rx="68" ry="32" fill="#FFE7B0"/>
        <g stroke="#E6B43A" stroke-width="2.5" fill="none" stroke-linecap="round">
          <path d="M40,95 Q70,80 100,90 T160,95"/>
          <path d="M45,105 Q80,90 110,100 T155,108"/>
          <path d="M50,115 Q85,98 115,108 T160,118"/>
        </g>
        <!-- broccoli florets -->
        <g fill="#2A9D8F">
          <circle cx="75" cy="92" r="9"/>
          <circle cx="68" cy="88" r="5"/>
          <circle cx="82" cy="86" r="5"/>
          <circle cx="78" cy="98" r="5"/>
          <rect x="73" y="98" width="4" height="6" fill="#1F7A6F"/>
        </g>
        <g fill="#2A9D8F">
          <circle cx="125" cy="100" r="9"/>
          <circle cx="118" cy="96" r="5"/>
          <circle cx="132" cy="94" r="5"/>
          <circle cx="128" cy="106" r="5"/>
          <rect x="123" y="106" width="4" height="6" fill="#1F7A6F"/>
        </g>
        <g fill="#2A9D8F">
          <circle cx="100" cy="108" r="8"/>
          <circle cx="94" cy="104" r="4"/>
          <circle cx="106" cy="104" r="4"/>
        </g>
      </svg>
    `,
    "veggie-soup": `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#FBE1DA"/>
        <ellipse cx="100" cy="120" rx="78" ry="18" fill="#C8371F"/>
        <path d="M22,120 Q22,170 100,175 Q178,170 178,120 Z" fill="#FFFBF1"/>
        <ellipse cx="100" cy="120" rx="72" ry="14" fill="#F5EAD0"/>
        <ellipse cx="100" cy="118" rx="68" ry="12" fill="#E94F37"/>
        <ellipse cx="100" cy="118" rx="64" ry="10" fill="#C8371F" opacity="0.6"/>
        <!-- veg bits floating -->
        <circle cx="75" cy="116" r="3" fill="#FFD166"/>
        <circle cx="92" cy="119" r="3" fill="#2A9D8F"/>
        <circle cx="110" cy="115" r="3" fill="#FFFBF1"/>
        <circle cx="128" cy="119" r="3" fill="#FFD166"/>
        <ellipse cx="85" cy="113" rx="6" ry="2" fill="#2A9D8F"/>
        <ellipse cx="118" cy="117" rx="6" ry="2" fill="#2A9D8F"/>
        <!-- steam -->
        <path d="M85,90 Q90,80 85,70" stroke="#C8371F" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.4"/>
        <path d="M115,90 Q120,80 115,70" stroke="#C8371F" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.4"/>
      </svg>
    `,
  };
  return ILLUS[key] || ILLUS["pasta-tomato"];
}

// Lightweight category color for thumbnails when no illustration
function thumbStyle(key) {
  const map = {
    "pasta-tomato": "#FFE7B0",
    "skillet": "#FBE1DA",
    "soup": "#D4ECE9",
    "lemon-pasta": "#FFF1CC",
    "rice-beans": "#FFF1CC",
    "fried-rice": "#F5E4CC",
    "wrap": "#F5EAD0",
    "salad": "#D4ECE9",
    "eggs-toast": "#FFE7B0",
    "pepper-skillet": "#FBE1DA",
    "pasta-broccoli": "#D4ECE9",
    "veggie-soup": "#FBE1DA",
  };
  return map[key] || "#F5EAD0";
}

window.INGREDIENT_DATA = INGREDIENT_DATA;
window.ICON_SVGS = ICON_SVGS;
window.ingredientIcon = ingredientIcon;
window.WHEEL_CATEGORIES = WHEEL_CATEGORIES;
window.RECIPES = RECIPES;
window.QUICK_ADD = QUICK_ADD;
window.INITIAL_PANTRY = INITIAL_PANTRY;
window.INITIAL_SAVED = INITIAL_SAVED;
window.INITIAL_GROCERY = INITIAL_GROCERY;
window.SUBSTITUTIONS = SUBSTITUTIONS;
window.recipeIllustration = recipeIllustration;
window.thumbStyle = thumbStyle;
window.CATEGORY_DEFAULTS = CATEGORY_DEFAULTS;
window.ING_CATEGORIES_LIST = ING_CATEGORIES_LIST;
window.ingData = ingData;
window.allIngredientNames = allIngredientNames;
