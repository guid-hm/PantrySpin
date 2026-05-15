import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useUserId } from "@/lib/auth";
import type { UserPrefs } from "@/types";

export type ServerPrefs = UserPrefs & { onboarded: boolean };

const DEFAULT: ServerPrefs = {
  diet:       "No preference",
  avoid:      [],
  maxTime:    30,
  difficulty: "Easy",
  servings:   2,
  priority:   "use-what-i-have",
  onboarded:  false,
};

const dbToPrefs = (row: { diet: string; avoid: string[]; max_time: number; difficulty: string; servings: number; priority: string; onboarded: boolean }): ServerPrefs => ({
  diet:       row.diet,
  avoid:      row.avoid ?? [],
  maxTime:    row.max_time,
  difficulty: row.difficulty as UserPrefs["difficulty"],
  servings:   row.servings,
  priority:   row.priority as UserPrefs["priority"],
  onboarded:  row.onboarded,
});

export function usePrefs() {
  const userId = useUserId();
  return useQuery({
    queryKey: ["prefs", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_prefs")
        .select("diet, avoid, max_time, difficulty, servings, priority, onboarded")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data ? dbToPrefs(data) : DEFAULT;
    },
  });
}

export function useUpdatePrefs() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (partial: Partial<ServerPrefs>) => {
      const patch: Record<string, unknown> = { user_id: userId, updated_at: new Date().toISOString() };
      if (partial.diet       !== undefined) patch.diet       = partial.diet;
      if (partial.avoid      !== undefined) patch.avoid      = partial.avoid;
      if (partial.maxTime    !== undefined) patch.max_time   = partial.maxTime;
      if (partial.difficulty !== undefined) patch.difficulty = partial.difficulty;
      if (partial.servings   !== undefined) patch.servings   = partial.servings;
      if (partial.priority   !== undefined) patch.priority   = partial.priority;
      if (partial.onboarded  !== undefined) patch.onboarded  = partial.onboarded;
      const { error } = await supabase
        .from("user_prefs")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .upsert(patch as any, { onConflict: "user_id" });
      if (error) throw error;
    },
    onMutate: async (partial) => {
      await qc.cancelQueries({ queryKey: ["prefs", userId] });
      const prev = qc.getQueryData<ServerPrefs>(["prefs", userId]);
      qc.setQueryData<ServerPrefs>(["prefs", userId], (old) =>
        old ? { ...old, ...partial } : old
      );
      return { prev };
    },
    onError: (_err, _partial, ctx) => {
      if (ctx?.prev) qc.setQueryData(["prefs", userId], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["prefs", userId] }),
  });
}
