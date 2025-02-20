import { FC, useEffect, useState } from 'react';
import UserCard from '../UserCard';
import SkeletonUserCard from '../SkeletonUserCard';
import { discoverService, Leader } from '@/modules/discover/services/discoverService';
import '../shared.css';

export const TopLeadersSection: FC = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopLeaders = async () => {
      try {
        setLoading(true);
        const data = await discoverService.getTopLeaders();
        setLeaders(data);
      } catch (error) {
        console.error('Error fetching top leaders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopLeaders();
  }, []);

  if (loading) {
    return (
      <>
        <div className="leaders-grid">
          {[...Array(3)].map((_, index) => (
            <SkeletonUserCard key={index} rank={index + 1} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="leaders-grid">
        {leaders.map((leader, index) => (
          <UserCard key={leader.id} user={leader} rank={index + 1} context="leaders" />
        ))}
      </div>
    </>
  );
};
