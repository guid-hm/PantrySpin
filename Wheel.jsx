/* Wheel.jsx — SVG roulette wheel + spin logic */

const Wheel = ({ rotation, spinning }) => {
  const cats = window.WHEEL_CATEGORIES;
  const N = cats.length;
  const slice = 360 / N;
  const R = 200;     // outer radius
  const r0 = 30;     // inner hub radius

  // For each wedge, build SVG arc path
  const wedgePath = (i) => {
    const start = -90 + i * slice - slice / 2; // wedge centered at top initially
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

  // Icon position (centered in wedge, ~70% radius)
  const iconPos = (i) => {
    const mid = -90 + i * slice;
    const a = (mid * Math.PI) / 180;
    const rr = R * 0.65;
    return { x: R + rr * Math.cos(a), y: R + rr * Math.sin(a) };
  };

  // Label position closer to inner hub. Flip text on the bottom half so it's readable.
  const labelPos = (i) => {
    const mid = -90 + i * slice;
    const a = (mid * Math.PI) / 180;
    const rr = R * 0.42;
    // Bottom half: rotate so text reads right-side-up from the wedge's pov
    let rotate = mid + 90;
    // Normalize so labels in bottom half are flipped
    const normalized = ((rotate % 360) + 360) % 360;
    if (normalized > 90 && normalized < 270) rotate += 180;
    return { x: R + rr * Math.cos(a), y: R + rr * Math.sin(a), rotate };
  };

  return (
    <svg viewBox={`0 0 ${R * 2} ${R * 2}`} className="wheel-svg" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 2400ms cubic-bezier(0.18, 0.85, 0.25, 1.0)" : "none" }}>
      {/* outer ring */}
      <circle cx={R} cy={R} r={R} fill="#2D2A26" />
      <circle cx={R} cy={R} r={R - 6} fill="#FFF7E8" />

      {/* wedges */}
      {cats.map((c, i) => {
        const pos = iconPos(i);
        const lpos = labelPos(i);
        const iconColor = "#FFF7E8";
        return (
          <g key={c.key}>
            <path d={wedgePath(i)} fill={c.color} stroke="#FFF7E8" strokeWidth="2.5" />
            {/* category label, curved-ish via rotation */}
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
            {/* icon */}
            <g
              transform={`translate(${pos.x - 18}, ${pos.y - 18}) rotate(${-rotation} 18 18)`}
              style={{ color: iconColor }}
              dangerouslySetInnerHTML={{
                __html: `<svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">${window.ingredientIcon(c.iconName).match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1]}</svg>`,
              }}
            />
          </g>
        );
      })}

      {/* inner hub border */}
      <circle cx={R} cy={R} r={r0 + 4} fill="#FFF7E8" />
      <circle cx={R} cy={R} r={r0} fill="#2D2A26" />
      <circle cx={R} cy={R} r={r0 - 12} fill="#FFF7E8" />

      {/* subtle dot decorations between wedges */}
      {cats.map((c, i) => {
        const a = ((-90 + i * slice - slice / 2) * Math.PI) / 180;
        const rr = R - 14;
        const x = R + rr * Math.cos(a);
        const y = R + rr * Math.sin(a);
        return <circle key={`d${i}`} cx={x} cy={y} r="3" fill="#FFF7E8" />;
      })}
    </svg>
  );
};

// Pointer (fork-shaped) drawn separately, fixed at top
const WheelPointer = ({ bobbing }) => {
  return (
    <svg width="48" height="56" viewBox="0 0 48 56" className={"wheel-pointer" + (bobbing ? " bobbing" : "")}>
      <defs>
        <filter id="forkshadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <g fill="#2D2A26" filter="url(#forkshadow)">
        {/* fork tines */}
        <rect x="9" y="2" width="4" height="22" rx="2"/>
        <rect x="17" y="2" width="4" height="22" rx="2"/>
        <rect x="25" y="2" width="4" height="22" rx="2"/>
        <rect x="33" y="2" width="4" height="22" rx="2"/>
        {/* shoulders */}
        <path d="M7 20 L39 20 L36 28 L10 28 Z"/>
        {/* handle/stem */}
        <rect x="18" y="26" width="10" height="20" rx="3"/>
        {/* tip — points DOWN toward wheel */}
        <path d="M16 44 L30 44 L23 56 Z"/>
      </g>
    </svg>
  );
};

window.Wheel = Wheel;
window.WheelPointer = WheelPointer;
