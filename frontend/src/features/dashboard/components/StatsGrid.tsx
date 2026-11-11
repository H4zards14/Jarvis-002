const stats = [
  { label: "PLATINUM", value: "1,250", icon: "◈", change: "+120 this week" },
  { label: "CREDITS", value: "2.4M", icon: "◉", change: "In-game balance" },
  { label: "ENDO", value: "18,500", icon: "✧", change: "Available balance" },
];

function StatsGrid() {
  return (
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
  );
}

export default StatsGrid;
