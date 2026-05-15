import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";
import type React from "react";

interface IconProps {
  n: string;
  size?: number;
  sw?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

function kebabToPascal(name: string): string {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

export function Icon({ n, size = 16, sw = 2, color, className, style }: IconProps) {
  const pascal = kebabToPascal(n);
  const Comp = (LucideIcons as Record<string, React.ComponentType<LucideProps>>)[pascal];
  if (!Comp) return null;

  const resolvedSize = (style?.width as number) ?? (style?.height as number) ?? size;

  return (
    <Comp
      size={resolvedSize}
      strokeWidth={sw}
      color={color ?? (style?.color as string) ?? "currentColor"}
      className={className}
      style={style}
    />
  );
}
