import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useUserId } from "@/lib/auth";

export function useSaved() {
  const userId = useUserId();
  return useQuery({
    queryKey: ["saved", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_recipes")
        .select("recipe_id")
        .eq("user_id", userId);
      if (error) throw error;
      return (data ?? []).map((r) => r.recipe_id);
    },
  });
}

export function useToggleSaved() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isSaved }: { id: string; isSaved: boolean }) => {
      if (isSaved) {
        const { error } = await supabase
          .from("saved_recipes")
          .delete()
          .eq("user_id", userId)
          .eq("recipe_id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("saved_recipes")
          .insert({ user_id: userId, recipe_id: id });
        if (error) throw error;
      }
    },
    onMutate: async ({ id, isSaved }) => {
      await qc.cancelQueries({ queryKey: ["saved", userId] });
      const prev = qc.getQueryData<string[]>(["saved", userId]);
      qc.setQueryData<string[]>(["saved", userId], (old = []) =>
        isSaved ? old.filter((x) => x !== id) : [...old, id]
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["saved", userId], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["saved", userId] }),
  });
}
