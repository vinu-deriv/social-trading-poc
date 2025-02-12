import { UserType } from "../types/user";

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    userType: UserType;
    isFirstLogin?: boolean;
  };
  token: string;
}

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await fetch("http://localhost:3001/users");
    const users = await response.json();

    // Mock authentication - in real app this would be a proper API call
    const user = users.find(
      (u: any) =>
        u.username === credentials.username &&
        credentials.password === "password"
    );

    if (!user) {
      throw new AuthError("Invalid username or password");
    }

    // Ensure user has required properties
    const userWithDefaults = {
      ...user,
      userType: user.userType || UserType.COPIER, // Default to copier if not set
      isFirstLogin: user.isFirstLogin ?? true, // Default to true if not set
    };

    // Mock token generation
    const token = btoa(
      JSON.stringify({ userId: userWithDefaults.id, timestamp: Date.now() })
    );

    // Store auth data
    const authData = { user: userWithDefaults, token };
    localStorage.setItem("auth", JSON.stringify(authData));

    return authData;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new Error("Authentication failed. Please try again later.");
  }
};

export const logout = (): void => {
  localStorage.removeItem("auth");
};

export const getStoredAuth = (): AuthResponse | null => {
  const authData = localStorage.getItem("auth");
  return authData ? JSON.parse(authData) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getStoredAuth();
};
