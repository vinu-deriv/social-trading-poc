import Button from '@/components/input/Button';
import { upgradeToLeader } from '@/services/userService';
import './ProfileActions.css';

interface ProfileActionsProps {
  isOwnProfile: boolean;
  isFollowing: boolean;
  userType: string;
  userId: string;
  onFollow: () => Promise<void>;
  onUnfollow: () => Promise<void>;
  onUpgrade?: () => void;
}

const ProfileActions = ({
  isOwnProfile,
  isFollowing,
  userType,
  userId,
  onFollow,
  onUnfollow,
  onUpgrade,
}: ProfileActionsProps) => {
  const handleUpgrade = async () => {
    try {
      await upgradeToLeader(userId);
      onUpgrade?.();
    } catch (error) {
      console.error('Error upgrading to leader:', error);
      // Here you might want to show an error notification to the user
    }
  };

  return (
    <div className="profile-actions">
      {!isOwnProfile && (
        <Button
          onClick={isFollowing ? onUnfollow : onFollow}
          variant={isFollowing ? 'secondary' : 'primary'}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
      )}
      {isOwnProfile && userType === 'copier' && (
        <Button variant="secondary" onClick={handleUpgrade}>
          Upgrade to Leader
        </Button>
      )}
    </div>
  );
};

export default ProfileActions;
