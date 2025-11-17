interface UserSession {
  userId: string;
  userEmail: string;
  role: string;
  iat: number;
  exp: number;
}

// Simple JWT creation (for demo - in production, generate on server)
export const createToken = (userData: {
  userId: string;
  userEmail: string;
  role: string;
}): string => {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    userId: userData.userId,
    userEmail: userData.userEmail,
    role: userData.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  };

  // Base64 encode (Note: In production, use proper JWT signing on backend)
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));

  // For demo purposes only - real JWT needs HMAC signature from server
  return `${encodedHeader}.${encodedPayload}.demo-signature`;
};

export const saveSession = (userData: {
  userId: string;
  userEmail: string;
  role: string;
}): void => {
  const token = createToken(userData);
  sessionStorage.setItem("authToken", token);
  sessionStorage.setItem("userRole", userData.role);
  sessionStorage.setItem("userId", userData.userId);
};

export const getSession = (): UserSession | null => {
  const token = sessionStorage.getItem("authToken");

  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));

    // Check if token is expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      clearSession();
      return null;
    }

    return payload as UserSession;
  } catch (error) {
    console.error("Error decoding token:", error);
    clearSession();
    return null;
  }
};

export const clearSession = (): void => {
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("userRole");
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("user-storage"); // Clear user store
};

export const isAuthenticated = (): boolean => {
  const session = getSession();
  return session !== null;
};

export const getUserRole = (): string | null => {
  const session = getSession();
  return session?.role || null;
};

export const isAdmin = (): boolean => {
  return getUserRole() === "admin";
};
