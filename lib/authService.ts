// lib/authService.ts
import { AuthResponse } from "@/types/auth";
import { INITIAL_MOCK_USERS, MockUserRecord } from "@/lib/mockData";

// Helper: Ensure latest INITIAL_MOCK_USERS are always synced with localStorage
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
    const existingUsers: MockUserRecord[] = JSON.parse(stored);

    // Merge: Check if any new users from INITIAL_MOCK_USERS are missing in localStorage
    const existingIds = new Set(existingUsers.map((u) => u.id));
    const newUsers = INITIAL_MOCK_USERS.filter((u) => !existingIds.has(u.id));

    if (newUsers.length > 0) {
      const merged = [...existingUsers, ...newUsers];
      localStorage.setItem("fb_mock_db_users", JSON.stringify(merged));
      return merged;
    }

    return existingUsers;
  } catch {
    return INITIAL_MOCK_USERS;
  }
};

export const authService = {
  // Login Request (Supports both Email OR Username!)
  login: async (
    emailOrUsername: string,
    password: string,
  ): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 350)); // Simulated latency
    const users = getMockDatabaseUsers();

    const query = emailOrUsername.trim().toLowerCase();

    // Check against email OR username
    const found = users.find(
      (u) =>
        (u.email.toLowerCase() === query ||
          u.username.toLowerCase() === query) &&
        u.password === password,
    );

    if (!found) {
      throw new Error("Invalid username/email or password.");
    }

    const { password: ignorePassword, ...user } = found;
    void ignorePassword;
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
    await new Promise((resolve) => setTimeout(resolve, 400));
    const users = getMockDatabaseUsers();

    const emailQuery = data.email.trim().toLowerCase();
    const usernameQuery = data.username.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === emailQuery)) {
      throw new Error("Email is already registered.");
    }

    if (users.some((u) => u.username.toLowerCase() === usernameQuery)) {
      throw new Error("Username is already taken.");
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

    const { password: ignoredPassword, ...user } = newUser;
    void ignoredPassword;
    return {
      user,
      token: newUser.token,
    };
  },

  // Logout Request
  // Logout Request (Accepts token for backend session revocation / Redis blacklisting)
  logout: async (_token?: string | null): Promise<void> => {
    void _token;
    // Simulated backend latency for revoking session
    await new Promise((resolve) => setTimeout(resolve, 150));
  },
};
