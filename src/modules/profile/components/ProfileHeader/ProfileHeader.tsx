import type User from '@/types/user.types';
import ProfileBasicInfo from './components/ProfileBasicInfo';
import ProfileStats from './components/ProfileStats';
import ProfilePerformance from './components/ProfilePerformance';
import ProfileTradingPreferences from './components/ProfileTradingPreferences';
import './ProfileHeader.css';

interface ProfileHeaderProps {
  profile: User;
  isOwnProfile: boolean;
  isFollowing: boolean;
  onFollow: () => Promise<void>;
  onUnfollow: () => Promise<void>;
}

const ProfileHeader = ({
  profile,
  isOwnProfile,
  isFollowing,
  onFollow,
  onUnfollow,
}: ProfileHeaderProps) => {
  const {
    username,
    profilePicture,
    userType,
    followers = [],
    following = [],
    strategies = [],
    displayName,
    tradingPreferences,
  } = profile;

  return (
    <div className="profile-header">
      <div className="profile-header__info">
        <ProfileBasicInfo
          username={username}
          displayName={displayName}
          profilePicture={profilePicture}
          userType={userType}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onFollow={onFollow}
          onUnfollow={onUnfollow}
        />
        <ProfileStats
          followers={followers}
          following={following}
          strategies={strategies}
          onFollowAction={onFollow}
        />
        {userType === 'leader' && profile.performance && (
          <ProfilePerformance performance={profile.performance} />
        )}
        {tradingPreferences && <ProfileTradingPreferences preferences={tradingPreferences} />}
      </div>
    </div>
  );
};

export default ProfileHeader;
