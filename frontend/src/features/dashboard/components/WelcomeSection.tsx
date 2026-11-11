interface WelcomeSectionProps {
  activePage: string;
  username: string;
}

function WelcomeSection({ activePage, username }: WelcomeSectionProps) {
  return (
    <section className="welcome-section">
      <div>
        <div className="eyebrow">TENNO OPERATIONS DATABASE</div>
        <h2>
          {activePage === "Command Center"
            ? "COMMAND CENTER"
            : activePage.toUpperCase()}
        </h2>
        <p>
          Welcome back, {username}. Your journey through the Origin System
          continues.
        </p>
      </div>

      <div className="date-display">
        <span>OPERATOR STATUS</span>
        <strong>● ACTIVE</strong>
      </div>
    </section>
  );
}

export default WelcomeSection;
