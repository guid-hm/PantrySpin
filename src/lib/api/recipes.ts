import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useUserId } from "@/lib/auth";
import type { Recipe } from "@/types";

type RecipeRow = {
  id: string;
  user_id: string | null;
  name: string;
  category: string;
  time_minutes: number;
  difficulty: string;
  servings: number;
  diet: string[];
  blurb: string;
  illus_key: string;
  is_user_created: boolean;
  recipe_ingredients: Array<{ name: string; optional: boolean }>;
  recipe_steps: Array<{ step_index: number; body: string }>;
  recipe_tags: Array<{ tag: string }>;
};

const rowToRecipe = (row: RecipeRow): Recipe => ({
  id:            row.id,
  name:          row.name,
  category:      row.category,
  time:          row.time_minutes,
  difficulty:    row.difficulty as Recipe["difficulty"],
  servings:      row.servings,
  diet:          row.diet,
  blurb:         row.blurb,
  illusKey:      row.illus_key,
  isUserCreated: row.is_user_created || undefined,
  tags:          row.recipe_tags.map((t) => t.tag),
  needs:         row.recipe_ingredients.filter((i) => !i.optional).map((i) => i.name),
  optional:      row.recipe_ingredients.filter((i) => i.optional).map((i) => i.name),
  steps:         [...row.recipe_steps].sort((a, b) => a.step_index - b.step_index).map((s) => s.body),
});

const RECIPE_SELECT = "id,user_id,name,category,time_minutes,difficulty,servings,diet,blurb,illus_key,is_user_created,recipe_ingredients(name,optional),recipe_steps(step_index,body),recipe_tags(tag)";

export function useRecipes() {
  const userId = useUserId();
  return useQuery({
    queryKey: ["recipes", userId],
    queryFn: async () => {
      const [globalRes, userRes] = await Promise.all([
        supabase.from("recipes").select(RECIPE_SELECT).is("user_id", null),
        supabase.from("recipes").select(RECIPE_SELECT).eq("user_id", userId).eq("is_user_created", true),
      ]);
      if (globalRes.error) throw globalRes.error;
      if (userRes.error)   throw userRes.error;
      return [
        ...(globalRes.data ?? []).map((r) => rowToRecipe(r as unknown as RecipeRow)),
        ...(userRes.data   ?? []).map((r) => rowToRecipe(r as unknown as RecipeRow)),
      ];
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateRecipe() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (recipe: Recipe) => {
      const { error: recErr } = await supabase.from("recipes").insert({
        id:              recipe.id,
        user_id:         userId,
        name:            recipe.name,
        category:        recipe.category,
        time_minutes:    recipe.time,
        difficulty:      recipe.difficulty,
        servings:        recipe.servings,
        diet:            recipe.diet,
        blurb:           recipe.blurb,
        illus_key:       recipe.illusKey,
        is_user_created: true,
      });
      if (recErr) throw recErr;

      const ingRows = [
        ...recipe.needs.map((n) => ({ recipe_id: recipe.id, name: n, optional: false })),
        ...(recipe.optional ?? []).map((n) => ({ recipe_id: recipe.id, name: n, optional: true })),
      ];
      if (ingRows.length) {
        const { error } = await supabase.from("recipe_ingredients").insert(ingRows);
        if (error) throw error;
      }

      if (recipe.steps?.length) {
        const { error } = await supabase.from("recipe_steps").insert(
          recipe.steps.map((body, i) => ({ recipe_id: recipe.id, step_index: i, body }))
        );
        if (error) throw error;
      }

      if (recipe.tags?.length) {
        const { error } = await supabase.from("recipe_tags").insert(
          recipe.tags.map((tag) => ({ recipe_id: recipe.id, tag }))
        );
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recipes", userId] }),
  });
}

export function useUpdateRecipe() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (recipe: Recipe) => {
      const { error: recErr } = await supabase.from("recipes").update({
        name:         recipe.name,
        category:     recipe.category,
        time_minutes: recipe.time,
        difficulty:   recipe.difficulty,
        servings:     recipe.servings,
        diet:         recipe.diet,
        blurb:        recipe.blurb,
        illus_key:    recipe.illusKey,
      }).eq("id", recipe.id).eq("user_id", userId);
      if (recErr) throw recErr;

      // Replace child rows by deleting and re-inserting
      for (const table of ["recipe_ingredients", "recipe_steps", "recipe_tags"] as const) {
        const { error } = await supabase.from(table).delete().eq("recipe_id", recipe.id);
        if (error) throw error;
      }

      const ingRows = [
        ...recipe.needs.map((n) => ({ recipe_id: recipe.id, name: n, optional: false })),
        ...(recipe.optional ?? []).map((n) => ({ recipe_id: recipe.id, name: n, optional: true })),
      ];
      if (ingRows.length) {
        const { error } = await supabase.from("recipe_ingredients").insert(ingRows);
        if (error) throw error;
      }
      if (recipe.steps?.length) {
        const { error } = await supabase.from("recipe_steps").insert(
          recipe.steps.map((body, i) => ({ recipe_id: recipe.id, step_index: i, body }))
        );
        if (error) throw error;
      }
      if (recipe.tags?.length) {
        const { error } = await supabase.from("recipe_tags").insert(
          recipe.tags.map((tag) => ({ recipe_id: recipe.id, tag }))
        );
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recipes", userId] }),
  });
}

export function useDeleteRecipe() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recipes", userId] }),
  });
}
