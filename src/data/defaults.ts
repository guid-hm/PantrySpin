import type { PantryItem, GroceryItem } from "@/types";

export const INITIAL_PANTRY: PantryItem[] = [
  { name: "Tomato",    expiresInDays: 3,   location: "Fridge" },
  { name: "Pasta",     expiresInDays: 999, location: "Pantry" },
  { name: "Garlic",    expiresInDays: 30,  location: "Pantry" },
  { name: "Olive Oil", expiresInDays: 999, location: "Pantry" },
  { name: "Spinach",   expiresInDays: 2,   location: "Fridge" },
  { name: "Cheese",    expiresInDays: 12,  location: "Fridge" },
  { name: "Eggs",      expiresInDays: 14,  location: "Fridge" },
  { name: "Onion",     expiresInDays: 21,  location: "Pantry" },
];

export const INITIAL_SAVED: string[] = [
  "tomato-garlic-pasta",
  "white-bean-spinach-soup",
  "garlic-egg-fried-rice",
];

export const INITIAL_GROCERY: GroceryItem[] = [
  { name: "Basil",     qty: "1 bunch", cat: "Produce", checked: false, src: "Tomato Garlic Pasta" },
  { name: "Parmesan",  qty: "1 wedge", cat: "Dairy",   checked: false, src: "Lemon Spinach Pasta" },
  { name: "Chickpeas", qty: "2 cans",  cat: "Pantry",  checked: true,  src: "manual" },
  { name: "Lime",      qty: "3",       cat: "Produce", checked: false, src: "Cheesy Rice & Beans" },
  { name: "Tortillas", qty: "1 pack",  cat: "Pantry",  checked: false, src: "Loaded Veggie Wrap" },
];
