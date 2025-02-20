import type { SuggestedPerson } from '../types/people.types';

const LLM_SERVER_URL = import.meta.env.VITE_LLM_SERVER_URL;
if (!LLM_SERVER_URL) {
  throw new Error('VITE_LLM_SERVER_URL environment variable is not set');
}

interface PeopleSuggestionsResponse {
  suggestions: SuggestedPerson[];
  totalResults: number;
}

export async function fetchPeopleSuggestions(userId: string): Promise<PeopleSuggestionsResponse> {
  const response = await fetch(`${LLM_SERVER_URL}/api/people-suggestions/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch people suggestions');
  }
  return response.json();
}
