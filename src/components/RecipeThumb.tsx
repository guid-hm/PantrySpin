import { thumbStyle } from "@/data/recipes";
import { recipeIllustration } from "@/data/illustrations";

interface RecipeThumbProps {
  illusKey: string;
  size?: number;
  radius?: number;
}

export function RecipeThumb({ illusKey, size = 60, radius = 12 }: RecipeThumbProps) {
  return (
    <div
      className="thumb"
      style={{
        width: size,
        height: size,
        flex: `0 0 ${size}px`,
        borderRadius: radius,
        background: thumbStyle(illusKey),
      }}
      dangerouslySetInnerHTML={{ __html: recipeIllustration(illusKey) }}
    />
  );
}
