import { useIngredients } from "@/lib/api/ingredients";
import { ingData } from "@/lib/ingData";
import { ingredientIcon } from "@/data/ingredients";

interface IngIconProps {
  name: string;
  size?: number;
}

export function IngIcon({ name, size = 22 }: IngIconProps) {
  const { data: ingState } = useIngredients();
  const data = ingData(
    name,
    ingState?.customs   ?? {},
    ingState?.overrides ?? {}
  ) ?? { color: "#8A857D", swatch: "#E7DEC8" };

  return (
    <span
      className="chip-ico"
      style={{
        width:     size,
        height:    size,
        flex:      `0 0 ${size}px`,
        background: data.swatch,
        color:      data.color,
      }}
      dangerouslySetInnerHTML={{ __html: ingredientIcon(name) }}
    />
  );
}
