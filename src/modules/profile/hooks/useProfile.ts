import { useState, useEffect } from 'react';
import type User from '@/types/user.types';
import type Post from '@/types/post.types';
import {
  getUserByUsername,
  getUserPosts,
  followUser,
  unfollowUser,
} from '../services/profileService';
import { getStatistics } from '@/services/statisticsService';
import { useAuth } from '@/context/AuthContext';

interface UseProfileResult {
  profile: User | null;
  posts: Post[];
  isOwnProfile: boolean;
  isFollowing: boolean;
  loading: boolean;
  error: string | null;
  handleFollow: () => Promise<void>;
  handleUnfollow: () => Promise<void>;
  handleProfileUpdate: (updatedProfile: User) => void;
  refetch: () => Promise<void>;
}

export const useProfile = (username: string): UseProfileResult => {
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = profile?.id === currentUser?.id;
  const isFollowing = currentUser?.following?.includes(profile?.id || '') ?? false;

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await getUserByUsername(username);

      // If user is a leader, fetch their statistics
      if (profileData.userType === 'leader') {
        const statistics = await getStatistics(profileData.id, profileData.userType);
        const totalStats = statistics.reduce(
          (acc, curr) => ({
            totalPnL: acc.totalPnL + curr.data.totalPnL,
            winRate: acc.winRate + curr.data.winRate,
            totalTrades: acc.totalTrades + (curr.data.strategyCount || 0),
          }),
          { totalPnL: 0, winRate: 0, totalTrades: 0 }
        );

        // Calculate average win rate
        const avgWinRate = totalStats.winRate / statistics.length;

        // Update profile with calculated performance
        profileData.performance = {
          winRate: avgWinRate,
          totalPnL: totalStats.totalPnL,
          monthlyReturn: avgWinRate, // Using win rate as monthly return for now
          totalTrades: totalStats.totalTrades,
        };
      }

      setProfile(profileData);

      const userPosts = await getUserPosts(profileData.id);
      setPosts(userPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProfile(null);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  const handleFollow = async () => {
    if (!profile || !currentUser) return;
    try {
      await followUser(profile.id, currentUser.id);
      fetchProfile();
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  const handleUnfollow = async () => {
    if (!profile || !currentUser) return;
    try {
      await unfollowUser(profile.id, currentUser.id);
      fetchProfile();
    } catch (err) {
      console.error('Error unfollowing user:', err);
    }
  };

  const handleProfileUpdate = (updatedProfile: User) => {
    setProfile(updatedProfile);
    if (isOwnProfile) {
      if (updateUser) {
        updateUser(updatedProfile);
        return;
      }
    }
    fetchProfile();
  };

  return {
    profile,
    posts,
    isOwnProfile,
    isFollowing,
    loading,
    error,
    handleFollow,
    handleUnfollow,
    handleProfileUpdate,
    refetch: fetchProfile,
  };
};
