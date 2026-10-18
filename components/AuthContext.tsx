// components/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { User } from "@/types/auth";
import { authService } from "@/lib/authService";
import { INITIAL_MOCK_USERS } from "@/lib/mockData";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (emailOrUsername: string, pass: string) => Promise<void>;
  register: (data: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: (options?: { reason?: string }) => Promise<void>;
  switchUser: (userIdOrUsername: string) => Promise<void>;
  updateUser: (partial: Partial<User>) => void;
  mockUsers: User[];
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cross-tab broadcast channel
const AUTH_CHANNEL_NAME = "fb_auth_channel";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  /**
   * Dynamic Public Mock Users:
   * Sanitizes INITIAL_MOCK_USERS from lib/mockData.ts (removes password and token)
   * so components can render dynamic account switchers or test chips.
   */
  const mockUsers: User[] = useMemo(() => {
    return INITIAL_MOCK_USERS.map((userRecord) => {
      const { password: _pwd, token: _tok, ...cleanUser } = userRecord;
      void _pwd;
      void _tok;
      return cleanUser;
    });
  }, []);

  /**
   * Helper: Wipe credentials from storage and cookies
   */
  const obliterateSessionData = useCallback(() => {
    try {
      localStorage.removeItem("fb_auth_user");
      localStorage.removeItem("fb_auth_token");
      sessionStorage.clear();

      const cookiesToClear = ["fb_auth_token", "fb_session", "token"];
      cookiesToClear.forEach((name) => {
        document.cookie = `${name}=; Max-Age=0; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      });
    } catch (err) {
      console.error("Failed to clear credentials:", err);
    }
  }, []);

  /**
   * Helper: Hard browser redirect to flush in-memory state and caches
   */
  const performHardLogoutRedirect = useCallback(() => {
    if (typeof window === "undefined") return;

    const currentPath = window.location.pathname;
    const isSensitive =
      currentPath.startsWith("/admin") || currentPath.includes("/mod");
    const destination = isSensitive ? "/login?logged_out=1" : "/";

    window.location.replace(destination);
  }, []);

  /**
   * Multi-Tab Synchronization via BroadcastChannel with Storage Event fallback
   */
  useEffect(() => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
        broadcastChannelRef.current = channel;

        channel.onmessage = (event) => {
          if (event.data?.type === "LOGOUT") {
            setUser(null);
            setToken(null);
            obliterateSessionData();
            performHardLogoutRedirect();
          }
        };
      } catch (e) {
        console.warn("BroadcastChannel error:", e);
      }
    }

    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === "fb_auth_token" && !event.newValue) {
        setUser(null);
        setToken(null);
        obliterateSessionData();
        performHardLogoutRedirect();
      }
    };

    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
        broadcastChannelRef.current = null;
      }
    };
  }, [obliterateSessionData, performHardLogoutRedirect]);

  /**
   * Dynamic Session Hydration on Mount:
   * Re-syncs stored session with latest definitions from INITIAL_MOCK_USERS in lib/mockData.ts
   * so changes to roles, avatars, or managed communities reflect immediately.
   */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const storedUserRaw = localStorage.getItem("fb_auth_user");
      const storedToken = localStorage.getItem("fb_auth_token");

      if (storedUserRaw && storedToken) {
        const parsed = JSON.parse(storedUserRaw) as User;

        // Find fresh definition from mockData by ID or Username
        const freshMock = INITIAL_MOCK_USERS.find(
          (u) =>
            u.id === parsed.id ||
            u.username.toLowerCase() === parsed.username.toLowerCase(),
        );

        if (freshMock) {
          const { password: _p, ...latestUser } = freshMock;
          void _p;
          // Dynamically merge latest mock data (preserves latest roles and managed communities)
          const dynamicUser: User = {
            ...latestUser,
            ...parsed,
            role: latestUser.role,
            managedCommunities: latestUser.managedCommunities,
            profile: {
              ...latestUser.profile,
              ...parsed.profile,
            },
          };

          setUser(dynamicUser);
          setToken(storedToken);
          localStorage.setItem("fb_auth_user", JSON.stringify(dynamicUser));
        } else {
          setUser(parsed);
          setToken(storedToken);
        }
      }
    } catch (error) {
      console.error("Session load error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Standard Login
  const login = async (emailOrUsername: string, pass: string) => {
    const res = await authService.login(emailOrUsername, pass);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem("fb_auth_user", JSON.stringify(res.user));
    localStorage.setItem("fb_auth_token", res.token);
  };

  // Register
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

  /**
   * Dynamic Instant User Switcher:
   * Allows 1-click switching to any mock account (Admin, DevBro, Sarah, etc.)
   */
  const switchUser = useCallback(async (userIdOrUsername: string) => {
    const query = userIdOrUsername.trim().toLowerCase();
    const matched = INITIAL_MOCK_USERS.find(
      (u) =>
        u.id.toLowerCase() === query ||
        u.username.toLowerCase() === query ||
        u.email.toLowerCase() === query,
    );

    if (!matched) {
      throw new Error(
        `Mock account "${userIdOrUsername}" not found in mockData.`,
      );
    }

    const { password: _p, ...cleanUser } = matched;
    void _p;
    setUser(cleanUser);
    setToken(matched.token);
    localStorage.setItem("fb_auth_user", JSON.stringify(cleanUser));
    localStorage.setItem("fb_auth_token", matched.token);
  }, []);

  /**
   * Update active user profile dynamically at runtime
   */
  const updateUser = useCallback((partial: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...partial };
      localStorage.setItem("fb_auth_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Secure Logout
  const logout = useCallback(
    async (_options?: { reason?: string }) => {
      void _options;
      try {
        if (authService.logout && token) {
          await authService.logout(token);
        }
      } catch (err) {
        console.warn(
          "Backend logout request failed, continuing client purge:",
          err,
        );
      } finally {
        if (broadcastChannelRef.current) {
          try {
            broadcastChannelRef.current.postMessage({
              type: "LOGOUT",
              timestamp: Date.now(),
            });
          } catch (e) {
            console.warn("Broadcast postMessage error:", e);
          }
        }

        obliterateSessionData();
        setUser(null);
        setToken(null);
        performHardLogoutRedirect();
      }
    },
    [token, obliterateSessionData, performHardLogoutRedirect],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        switchUser,
        updateUser,
        mockUsers,
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
