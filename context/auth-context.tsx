"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { AuthUser } from "@/types/api";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<AuthUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) {
      try {
        setUserData(JSON.parse(stored));
      } catch {
        setUserData(null);
      }
    }
  }, []);

  const login = (user: AuthUser) => {
    localStorage.setItem("userData", JSON.stringify(user));
    setUserData(user);
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore API errors
    } finally {
      localStorage.removeItem("userData");
      setUserData(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: userData,
        isAuthenticated: !!userData,
        login,
        logout,
      }}
    >
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
