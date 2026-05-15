/* Sidebar.jsx — left nav with brand + sections */

const Sidebar = ({ active, onNav, savedCount, groceryCount, pantryCount, recipesCount }) => {

  const items = [
    { key: "spin",   label: "Spin",        icon: "sparkles" },
    { key: "pantry", label: "Pantry",      icon: "package",  count: pantryCount },
    { key: "recipes",label: "Recipes",     icon: "book-open", count: recipesCount },
    { key: "saved",  label: "Saved",       icon: "heart",    count: savedCount },
    { key: "grocery",label: "Grocery",     icon: "shopping-cart", count: groceryCount },
    { key: "prefs",  label: "Preferences", icon: "settings-2" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src="assets/pantryspin-mark.png" alt="" />
        <span className="wm">Pantry<span className="spin">Spin</span></span>
      </div>

      <div className="nav-section-label">Menu</div>
      {items.map((item) => (
        <button
          key={item.key}
          className={"nav-item" + (active === item.key ? " active" : "")}
          onClick={() => onNav(item.key)}
        >
          <Icon n={item.icon} className="nav-ic" />
          <span>{item.label}</span>
          {typeof item.count === "number" && item.count > 0 && (
            <span className="count">{item.count}</span>
          )}
        </button>
      ))}

      <div className="sidebar-foot">
        <div className="av"></div>
        <div>
          <div className="name">Maya</div>
          <div className="sub">Free plan</div>
        </div>
      </div>
    </aside>
  );
};

window.Sidebar = Sidebar;
