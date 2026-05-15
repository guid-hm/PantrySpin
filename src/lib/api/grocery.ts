import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useUserId } from "@/lib/auth";
import type { GroceryItem } from "@/types";

export type GroceryRow = GroceryItem & { id: string };

const dbToRow = (r: { id: string; name: string; cat: string; qty: string; checked: boolean; src: string }): GroceryRow => ({
  id:      r.id,
  name:    r.name,
  cat:     r.cat,
  qty:     r.qty,
  checked: r.checked,
  src:     r.src,
});

export function useGrocery() {
  const userId = useUserId();
  return useQuery({
    queryKey: ["grocery", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grocery_items")
        .select("id, name, cat, qty, checked, src")
        .eq("user_id", userId)
        .order("created_at");
      if (error) throw error;
      return (data ?? []).map(dbToRow);
    },
  });
}

export function useAddGroceryItems() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (items: GroceryItem[]) => {
      const rows = items.map((item) => ({
        user_id: userId,
        name:    item.name,
        cat:     item.cat   ?? "Other",
        qty:     item.qty   ?? "",
        checked: item.checked ?? false,
        src:     item.src   ?? "",
      }));
      const { error } = await supabase
        .from("grocery_items")
        .upsert(rows, { onConflict: "user_id,name", ignoreDuplicates: true });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["grocery", userId] }),
  });
}

export function useToggleGroceryItem() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, checked }: { id: string; checked: boolean }) => {
      const { error } = await supabase
        .from("grocery_items")
        .update({ checked: !checked })
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onMutate: async ({ id, checked }) => {
      await qc.cancelQueries({ queryKey: ["grocery", userId] });
      const prev = qc.getQueryData<GroceryRow[]>(["grocery", userId]);
      qc.setQueryData<GroceryRow[]>(["grocery", userId], (old = []) =>
        old.map((x) => (x.id === id ? { ...x, checked: !checked } : x))
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["grocery", userId], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["grocery", userId] }),
  });
}

export function useRemoveGroceryItem() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("grocery_items")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["grocery", userId] }),
  });
}

export function useClearCheckedGrocery() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("grocery_items")
        .delete()
        .eq("user_id", userId)
        .eq("checked", true);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["grocery", userId] }),
  });
}

export function useMoveCheckedToPantry() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (checkedItems: GroceryRow[]) => {
      const pantryRows = checkedItems.map((item) => ({
        user_id:         userId,
        name:            item.name,
        expires_in_days: 14,
        location:        "Pantry",
        qty:             "",
        unit:            "",
        notes:           "",
      }));
      const ids = checkedItems.map((i) => i.id);

      const [pantryResult, deleteResult] = await Promise.all([
        supabase.from("pantry_items").upsert(pantryRows, { onConflict: "user_id,name", ignoreDuplicates: true }),
        supabase.from("grocery_items").delete().in("id", ids).eq("user_id", userId),
      ]);
      if (pantryResult.error) throw pantryResult.error;
      if (deleteResult.error) throw deleteResult.error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["grocery", userId] });
      qc.invalidateQueries({ queryKey: ["pantry", userId] });
    },
  });
}
