import { useParams } from 'react-router-dom';
import { useProfile } from '@/modules/profile/hooks/useProfile';
import ProfileHeader from '../../modules/profile/components/ProfileHeader';
import FeedList from '@/modules/feed/components/FeedList';
import Loader from '@/components/layout/Loader';
import ErrorState from '@/components/feedback/ErrorState';
import './Profile.css';

const Profile = () => {
  const { username = '' } = useParams();
  const {
    profile,
    isOwnProfile,
    isFollowing,
    loading,
    error,
    handleFollow,
    handleUnfollow,
    refetch,
  } = useProfile(username);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-page__loading">
          <Loader />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-page">
        <ErrorState message={error || 'Failed to load profile'} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
      />
      <div className="profile-page__content">
        <div className="profile-page__feed">
          <FeedList currentUserId={profile.id} activeTab="profile" />
        </div>
      </div>
    </div>
  );
};

export default Profile;
