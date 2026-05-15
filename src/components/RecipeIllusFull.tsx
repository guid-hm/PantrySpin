import { thumbStyle } from "@/data/recipes";
import { recipeIllustration } from "@/data/illustrations";

interface RecipeIllusFullProps {
  illusKey: string;
  height?: number;
  radius?: number;
}

export function RecipeIllusFull({ illusKey, height = 320, radius = 20 }: RecipeIllusFullProps) {
  return (
    <div
      style={{
        width: "100%",
        height,
        borderRadius: radius,
        overflow: "hidden",
        background: thumbStyle(illusKey),
      }}
      dangerouslySetInnerHTML={{ __html: recipeIllustration(illusKey) }}
    />
  );
}
