import { UserType } from '../types/user';

interface RawUser {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  userType?: UserType;
  isFirstLogin?: boolean;
  tradingPreferences?: {
    riskTolerance: 'medium' | 'low' | 'high';
    investmentStyle: 'moderate' | 'conservative' | 'aggressive';
    preferredMarkets: string[];
    preferredTradeTypes: string[];
    tradingFrequency: string;
    maxDrawdown: number;
    targetReturn: number;
    minStake: number;
    maxStake: number;
  };
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    displayName: string;
    userType: UserType;
    isFirstLogin?: boolean;
    tradingPreferences?: {
      riskTolerance: 'medium' | 'low' | 'high';
      investmentStyle: 'moderate' | 'conservative' | 'aggressive';
      preferredMarkets: string[];
      preferredTradeTypes: string[];
      tradingFrequency: 'weekly' | 'monthly' | 'daily';
      maxDrawdown: number;
      targetReturn: number;
      minStake: number;
      maxStake: number;
    };
  };
  token: string;
}

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_JSON_SERVER_URL}/users`);
    const users = await response.json();

    // Mock authentication - in real app this would be a proper API call
    const user = users.find(
      (u: RawUser) => u.username === credentials.username && credentials.password === 'password'
    );

    if (!user) {
      throw new AuthError('Invalid username or password');
    }

    // Ensure user has required properties
    const userWithDefaults = {
      ...user,
      userType: user.userType || UserType.COPIER, // Default to copier if not set
      isFirstLogin: user.isFirstLogin ?? true, // Default to true if not set
      displayName: user.displayName || user.username, // Default to username if displayName not set
      tradingPreferences: user.tradingPreferences || {
        riskTolerance: 'medium',
        investmentStyle: 'moderate',
        preferredMarkets: [],
        preferredTradeTypes: [],
        tradingFrequency: 'weekly',
        maxDrawdown: 20,
        targetReturn: 15,
        minStake: 10,
        maxStake: 100,
      },
    };

    // Mock token generation
    const token = btoa(JSON.stringify({ userId: userWithDefaults.id, timestamp: Date.now() }));

    // Store auth data
    const authData = { user: userWithDefaults, token };
    localStorage.setItem('auth', JSON.stringify(authData));

    return authData;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new Error('Authentication failed. Please try again later.');
  }
};

export const logout = (): void => {
  localStorage.removeItem('auth');
};

export const getStoredAuth = (): AuthResponse | null => {
  const authData = localStorage.getItem('auth');
  return authData ? JSON.parse(authData) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getStoredAuth();
};
