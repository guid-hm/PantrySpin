import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useUserId } from "@/lib/auth";
import type { CustomIngredients, IngredientOverrides, IngredientCategory } from "@/types";

export type IngredientState = { overrides: IngredientOverrides; customs: CustomIngredients };

export function useIngredients() {
  const userId = useUserId();
  return useQuery({
    queryKey: ["ingredients", userId],
    queryFn: async (): Promise<IngredientState> => {
      const { data, error } = await supabase
        .from("ingredient_overrides")
        .select("name, cat, color, swatch, is_custom")
        .eq("user_id", userId);
      if (error) throw error;

      const overrides: IngredientOverrides = {};
      const customs: CustomIngredients = {};

      for (const row of data ?? []) {
        if (row.is_custom) {
          customs[row.name] = {
            cat:    (row.cat    ?? "Other") as IngredientCategory,
            color:  row.color  ?? "#8A857D",
            swatch: row.swatch ?? "#E7DEC8",
          };
        } else {
          const o: Record<string, string> = {};
          if (row.cat)    o.cat    = row.cat;
          if (row.color)  o.color  = row.color;
          if (row.swatch) o.swatch = row.swatch;
          if (Object.keys(o).length) overrides[row.name] = o as IngredientOverrides[string];
        }
      }
      return { overrides, customs };
    },
  });
}

export function useUpsertIngredient() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      name:     string;
      cat?:     string | null;
      color?:   string | null;
      swatch?:  string | null;
      isCustom?: boolean;
    }) => {
      const { error } = await supabase.from("ingredient_overrides").upsert(
        {
          user_id:   userId,
          name:      payload.name,
          cat:       payload.cat    ?? null,
          color:     payload.color  ?? null,
          swatch:    payload.swatch ?? null,
          is_custom: payload.isCustom ?? false,
        },
        { onConflict: "user_id,name" }
      );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ingredients", userId] }),
  });
}

export function useDeleteIngredient() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase
        .from("ingredient_overrides")
        .delete()
        .eq("user_id", userId)
        .eq("name", name);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ingredients", userId] }),
  });
}
