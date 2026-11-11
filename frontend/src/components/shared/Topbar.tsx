interface TopbarProps {
  activePage: string;
  username: string;
  loggingOut: boolean;
  onLogout: () => void;
}

function Topbar({ activePage, username, loggingOut, onLogout }: TopbarProps) {
  return (
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

        <div className="avatar">{username.charAt(0).toUpperCase()}</div>

        <span className="operator-name">{username}</span>

        <button
          className="text-button"
          onClick={onLogout}
          disabled={loggingOut}
        >
          {loggingOut ? "LOGGING OUT..." : "LOG OUT"}
        </button>
      </div>
    </header>
  );
}

export default Topbar;
