"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("http://localhost:5555/", {
        credentials: "include",
      });
      if (response.ok) {
        setIsAuthenticated(true);
        // You might want to extract username from response
      }
    } catch (error) {
      console.log("Not authenticated");
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch("http://localhost:5555/login", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setUser(username);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:5555/logout", {
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}