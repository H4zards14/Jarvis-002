import { useState } from "react";
import { useAuth } from "./context/useAuth";

import InventoryPage from "./features/inventory/pages/InventoryPage";
import ModsPage from "./features/mods/pages/ModsPage";
import RelicsPage from "./features/relics/pages/RelicsPage";
import ResourcesPage from "./features/resources/pages/ResourcesPage";
import WarframesPage from "./features/warframes/pages/WarframesPage";
import WeaponsPage from "./features/weapons/pages/WeaponsPage";

import DashboardPage from "./features/dashboard/pages/DashboardPage";
import WelcomeSection from "./features/dashboard/components/WelcomeSection";

import Sidebar from "./components/shared/Sidebar";
import Topbar from "./components/shared/Topbar";

import "./App.css";

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
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <main className="main-content">
        <Topbar
          activePage={activePage}
          username={user.username}
          loggingOut={loggingOut}
          onLogout={handleLogout}
        />

        {logoutError && <div className="login-error">{logoutError}</div>}

        <div className="dashboard">
          {activePage === "Command Center" ? (
            <DashboardPage
              activePage={activePage}
              username={user.username}
              onViewAll={() => setActivePage("Inventory")}
            />
          ) : (
            <>
              <WelcomeSection
                activePage={activePage}
                username={user.username}
              />

              {activePage === "Inventory" ? (
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
