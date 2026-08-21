"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (emailOrUsername: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role?: string) => Promise<{ ok: boolean; error?: string }>;
  googleLogin: (credentialData: { credential?: string; userInfo?: any; role?: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "1000000000000-dummyclientid.apps.googleusercontent.com";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/status");
      const data = await response.json();
      if (data.authenticated && data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.log("Auth status check failed:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (emailOrUsername: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailOrUsername, username: emailOrUsername, password }),
      });

      const data = await response.json();
      if (data.ok && data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
        return { ok: true };
      }
      return { ok: false, error: data.error || "Login failed" };
    } catch (error: any) {
      console.error("Login error:", error);
      return { ok: false, error: error.message || "Network error during login" };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: string = "user"
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();
      if (data.ok && data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
        return { ok: true };
      }
      return { ok: false, error: data.error || "Registration failed" };
    } catch (error: any) {
      console.error("Signup error:", error);
      return { ok: false, error: error.message || "Network error during registration" };
    }
  };

  const googleLogin = async (credentialData: { credential?: string; userInfo?: any; role?: string }): Promise<{ ok: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentialData),
      });

      const data = await response.json();
      if (data.ok && data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
        return { ok: true };
      }
      return { ok: false, error: data.error || "Google Auth failed" };
    } catch (error: any) {
      console.error("Google Auth error:", error);
      return { ok: false, error: error.message || "Network error during Google authentication" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider
        value={{
          isAuthenticated,
          user,
          login,
          signup,
          googleLogin,
          logout,
          isLoading,
        }}
      >
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}