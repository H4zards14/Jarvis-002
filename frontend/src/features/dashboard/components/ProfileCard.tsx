interface ProfileCardProps {
  username: string;
}

function ProfileCard({ username }: ProfileCardProps) {
  return (
    <section className="profile-card">
      <div className="profile-art">
        <div className="profile-orbit orbit-one" />
        <div className="profile-orbit orbit-two" />
        <div className="profile-emblem">W</div>
      </div>

      <div className="profile-info">
        <span className="eyebrow">REGISTERED TENNO</span>
        <h3>{username.toUpperCase()}</h3>
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
  );
}

export default ProfileCard;
