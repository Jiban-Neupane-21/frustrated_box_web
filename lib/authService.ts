// lib/authService.ts
import { User, AuthResponse } from "@/types/auth";
import { INITIAL_MOCK_USERS, MockUserRecord } from "@/lib/mockData";

// Local storage लाई mock database को रूपमा प्रयोग गर्ने helper
const getMockDatabaseUsers = (): MockUserRecord[] => {
  if (typeof window === "undefined") return INITIAL_MOCK_USERS;
  const stored = localStorage.getItem("fb_mock_db_users");
  if (!stored) {
    localStorage.setItem(
      "fb_mock_db_users",
      JSON.stringify(INITIAL_MOCK_USERS),
    );
    return INITIAL_MOCK_USERS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MOCK_USERS;
  }
};

export const authService = {
  // Login Request
  login: async (email: string, password: string): Promise<AuthResponse> => {
    // -------------------------------------------------------------
    // पछि Real API जोड्दा केवल यो ब्लकलाई fetch/axios ले replace गर्ने:
    // const res = await fetch('/api/auth/login', { ... });
    // return res.json();
    // -------------------------------------------------------------
    await new Promise((resolve) => setTimeout(resolve, 500)); // Latency delay
    const users = getMockDatabaseUsers();

    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );

    if (!found) {
      throw new Error("Invalid email or password");
    }

    const { password: _, ...user } = found;
    return {
      user,
      token: found.token,
    };
  },

  // Register Request
  register: async (data: {
    name: string;
    username: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    // -------------------------------------------------------------
    // Real API मा:
    // const res = await fetch('/api/auth/register', { ... });
    // return res.json();
    // -------------------------------------------------------------
    await new Promise((resolve) => setTimeout(resolve, 500));
    const users = getMockDatabaseUsers();

    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error("Email already registered");
    }

    const newUser: MockUserRecord = {
      id: `usr_${Date.now()}`,
      name: data.name,
      username: data.username,
      email: data.email,
      role: "USER",
      password: data.password,
      token: `mock-jwt-${Date.now()}`,
      profile: {
        bio: "",
        joinedDate: "Recently",
      },
    };

    localStorage.setItem(
      "fb_mock_db_users",
      JSON.stringify([...users, newUser]),
    );

    const { password: _, ...user } = newUser;
    return {
      user,
      token: newUser.token,
    };
  },
  logout: async (_token?: string | null): Promise<void> => {
    try {
      // Future Real API call:
      // await fetch('/api/auth/logout', {
      //   method: 'POST',
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.warn(
        "Backend logout failed, clearing client state anyway:",
        error,
      );
    }
  },
};
