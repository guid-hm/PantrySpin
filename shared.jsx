/* shared.jsx — small components used everywhere */

// React-friendly Lucide icon. Renders an <i data-lucide> inside a stable wrapper span,
// then lets lucide.createIcons() do its DOM-replacement trick. Since the span is the
// React-managed node and the <i>/svg lives inside it, React never gets confused.
const Icon = ({ n, size, sw, color, style, className }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.lucide || !n) return;
    const w = (style && style.width) || size || 16;
    const h = (style && style.height) || size || 16;
    const strokeWidth = sw || (style && style.strokeWidth) || 2;
    // Always rebuild — cheap, and survives React updates.
    ref.current.innerHTML = `<i data-lucide="${n}" style="width:${w}px;height:${h}px;stroke-width:${strokeWidth};"></i>`;
    try {
      window.lucide.createIcons({ icons: window.lucide.icons, attrs: { "stroke-width": strokeWidth } });
    } catch (e) {
      // Fallback: just createIcons with defaults
      try { window.lucide.createIcons(); } catch (e2) {}
    }
  });
  const wrapStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 0,
    color: color || (style && style.color) || "currentColor",
    flex: style && style.flex,
    width: (style && style.width) || size,
    height: (style && style.height) || size,
    ...((style || {})),
  };
  return <span ref={ref} className={className} style={wrapStyle} />;
};

const IngIcon = ({ name, size = 22 }) => {
  const data = window.ingData(name) || { color: "#8A857D", swatch: "#E7DEC8" };
  return (
    <span
      className="chip-ico"
      style={{
        width: size, height: size, flex: `0 0 ${size}px`,
        background: data.swatch,
        color: data.color,
      }}
      dangerouslySetInnerHTML={{ __html: window.ingredientIcon(name) }}
    />
  );
};

const RecipeThumb = ({ illusKey, size = 60, radius = 12 }) => {
  return (
    <div
      className="thumb"
      style={{
        width: size, height: size, flex: `0 0 ${size}px`,
        borderRadius: radius,
        background: window.thumbStyle(illusKey),
      }}
      dangerouslySetInnerHTML={{ __html: window.recipeIllustration(illusKey) }}
    />
  );
};

const RecipeIllusFull = ({ illusKey, height = 320, radius = 20 }) => {
  return (
    <div
      style={{
        width: "100%", height,
        borderRadius: radius,
        overflow: "hidden",
        background: window.thumbStyle(illusKey),
      }}
      dangerouslySetInnerHTML={{ __html: window.recipeIllustration(illusKey) }}
    />
  );
};

const Heart = ({ saved, size = 16, onClick }) => {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill={saved ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={(e) => { e.stopPropagation(); if (onClick) onClick(e); }}
      style={{ cursor: "pointer" }}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5L12 21z"/>
    </svg>
  );
};

// Compute match score for recipe given pantry
function matchScore(recipe, pantry) {
  const pantrySet = new Set(pantry);
  const have = recipe.needs.filter((n) => pantrySet.has(n));
  const need = recipe.needs.filter((n) => !pantrySet.has(n));
  const pct = recipe.needs.length ? Math.round((have.length / recipe.needs.length) * 100) : 0;
  return { have, need, pct };
}

// Toast helper using window-attached state
function useToast() {
  const [msg, setMsg] = React.useState(null);
  const timerRef = React.useRef();
  const show = (text) => {
    setMsg(text);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMsg(null), 2400);
  };
  const el = msg ? <div className="toast"><Icon n="check-circle-2" className="basil" style={{ width: 16, height: 16 }} />{msg}</div> : null;
  return [el, show];
}

window.Icon = Icon;
window.IngIcon = IngIcon;
window.RecipeThumb = RecipeThumb;
window.RecipeIllusFull = RecipeIllusFull;
window.Heart = Heart;
window.matchScore = matchScore;
window.useToast = useToast;
