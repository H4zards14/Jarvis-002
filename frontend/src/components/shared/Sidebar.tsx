interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navigation = [
  { name: "Command Center", icon: "⌂" },
  { name: "Inventory", icon: "▦" },
  { name: "Warframes", icon: "◈" },
  { name: "Mods", icon: "✧" },
  { name: "Weapons", icon: "⚔" },
  { name: "Relics", icon: "◇" },
  { name: "Resources", icon: "⬡" },
];

function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-symbol">W</div>
        <div>
          <h1>WARFRAME</h1>
          <span>COMPANION</span>
        </div>
      </div>

      <div className="nav-label">MAIN MENU</div>

      <nav className="navigation">
        {navigation.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${activePage === item.name ? "active" : ""}`}
            onClick={() => onNavigate(item.name)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.name}</span>
            {activePage === item.name && <span className="nav-indicator" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="connection">
          <span className="status-dot" />
          SYSTEM ONLINE
        </div>

        <div className="sidebar-version">JARVIS-002 · v0.1.0</div>
      </div>
    </aside>
  );
}

export default Sidebar;
