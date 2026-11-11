import { useState } from "react";
import InventoryPage from "./pages/InventoryPage";
import WarframesPage from "./pages/WarframesPage";
import ModsPage from "./pages/ModsPage";
import ResourcesPage from "./pages/ResourcesPage";
import WeaponsPage from "./pages/WeaponsPage";
import RelicsPage from "./pages/RelicsPage";
import { useAuth } from "./context/useAuth";
import "./App.css";

const navigation = [
  { name: "Command Center", icon: "⌂" },
  { name: "Inventory", icon: "▦" },
  { name: "Warframes", icon: "◈" },
  { name: "Mods", icon: "✧" },
  { name: "Weapons", icon: "⚔" },
  { name: "Relics", icon: "◇" },
  { name: "Resources", icon: "⬡" },
];

const stats = [
  { label: "PLATINUM", value: "1,250", icon: "◈", change: "+120 this week" },
  { label: "CREDITS", value: "2.4M", icon: "◉", change: "In-game balance" },
  { label: "ENDO", value: "18,500", icon: "✧", change: "Available balance" },
];

const collections = [
  { name: "Warframes", count: "12 / 59", percentage: 20, icon: "◈" },
  { name: "Primary Weapons", count: "18 / 120", percentage: 15, icon: "⌁" },
  { name: "Secondary Weapons", count: "9 / 85", percentage: 11, icon: "⚔" },
  { name: "Melee Weapons", count: "15 / 110", percentage: 14, icon: "⚒" },
];

function App() {
  const [activePage, setActivePage] = useState("Command Center");
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      setLoggingOut(true);
      setLogoutError("");
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutError("Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="app-shell">
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
              onClick={() => setActivePage(item.name)}
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

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>ORIGIN SYSTEM</span>
            <span className="breadcrumb-divider">/</span>
            <strong>{activePage.toUpperCase()}</strong>
          </div>

          <div className="topbar-right">
            <span className="platform-status">
              <span className="status-dot" />
              ALL SYSTEMS NORMAL
            </span>

            <div className="avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>

            <span className="operator-name">{user.username}</span>

            <button
              className="text-button"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? "LOGGING OUT..." : "LOG OUT"}
            </button>
          </div>
        </header>

        {logoutError && <div className="login-error">{logoutError}</div>}

        <div className="dashboard">
          <section className="welcome-section">
            <div>
              <div className="eyebrow">TENNO OPERATIONS DATABASE</div>
              <h2>
                {activePage === "Command Center"
                  ? "COMMAND CENTER"
                  : activePage.toUpperCase()}
              </h2>
              <p>
                Welcome back, {user.username}. Your journey through the Origin
                System continues.
              </p>
            </div>

            <div className="date-display">
              <span>OPERATOR STATUS</span>
              <strong>● ACTIVE</strong>
            </div>
          </section>

          {activePage === "Command Center" ? (
            <>
              <section className="profile-card">
                <div className="profile-art">
                  <div className="profile-orbit orbit-one" />
                  <div className="profile-orbit orbit-two" />
                  <div className="profile-emblem">W</div>
                </div>

                <div className="profile-info">
                  <span className="eyebrow">REGISTERED TENNO</span>
                  <h3>{user.username.toUpperCase()}</h3>
                  <p>Ready for the next mission.</p>
                  <div className="mastery">
                    <span>MASTERY RANK</span>
                    <strong>15</strong>
                    <span className="mastery-name">GOLDEN DISCIPLE</span>
                  </div>
                </div>

                <div className="profile-rank">
                  <span>PROFILE LEVEL</span>
                  <strong>15</strong>
                  <div className="rank-progress">
                    <div />
                  </div>
                  <small>75% TO NEXT RANK</small>
                </div>
              </section>

              <section className="stats-grid">
                {stats.map((stat) => (
                  <article className="stat-card" key={stat.label}>
                    <div className="stat-top">
                      <span>{stat.label}</span>
                      <span className="stat-icon">{stat.icon}</span>
                    </div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-description">{stat.change}</div>
                  </article>
                ))}
              </section>

              <div className="content-grid">
                <section className="panel collection-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">ARSENAL DATABASE</span>
                      <h3>COLLECTION OVERVIEW</h3>
                    </div>

                    <button
                      className="text-button"
                      onClick={() => setActivePage("Inventory")}
                    >
                      VIEW ALL →
                    </button>
                  </div>

                  <div className="collection-list">
                    {collections.map((item) => (
                      <div className="collection-item" key={item.name}>
                        <div className="collection-icon">{item.icon}</div>
                        <div className="collection-details">
                          <div className="collection-title">
                            <strong>{item.name}</strong>
                            <span>{item.count}</span>
                          </div>
                          <div className="progress-track">
                            <div style={{ width: `${item.percentage}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="panel activity-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">MISSION LOG</span>
                      <h3>RECENT ACTIVITY</h3>
                    </div>
                  </div>

                  <div className="activity-list">
                    <div className="activity-item">
                      <span className="activity-icon">◈</span>
                      <div>
                        <strong>Inventory initialized</strong>
                        <p>Command Center established</p>
                        <small>JUST NOW</small>
                      </div>
                    </div>

                    <div className="activity-item">
                      <span className="activity-icon">✧</span>
                      <div>
                        <strong>Database connected</strong>
                        <p>Local system operational</p>
                        <small>SYSTEM EVENT</small>
                      </div>
                    </div>

                    <div className="activity-item">
                      <span className="activity-icon">⌁</span>
                      <div>
                        <strong>Arsenal awaiting data</strong>
                        <p>Collection tracking pending</p>
                        <small>AWAITING INPUT</small>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <footer className="dashboard-footer">
                <span>WARFRAME COMPANION © 2026</span>
                <span>
                  INDEPENDENT FAN PROJECT · NOT AFFILIATED WITH DIGITAL EXTREMES
                </span>
              </footer>
            </>
          ) : activePage === "Inventory" ? (
            <InventoryPage />
          ) : activePage === "Warframes" ? (
            <WarframesPage />
          ) : activePage === "Mods" ? (
            <ModsPage />
          ) : activePage === "Weapons" ? (
            <WeaponsPage />
          ) : activePage === "Relics" ? (
            <RelicsPage />
          ) : activePage === "Resources" ? (
            <ResourcesPage />
          ) : (
            <section className="panel placeholder-panel">
              <div className="placeholder-symbol">◈</div>
              <span className="eyebrow">MODULE INITIALIZATION</span>
              <h3>{activePage.toUpperCase()}</h3>
              <p>
                This module is reserved for future development. Your command
                center is operational.
              </p>
              <button
                className="primary-button"
                onClick={() => setActivePage("Command Center")}
              >
                RETURN TO COMMAND CENTER
              </button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
