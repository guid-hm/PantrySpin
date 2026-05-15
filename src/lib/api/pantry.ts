import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useUserId } from "@/lib/auth";
import { ingData } from "@/lib/ingData";
import type { PantryItem } from "@/types";
import type { CustomIngredients, IngredientOverrides } from "@/types";

const dbToItem = (row: { name: string; expires_in_days: number; location: string; qty: string; unit: string; notes: string }): PantryItem => ({
  name:          row.name,
  expiresInDays: row.expires_in_days,
  location:      row.location as PantryItem["location"],
  qty:           row.qty  || undefined,
  unit:          row.unit || undefined,
  notes:         row.notes || undefined,
});

export function usePantry() {
  const userId = useUserId();
  return useQuery({
    queryKey: ["pantry", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pantry_items")
        .select("name, expires_in_days, location, qty, unit, notes")
        .eq("user_id", userId)
        .order("created_at");
      if (error) throw error;
      return (data ?? []).map(dbToItem);
    },
  });
}

export function useAddPantry() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, customIngs, ingOverrides }: { name: string; customIngs: CustomIngredients; ingOverrides: IngredientOverrides }) => {
      const data = ingData(name, customIngs, ingOverrides);
      const cat  = data?.cat;
      const location: PantryItem["location"] =
        cat === "Dairy" || cat === "Protein" || cat === "Vegetables" ? "Fridge" : "Pantry";
      const { error } = await supabase.from("pantry_items").upsert(
        { user_id: userId, name, expires_in_days: 14, location, qty: "", unit: "", notes: "" },
        { onConflict: "user_id,name", ignoreDuplicates: true }
      );
      if (error) throw error;
      return name;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pantry", userId] }),
  });
}

export function useRemovePantry() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase
        .from("pantry_items")
        .delete()
        .eq("user_id", userId)
        .eq("name", name);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pantry", userId] }),
  });
}

export function useUpdatePantry() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ oldName, updated }: { oldName: string; updated: PantryItem }) => {
      const { error } = await supabase
        .from("pantry_items")
        .update({
          name:            updated.name,
          expires_in_days: updated.expiresInDays,
          location:        updated.location,
          qty:             updated.qty   ?? "",
          unit:            updated.unit  ?? "",
          notes:           updated.notes ?? "",
        })
        .eq("user_id", userId)
        .eq("name", oldName);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pantry", userId] }),
  });
}

export function useBulkAddPantry() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (items: PantryItem[]) => {
      const rows = items.map((item) => ({
        user_id:         userId,
        name:            item.name,
        expires_in_days: item.expiresInDays,
        location:        item.location,
        qty:             item.qty   ?? "",
        unit:            item.unit  ?? "",
        notes:           item.notes ?? "",
      }));
      const { error } = await supabase
        .from("pantry_items")
        .upsert(rows, { onConflict: "user_id,name", ignoreDuplicates: true });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pantry", userId] }),
  });
}
