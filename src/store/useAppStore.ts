import { create } from "zustand";
import type { PantryItem, Recipe, UserPrefs, SpinMode, IngredientCategory } from "@/types";
import { WHEEL_CATEGORIES } from "@/data/recipes";
import { matchScore } from "@/lib/matchScore";

interface CreateIngState {
  initialName: string;
  callback: ((name: string) => void) | null;
}

interface AppState {
  // --- UI state (not persisted to server) ---
  toastMsg:        string | null;
  showAddModal:    boolean;
  editingItem:     PantryItem | null;
  createIngState:  CreateIngState | null;
  showCreateRecipe:boolean;
  editingRecipe:   Recipe | null;
  revealRecipeId:  string | null;
  rotation:        number;
  spinning:        boolean;
  spinResult:      string | null;
  spinMode:        SpinMode;

  // --- UI actions ---
  showToast:             (msg: string) => void;
  setShowAddModal:       (v: boolean) => void;
  setEditingItem:        (item: PantryItem | null) => void;
  openCreateIngredient:  (initialName: string, callback?: (name: string) => void) => void;
  closeCreateIngredient: () => void;
  setShowCreateRecipe:   (v: boolean) => void;
  setEditingRecipe:      (recipe: Recipe | null) => void;
  setRevealRecipeId:     (id: string | null) => void;
  setSpinning:           (v: boolean) => void;
  setSpinResult:         (id: string | null) => void;
  setSpinMode:           (mode: SpinMode) => void;
  spin:                  (pantry: PantryItem[], allRecipes: Recipe[], prefs: UserPrefs) => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useAppStore = create<AppState>()((set, get) => ({
  toastMsg:         null,
  showAddModal:     false,
  editingItem:      null,
  createIngState:   null,
  showCreateRecipe: false,
  editingRecipe:    null,
  revealRecipeId:   null,
  rotation:         0,
  spinning:         false,
  spinResult:       null,
  spinMode:         "any",

  showToast: (msg) => {
    set({ toastMsg: msg });
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toastMsg: null }), 2400);
  },
  setShowAddModal:       (v)    => set({ showAddModal: v }),
  setEditingItem:        (item) => set({ editingItem: item }),
  openCreateIngredient:  (initialName, callback) =>
    set({ createIngState: { initialName: initialName ?? "", callback: callback ?? null } }),
  closeCreateIngredient: () => set({ createIngState: null }),
  setShowCreateRecipe:   (v)      => set({ showCreateRecipe: v }),
  setEditingRecipe:      (recipe) => set({ editingRecipe: recipe }),
  setRevealRecipeId:     (id)   => set({ revealRecipeId: id }),
  setSpinning:           (v)    => set({ spinning: v }),
  setSpinResult:         (id)   => set({ spinResult: id }),
  setSpinMode:           (mode) => set({ spinMode: mode }),

  spin: (pantry, allRecipes, prefs) => {
    const { spinning, rotation, spinMode } = get();
    if (spinning) return;
    if (pantry.length < 2) {
      get().showToast("Add a few ingredients first");
      return;
    }
    set({ spinning: true, spinResult: null, revealRecipeId: null });

    const pantryNames = new Set(pantry.map((p) => p.name));
    const expiring    = pantry.filter((p) => p.expiresInDays <= 3);

    type ScoredRecipe = Recipe & { _score: ReturnType<typeof matchScore> };
    let candidates: ScoredRecipe[] = allRecipes.map((r) => ({
      ...r,
      _score: matchScore(r, [...pantryNames]),
    }));

    if (spinMode === "quick")    candidates = candidates.filter((r) => r.time < 20);
    else if (spinMode === "healthy")  candidates = candidates.filter((r) => r.tags.includes("Vegetarian") || r.tags.includes("Healthy"));
    else if (spinMode === "comfort")  candidates = candidates.filter((r) => r.tags.includes("Comfort") || r.tags.includes("Cozy"));
    else if (spinMode === "veg")      candidates = candidates.filter((r) => r.diet.includes("vegetarian"));
    else if (spinMode === "expiring") {
      const expNames = new Set(expiring.map((e) => e.name));
      candidates = candidates.filter((r) => r.needs.some((n) => expNames.has(n)));
    }

    if (candidates.length === 0) {
      candidates = allRecipes.map((r) => ({ ...r, _score: matchScore(r, [...pantryNames]) }));
    }

    if (prefs.diet === "Vegetarian") {
      const veg = candidates.filter((r) => r.diet.includes("vegetarian"));
      if (veg.length) candidates = veg;
    }
    if (prefs.avoid.length) {
      const lower    = prefs.avoid.map((x) => x.toLowerCase());
      const filtered = candidates.filter((r) => !r.needs.some((n) => lower.includes(n.toLowerCase())));
      if (filtered.length) candidates = filtered;
    }

    candidates.sort((a, b) => b._score.pct - a._score.pct);
    candidates = candidates.slice(0, Math.min(4, candidates.length));

    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    let catIdx   = WHEEL_CATEGORIES.findIndex((c) => c.key === chosen.category);
    if (catIdx === -1) catIdx = Math.floor(Math.random() * WHEEL_CATEGORIES.length);

    const slice      = 360 / WHEEL_CATEGORIES.length;
    const target     = ((-catIdx * slice) % 360 + 360) % 360;
    const fullSpins  = 4 + Math.floor(Math.random() * 2);
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta      = ((target - currentMod) + 360) % 360;
    const jitter     = (Math.random() - 0.5) * (slice * 0.6);

    set({ rotation: rotation + fullSpins * 360 + delta + jitter });

    setTimeout(() => {
      set({ spinning: false, spinResult: chosen.id, revealRecipeId: chosen.id });
    }, 2500);
  },
}));

// Convenience re-export so modals can still import IngredientCategory without touching types directly
export type { IngredientCategory };
