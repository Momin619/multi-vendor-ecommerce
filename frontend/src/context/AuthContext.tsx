import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getMe,
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
} from "../api/auth.api";

import type {
  LoginData,
  RegisterData,
} from "../types/auth.types";

import type {
  User,
} from "../types/user.types";

import {
  setSessionExpiredHandler,
  clearSessionExpiredHandler,
} from "../auth/session";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<User>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext =
  createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  /**
   * Starts true because on first load we don't yet know
   * whether the browser has a valid session cookie or not.
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * On app start, ask the backend "who am I?".
   * The browser automatically attaches the accessToken cookie.
   *
   * - If it's valid → backend returns the user.
   * - If it's expired → backend returns 401 → the axios
   *   interceptor (axios.ts) automatically calls /auth/refresh
   *   and retries this request for us. We don't do anything
   *   special here for that case.
   * - If the refresh also fails (refresh cookie missing/expired)
   *   → this call finally fails → we treat the user as logged out.
   */
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const response = await getMe();
        if (isMounted) {
          setUser(response.data.user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

useEffect(() => {
  const handleSessionExpired = () => {
    setUser(null);
  };

  setSessionExpiredHandler(handleSessionExpired);

  return () => {
    clearSessionExpiredHandler();
  };
}, []);

 const login = async (data: LoginData): Promise<User> => {
  const response = await loginApi(data);

  const loggedInUser = response.data.user;

  setUser(loggedInUser);

  return loggedInUser;
};

  const register = async (data: RegisterData): Promise<void> => {
    // Backend creates the user and sets both cookies.
   await registerApi(data);
  };
  
  const logout = async (): Promise<void> => {
    try {
      await logoutApi(); // backend clears both cookies
    } finally {
      setUser(null); // always clear local state too
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};