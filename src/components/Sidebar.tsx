import { NavLink } from "react-router-dom";
import { Icon } from "./Icon";
import { usePantry } from "@/lib/api/pantry";
import { useRecipes } from "@/lib/api/recipes";
import { useSaved } from "@/lib/api/saved";
import { useGrocery } from "@/lib/api/grocery";

export function Sidebar() {
  const { data: pantry  = [] } = usePantry();
  const { data: recipes = [] } = useRecipes();
  const { data: saved   = [] } = useSaved();
  const { data: grocery = [] } = useGrocery();

  const pantryCount  = pantry.length;
  const savedCount   = saved.length;
  const groceryCount = grocery.filter((g) => !g.checked).length;
  const recipesCount = recipes.length;

  const items = [
    { to: "/",         label: "Spin",        icon: "sparkles" },
    { to: "/pantry",   label: "Pantry",      icon: "package",       count: pantryCount },
    { to: "/recipes",  label: "Recipes",     icon: "book-open",     count: recipesCount },
    { to: "/saved",    label: "Saved",       icon: "heart",         count: savedCount },
    { to: "/grocery",  label: "Grocery",     icon: "shopping-cart", count: groceryCount },
    { to: "/prefs",    label: "Preferences", icon: "settings-2" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="wm ps-wordmark">Pantry<span className="spin">Spin</span></span>
      </div>

      <div className="nav-section-label">Menu</div>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
        >
          <Icon n={item.icon} className="nav-ic" />
          <span>{item.label}</span>
          {typeof item.count === "number" && item.count > 0 && (
            <span className="count">{item.count}</span>
          )}
        </NavLink>
      ))}

      <div className="sidebar-foot">
        <div className="av"></div>
        <div>
          <div className="name">My Kitchen</div>
          <div className="sub">Free plan</div>
        </div>
      </div>
    </aside>
  );
}
