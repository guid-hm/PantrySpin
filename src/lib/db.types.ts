export interface Database {
  public: {
    Tables: {
      ingredients: {
        Row:    { name: string; cat: string; color: string; swatch: string; user_id: string | null; created_at: string };
        Insert: { name: string; cat: string; color?: string; swatch?: string; user_id?: string | null };
        Update: { cat?: string; color?: string; swatch?: string };
        Relationships: [];
      };
      recipes: {
        Row:    { id: string; user_id: string | null; name: string; category: string; time_minutes: number; difficulty: string; servings: number; diet: string[]; blurb: string; illus_key: string; is_user_created: boolean; created_at: string };
        Insert: { id: string; user_id?: string | null; name: string; category: string; time_minutes: number; difficulty: string; servings: number; diet?: string[]; blurb?: string; illus_key?: string; is_user_created?: boolean };
        Update: { name?: string; category?: string; time_minutes?: number; difficulty?: string; servings?: number; diet?: string[]; blurb?: string; illus_key?: string };
        Relationships: [];
      };
      recipe_ingredients: {
        Row:    { recipe_id: string; name: string; optional: boolean };
        Insert: { recipe_id: string; name: string; optional?: boolean };
        Update: { optional?: boolean };
        Relationships: [];
      };
      recipe_steps: {
        Row:    { recipe_id: string; step_index: number; body: string };
        Insert: { recipe_id: string; step_index: number; body: string };
        Update: { body?: string };
        Relationships: [];
      };
      recipe_tags: {
        Row:    { recipe_id: string; tag: string };
        Insert: { recipe_id: string; tag: string };
        Update: Record<string, never>;
        Relationships: [];
      };
      pantry_items: {
        Row:    { id: string; user_id: string; name: string; expires_in_days: number; location: string; qty: string; unit: string; notes: string; created_at: string };
        Insert: { id?: string; user_id: string; name: string; expires_in_days?: number; location?: string; qty?: string; unit?: string; notes?: string };
        Update: { name?: string; expires_in_days?: number; location?: string; qty?: string; unit?: string; notes?: string };
        Relationships: [];
      };
      saved_recipes: {
        Row:    { user_id: string; recipe_id: string; saved_at: string };
        Insert: { user_id: string; recipe_id: string };
        Update: Record<string, never>;
        Relationships: [];
      };
      grocery_items: {
        Row:    { id: string; user_id: string; name: string; cat: string; qty: string; checked: boolean; src: string; created_at: string };
        Insert: { id?: string; user_id: string; name: string; cat?: string; qty?: string; checked?: boolean; src?: string };
        Update: { name?: string; cat?: string; qty?: string; checked?: boolean; src?: string };
        Relationships: [];
      };
      user_prefs: {
        Row:    { user_id: string; diet: string; avoid: string[]; max_time: number; difficulty: string; servings: number; priority: string; onboarded: boolean; updated_at: string };
        Insert: { user_id: string; diet?: string; avoid?: string[]; max_time?: number; difficulty?: string; servings?: number; priority?: string; onboarded?: boolean };
        Update: { diet?: string; avoid?: string[]; max_time?: number; difficulty?: string; servings?: number; priority?: string; onboarded?: boolean; updated_at?: string };
        Relationships: [];
      };
      ingredient_overrides: {
        Row:    { user_id: string; name: string; cat: string | null; color: string | null; swatch: string | null; is_custom: boolean };
        Insert: { user_id: string; name: string; cat?: string | null; color?: string | null; swatch?: string | null; is_custom?: boolean };
        Update: { cat?: string | null; color?: string | null; swatch?: string | null; is_custom?: boolean };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
