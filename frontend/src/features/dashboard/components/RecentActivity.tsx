function RecentActivity() {
  return (
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
  );
}

export default RecentActivity;
