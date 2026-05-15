export type IngredientCategory =
  | "Vegetables"
  | "Protein"
  | "Grains"
  | "Dairy"
  | "Pantry"
  | "Spices"
  | "Fruits"
  | "Other";

export interface IngredientData {
  cat: IngredientCategory;
  color: string;
  swatch: string;
}

export interface PantryItem {
  name: string;
  expiresInDays: number;
  location: "Fridge" | "Pantry" | "Freezer" | "Counter";
  qty?: string;
  unit?: string;
  notes?: string;
}

export interface GroceryItem {
  name: string;
  qty: string;
  cat: string;
  checked: boolean;
  src: string;
}

export interface RecipeStep {
  body: string;
}

export type RecipeDifficulty = "Easy" | "Medium" | "Hard";

export type SpinMode = "any" | "quick" | "healthy" | "comfort" | "veg" | "expiring";

export interface Recipe {
  id: string;
  name: string;
  category: string;
  time: number;
  difficulty: RecipeDifficulty;
  servings: number;
  tags: string[];
  needs: string[];
  optional: string[];
  diet: string[];
  blurb: string;
  illusKey: string;
  steps: string[];
  isUserCreated?: boolean;
}

export interface MatchResult {
  have: string[];
  need: string[];
  pct: number;
}

export type RecipeWithMatch = Recipe & MatchResult;

export interface WheelCategory {
  key: string;
  label: string;
  color: string;
  iconName: string;
}

export interface UserPrefs {
  diet: string;
  avoid: string[];
  maxTime: number;
  difficulty: RecipeDifficulty;
  servings: number;
  priority: "use-what-i-have" | "quick" | "healthy";
}

export interface IngredientOverride {
  cat?: IngredientCategory;
  color?: string;
  swatch?: string;
}

export interface CreateIngredientData {
  name: string;
  cat: IngredientCategory;
  color: string;
  swatch: string;
}

export type CustomIngredients = Record<string, Omit<IngredientData, "cat"> & { cat: IngredientCategory }>;
export type IngredientOverrides = Record<string, IngredientOverride>;
