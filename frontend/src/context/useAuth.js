import { useContext } from "react";
import { AuthContext } from "./authContextObject";

// Hook for pages: const { user, isLoggedIn, login, logout } = useAuth();
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return value;
}
