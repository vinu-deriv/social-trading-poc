import type { ExtendedUser } from '@/pages/discover/components/UserCard/UserCard';

export interface SuggestedPerson extends ExtendedUser {
  matchScore: number; // AI suggestion confidence score
  matchReason: string; // Why this person is suggested
}
