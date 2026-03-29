"use client";

import { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "@mantine/hooks";
import { AuthUser } from "@/types/api";
import { api } from "@/lib/api";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData] = useLocalStorage<AuthUser | null>({
    key: "userData",
    defaultValue: null,
  });

  const logout = () => {
    localStorage.removeItem("userData");
    api.auth.logout();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user: userData,
        isAuthenticated: !!userData,
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
