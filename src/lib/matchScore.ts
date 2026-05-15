import type { Recipe, MatchResult } from "@/types";

export function matchScore(recipe: Recipe, pantry: string[]): MatchResult {
  const pantrySet = new Set(pantry);
  const have = recipe.needs.filter((n) => pantrySet.has(n));
  const need = recipe.needs.filter((n) => !pantrySet.has(n));
  const pct = recipe.needs.length
    ? Math.round((have.length / recipe.needs.length) * 100)
    : 0;
  return { have, need, pct };
}
