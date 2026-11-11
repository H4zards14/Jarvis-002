import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getCurrentUser, logout as logoutApi } from "../services/authApi";
import type { AuthUser } from "../services/authApi";
import LoginPage from "../features/auth/pages/LoginPage";
import { InventoryProvider } from "../features/inventory/context/InventoryContext";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch((err: unknown) => {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to connect to the authentication server.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await logoutApi();
    setUser(null);
  }

  if (loading) {
    return <div className="login-page">CHECKING OPERATOR ACCESS...</div>;
  }

  if (error) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>CONNECTION ERROR</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            RETRY CONNECTION
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <AuthContext.Provider value={{ user, logout: handleLogout }}>
      <InventoryProvider>{children}</InventoryProvider>
    </AuthContext.Provider>
  );
}
