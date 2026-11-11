import WelcomeSection from "../components/WelcomeSection";
import ProfileCard from "../components/ProfileCard";
import StatsGrid from "../components/StatsGrid";
import CollectionOverview from "../components/CollectionOverview";
import RecentActivity from "../components/RecentActivity";

interface DashboardPageProps {
  activePage: string;
  username: string;
  onViewAll: () => void;
}

function DashboardPage({
  activePage,
  username,
  onViewAll,
}: DashboardPageProps) {
  return (
    <>
      <WelcomeSection activePage={activePage} username={username} />

      <ProfileCard username={username} />

      <StatsGrid />

      <div className="content-grid">
        <CollectionOverview onViewAll={onViewAll} />
        <RecentActivity />
      </div>

      <footer className="dashboard-footer">
        <span>WARFRAME COMPANION © 2026</span>
        <span>
          INDEPENDENT FAN PROJECT · NOT AFFILIATED WITH DIGITAL EXTREMES
        </span>
      </footer>
    </>
  );
}

export default DashboardPage;
