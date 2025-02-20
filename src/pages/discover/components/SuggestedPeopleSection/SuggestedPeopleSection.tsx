import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import UserCard from '../UserCard';
import SkeletonUserCard from '../SkeletonUserCard';
import ErrorState from '@/components/feedback/ErrorState';
import { fetchPeopleSuggestions } from '@/services/peopleSuggestionsService';
import type { SuggestedPerson } from '@/types/people.types';

export default function SuggestedPeopleSection() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<SuggestedPerson[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const { suggestions: peopleSuggestions } = await fetchPeopleSuggestions(user.id);
        setSuggestions(peopleSuggestions);
        setError(null);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch suggestions');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [user?.id]);

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <>
      <div className="users-grid">
        {loading ? (
          [...Array(6)].map((_, index) => <SkeletonUserCard key={index} />)
        ) : suggestions.length === 0 ? (
          <ErrorState message="No suggestions found" />
        ) : (
          suggestions.map(suggestion => (
            <UserCard key={suggestion.id} user={suggestion} context="people" />
          ))
        )}
      </div>
    </>
  );
}
