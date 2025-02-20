import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import UserCard from '../UserCard';
import SkeletonUserCard from '../SkeletonUserCard';
import ErrorState from '@/components/feedback/ErrorState';
import type User from '@/types/user.types';
import type { ExtendedUser } from '../UserCard/UserCard';

const JSON_SERVER_URL = import.meta.env.VITE_JSON_SERVER_URL;
if (!JSON_SERVER_URL) {
  throw new Error('VITE_JSON_SERVER_URL environment variable is not set');
}

export default function AllPeopleSection() {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${JSON_SERVER_URL}/users`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        // Filter out current user and process user data
        const filteredUsers: ExtendedUser[] = data
          .filter((u: User) => u.id !== currentUser?.id)
          .map((user: User) => ({
            ...user,
            copiers: user.followers?.length || 0,
            totalProfit: user.performance?.totalPnL || 0,
            winRate: user.performance?.winRate || 0,
            isFollowing: currentUser?.following?.includes(user.id) || false,
            matchScore: undefined,
            matchReason: undefined,
          }));
        setUsers(filteredUsers);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser?.id, currentUser?.following]);

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <>
      <div className="users-grid">
        {loading ? (
          [...Array(6)].map((_, index) => <SkeletonUserCard key={index} />)
        ) : users.length === 0 ? (
          <ErrorState message="No users found" />
        ) : (
          users.map(user => <UserCard key={user.id} user={user} context="people" />)
        )}
      </div>
    </>
  );
}
