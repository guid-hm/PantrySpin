import type { CSSProperties } from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: number;
  style?: CSSProperties;
}

export function Skeleton({ width = "100%", height = 16, radius = 6, style }: SkeletonProps) {
  return (
    <div
      className="skeleton-pulse"
      style={{ width, height, borderRadius: radius, background: "var(--ps-line)", flexShrink: 0, ...style }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="recipe-card" style={{ pointerEvents: "none" }}>
      <div className="card-illus" style={{ background: "var(--ps-line)" }} />
      <div className="card-body" style={{ gap: 8, display: "flex", flexDirection: "column" }}>
        <Skeleton height={14} width="70%" />
        <Skeleton height={12} width="45%" />
      </div>
    </div>
  );
}

export function SkeletonPantryCard() {
  return (
    <div className="pantry-card" style={{ pointerEvents: "none", gap: 12, display: "flex", alignItems: "center" }}>
      <Skeleton width={44} height={44} radius={12} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <Skeleton height={14} width="55%" />
        <Skeleton height={12} width="40%" />
      </div>
    </div>
  );
}

export function SkeletonGroceryRow() {
  return (
    <div className="grocery-row" style={{ pointerEvents: "none" }}>
      <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--ps-line)", flexShrink: 0 }} />
      <Skeleton width={28} height={28} radius={8} style={{ flexShrink: 0 }} />
      <Skeleton height={14} width="40%" />
    </div>
  );
}
