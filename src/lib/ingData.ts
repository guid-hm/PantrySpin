import { INGREDIENT_DATA } from "@/data/ingredients";
import type { IngredientData, CustomIngredients, IngredientOverrides } from "@/types";

export function ingData(
  name: string,
  customIngs: CustomIngredients = {},
  overrides: IngredientOverrides = {}
): IngredientData | null {
  const base: IngredientData | undefined =
    INGREDIENT_DATA[name] ?? (customIngs[name] as IngredientData | undefined);
  const override = overrides[name];
  if (!base && !override) return null;
  return { ...(base ?? ({} as IngredientData)), ...(override ?? {}) };
}

export function allIngredientNames(customIngs: CustomIngredients = {}): string[] {
  return [...Object.keys(INGREDIENT_DATA), ...Object.keys(customIngs)];
}
