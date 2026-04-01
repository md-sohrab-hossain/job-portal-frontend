"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react";
import { AuthUser } from "@/types/api";
import { api, verifySession } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const verifyAuth = useCallback(async () => {
    return await verifySession();
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const stored = localStorage.getItem("userData");
      
      if (!stored) {
        setIsLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(stored);
        if (!parsed || !parsed.id || !parsed.email || !parsed.role) {
          localStorage.removeItem("userData");
          setIsLoading(false);
          return;
        }

        const isValid = await verifyAuth();
        if (isValid) {
          setUserData(parsed);
        } else {
          localStorage.removeItem("userData");
          router.push("/login");
        }
      } catch {
        localStorage.removeItem("userData");
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, [verifyAuth, router]);

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
        isLoading,
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
