import axiosInstance from "@/lib/api/axiosInstance";
import { AUTH_API_PREFIX } from "@/lib/constants";
import type { User } from "@/types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactElement,
} from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null,
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type IAuthContextProviderProps = {
  children: ReactElement;
};
export const AuthContextProvider = ({
  children,
}: IAuthContextProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get(`${AUTH_API_PREFIX}/me`);
        const authenticatedUser = await response.data?.user;
        setUser(authenticatedUser);
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
