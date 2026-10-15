// components/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User } from "@/types/auth";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/authService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Storage Purge Helper
  const purgeStorage = useCallback(() => {
    localStorage.removeItem("fb_auth_user");
    localStorage.removeItem("fb_auth_token");
    sessionStorage.clear();
  }, []);

  // 1. Multi-Tab Logout Sync (अरू कुनै ट्याबमा लगआउट भए तुरुन्तै यो ट्याब पनि लगआउट हुने)
  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === "fb_auth_token" && !event.newValue) {
        setUser(null);
        setToken(null);
        router.refresh();
        router.replace("/");
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, [router]);

  // 2. Check initial local session
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("fb_auth_user");
      const storedToken = localStorage.getItem("fb_auth_token");
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Session load error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const login = async (email: string, pass: string) => {
    const res = await authService.login(email, pass);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem("fb_auth_user", JSON.stringify(res.user));
    localStorage.setItem("fb_auth_token", res.token);
  };

  const register = async (data: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) => {
    const res = await authService.register(data);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem("fb_auth_user", JSON.stringify(res.user));
    localStorage.setItem("fb_auth_token", res.token);
  };

  // 3. Senior-Grade Robust Logout
  const logout = useCallback(async () => {
    try {
      // Backend session invalidation कल (यदि authService मा छ भने)
      if (authService.logout) {
        await authService.logout(token);
      }
    } catch (err) {
      console.warn("Backend logout silent error:", err);
    } finally {
      // Client state reset
      setUser(null);
      setToken(null);
      purgeStorage();

      // Clear Next.js cache and redirect to login
      router.refresh();
      router.replace("/");
    }
  }, [token, purgeStorage, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
