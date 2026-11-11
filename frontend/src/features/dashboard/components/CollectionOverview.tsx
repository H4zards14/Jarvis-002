interface CollectionOverviewProps {
  onViewAll: () => void;
}

const collections = [
  { name: "Warframes", count: "12 / 59", percentage: 20, icon: "◈" },
  { name: "Primary Weapons", count: "18 / 120", percentage: 15, icon: "⌁" },
  { name: "Secondary Weapons", count: "9 / 85", percentage: 11, icon: "⚔" },
  { name: "Melee Weapons", count: "15 / 110", percentage: 14, icon: "⚒" },
];

function CollectionOverview({ onViewAll }: CollectionOverviewProps) {
  return (
    <section className="panel collection-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">ARSENAL DATABASE</span>
          <h3>COLLECTION OVERVIEW</h3>
        </div>

        <button className="text-button" onClick={onViewAll}>
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
  );
}

export default CollectionOverview;
