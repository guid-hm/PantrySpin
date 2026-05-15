import { Routes, Route } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { usePrefs } from "@/lib/api/prefs";
import { Sidebar } from "@/components/Sidebar";
import { Toast } from "@/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ResultReveal } from "@/components/ResultReveal";
import { AddIngredientModal } from "@/components/modals/AddIngredientModal";
import { EditIngredientModal } from "@/components/modals/EditIngredientModal";
import { CreateIngredientModal } from "@/components/modals/CreateIngredientModal";
import { CreateRecipeModal } from "@/components/modals/CreateRecipeModal";
import { EditRecipeModal } from "@/components/modals/EditRecipeModal";
import { SpinScreen } from "@/screens/SpinScreen";
import { PantryScreen } from "@/screens/PantryScreen";
import { RecipesScreen } from "@/screens/RecipesScreen";
import { SavedScreen } from "@/screens/SavedScreen";
import { GroceryScreen } from "@/screens/GroceryScreen";
import { PreferencesScreen } from "@/screens/PreferencesScreen";
import { OnboardingScreen } from "@/screens/OnboardingScreen";
import { RecipeDetailScreen } from "@/screens/RecipeDetailScreen";

export function App() {
  const { data: prefs, isLoading } = usePrefs();

  const showAddModal     = useAppStore((s) => s.showAddModal);
  const editingItem      = useAppStore((s) => s.editingItem);
  const createIngState   = useAppStore((s) => s.createIngState);
  const showCreateRecipe = useAppStore((s) => s.showCreateRecipe);
  const editingRecipe    = useAppStore((s) => s.editingRecipe);
  const revealRecipeId   = useAppStore((s) => s.revealRecipeId);
  const spinning         = useAppStore((s) => s.spinning);

  if (isLoading) return null;

  if (!prefs?.onboarded) {
    return <OnboardingScreen />;
  }

  return (
    <>
      <div className="app-root">
        <Sidebar />
        <main className="main">
          <ErrorBoundary>
            <Routes>
              <Route path="/"        element={<SpinScreen />} />
              <Route path="/pantry"  element={<PantryScreen />} />
              <Route path="/recipes" element={<RecipesScreen />} />
              <Route path="/saved"   element={<SavedScreen />} />
              <Route path="/grocery" element={<GroceryScreen />} />
              <Route path="/prefs"   element={<PreferencesScreen />} />
              <Route path="/recipe/:id" element={<RecipeDetailScreen />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>

      {showAddModal     && <AddIngredientModal />}
      {editingItem      && <EditIngredientModal />}
      {createIngState   && <CreateIngredientModal />}
      {showCreateRecipe && <CreateRecipeModal />}
      {editingRecipe    && <EditRecipeModal />}
      {revealRecipeId && !spinning && <ResultReveal />}

      <Toast />
    </>
  );
}
