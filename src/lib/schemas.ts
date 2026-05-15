import { z } from "zod";

export const PantryItemSchema = z.object({
  name:          z.string().min(1).max(100),
  expiresInDays: z.number().int().min(0).max(999),
  location:      z.enum(["Fridge", "Pantry", "Freezer", "Counter"]),
  qty:           z.string().max(50).optional(),
  unit:          z.string().max(30).optional(),
  notes:         z.string().max(500).optional(),
});

export const GroceryItemSchema = z.object({
  name:    z.string().min(1).max(100),
  cat:     z.string().default("Other"),
  qty:     z.string().default(""),
  checked: z.boolean().default(false),
  src:     z.string().default(""),
});

export const UserPrefsSchema = z.object({
  diet:       z.string().default("No preference"),
  avoid:      z.array(z.string()).default([]),
  maxTime:    z.number().int().min(5).max(300).default(30),
  difficulty: z.string().default("Easy"),
  servings:   z.number().int().min(1).max(12).default(2),
  priority:   z.enum(["use-what-i-have", "quick", "healthy"]).default("use-what-i-have"),
});

export const RecipeCreateSchema = z.object({
  name:        z.string().min(1).max(200),
  category:    z.string(),
  timeMinutes: z.number().int().min(5).max(300),
  difficulty:  z.enum(["Easy", "Medium", "Hard"]),
  servings:    z.number().int().min(1).max(12),
  diet:        z.array(z.string()).default([]),
  blurb:       z.string().max(500).default(""),
  illusKey:    z.string().default("pasta-tomato"),
  tags:        z.array(z.string()).default([]),
  needs:       z.array(z.string()).min(1),
  optional:    z.array(z.string()).default([]),
  steps:       z.array(z.string().min(1)).min(1),
});
