import { useState } from "react";
import { login } from "../../../services/authApi";
import type { AuthUser } from "../../../services/authApi";
import "./LoginPage.css";

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login(username, password);
      onLogin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to log in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-symbol">W</div>

        <div className="login-eyebrow">TENNO OPERATIONS DATABASE</div>

        <h1>JARVIS-002</h1>
        <p className="login-subtitle">PRIVATE COMMAND ACCESS</p>

        <div className="login-divider" />

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">OPERATOR USERNAME</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter your username"
            autoComplete="username"
            required
          />

          <label htmlFor="password">ACCESS PASSWORD</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          {error && <div className="login-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "AUTHENTICATING..." : "LOGIN"}
          </button>
        </form>

        <div className="login-footer">AUTHORIZED OPERATOR ACCESS ONLY</div>
      </div>
    </div>
  );
}

export default LoginPage;
