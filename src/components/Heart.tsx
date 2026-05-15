interface HeartProps {
  saved: boolean;
  size?: number;
  onClick?: (e: React.MouseEvent) => void;
}

export function Heart({ saved, size = 16, onClick }: HeartProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={saved ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      style={{ cursor: "pointer" }}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5L12 21z" />
    </svg>
  );
}
