import { WHEEL_CATEGORIES } from "@/data/recipes";
import { ingredientIcon } from "@/data/ingredients";

interface WheelProps {
  rotation: number;
  spinning: boolean;
}

export function Wheel({ rotation, spinning }: WheelProps) {
  const cats = WHEEL_CATEGORIES;
  const N = cats.length;
  const slice = 360 / N;
  const R = 200;
  const r0 = 30;

  const wedgePath = (i: number) => {
    const start = -90 + i * slice - slice / 2;
    const end = start + slice;
    const a1 = (start * Math.PI) / 180;
    const a2 = (end * Math.PI) / 180;
    const x1 = R + R * Math.cos(a1);
    const y1 = R + R * Math.sin(a1);
    const x2 = R + R * Math.cos(a2);
    const y2 = R + R * Math.sin(a2);
    const xi1 = R + r0 * Math.cos(a1);
    const yi1 = R + r0 * Math.sin(a1);
    const xi2 = R + r0 * Math.cos(a2);
    const yi2 = R + r0 * Math.sin(a2);
    return `M ${xi1} ${yi1} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} L ${xi2} ${yi2} A ${r0} ${r0} 0 0 0 ${xi1} ${yi1} Z`;
  };

  const iconPos = (i: number) => {
    const mid = -90 + i * slice;
    const a = (mid * Math.PI) / 180;
    const rr = R * 0.65;
    return { x: R + rr * Math.cos(a), y: R + rr * Math.sin(a) };
  };

  const labelPos = (i: number) => {
    const mid = -90 + i * slice;
    const a = (mid * Math.PI) / 180;
    const rr = R * 0.42;
    let rotate = mid + 90;
    const normalized = ((rotate % 360) + 360) % 360;
    if (normalized > 90 && normalized < 270) rotate += 180;
    return { x: R + rr * Math.cos(a), y: R + rr * Math.sin(a), rotate };
  };

  const iconColor = "#FFF7E8";

  return (
    <svg
      viewBox={`0 0 ${R * 2} ${R * 2}`}
      className="wheel-svg"
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: spinning ? "transform 2400ms cubic-bezier(0.18, 0.85, 0.25, 1.0)" : "none",
      }}
    >
      <circle cx={R} cy={R} r={R} fill="#2D2A26" />
      <circle cx={R} cy={R} r={R - 6} fill="#FFF7E8" />

      {cats.map((c, i) => {
        const pos = iconPos(i);
        const lpos = labelPos(i);
        const iconSvgInner = ingredientIcon(c.iconName).match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1] ?? "";
        return (
          <g key={c.key}>
            <path d={wedgePath(i)} fill={c.color} stroke="#FFF7E8" strokeWidth="2.5" />
            <text
              x={lpos.x}
              y={lpos.y}
              fill={iconColor}
              fontSize="13"
              fontFamily="Fraunces, serif"
              fontWeight="700"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${lpos.rotate} ${lpos.x} ${lpos.y})`}
              style={{ letterSpacing: "-0.01em" }}
            >
              {c.label}
            </text>
            <g
              transform={`translate(${pos.x - 18}, ${pos.y - 18}) rotate(${-rotation} 18 18)`}
              style={{ color: iconColor }}
              dangerouslySetInnerHTML={{
                __html: `<svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">${iconSvgInner}</svg>`,
              }}
            />
          </g>
        );
      })}

      <circle cx={R} cy={R} r={r0 + 4} fill="#FFF7E8" />
      <circle cx={R} cy={R} r={r0} fill="#2D2A26" />
      <circle cx={R} cy={R} r={r0 - 12} fill="#FFF7E8" />

      {cats.map((_, i) => {
        const a = ((-90 + i * slice - slice / 2) * Math.PI) / 180;
        const rr = R - 14;
        return <circle key={`d${i}`} cx={R + rr * Math.cos(a)} cy={R + rr * Math.sin(a)} r="3" fill="#FFF7E8" />;
      })}
    </svg>
  );
}

interface WheelPointerProps {
  bobbing?: boolean;
}

export function WheelPointer({ bobbing }: WheelPointerProps) {
  return (
    <svg
      width="48"
      height="56"
      viewBox="0 0 48 56"
      className={"wheel-pointer" + (bobbing ? " bobbing" : "")}
    >
      <defs>
        <filter id="forkshadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="rgba(0,0,0,0.3)" />
        </filter>
      </defs>
      <g fill="#2D2A26" filter="url(#forkshadow)">
        <rect x="9" y="2" width="4" height="22" rx="2" />
        <rect x="17" y="2" width="4" height="22" rx="2" />
        <rect x="25" y="2" width="4" height="22" rx="2" />
        <rect x="33" y="2" width="4" height="22" rx="2" />
        <path d="M7 20 L39 20 L36 28 L10 28 Z" />
        <rect x="18" y="26" width="10" height="20" rx="3" />
        <path d="M16 44 L30 44 L23 56 Z" />
      </g>
    </svg>
  );
}
