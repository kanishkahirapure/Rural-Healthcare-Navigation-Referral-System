import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/store";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState(() => authService.isLoggedIn());

  const refreshUser = useCallback(() => {
    const u = authService.getCurrentUser();
    setUser(u);
    setIsLoggedIn(!!u);
  }, []);

  const login = useCallback((email, password) => {
    const res = authService.login(email, password);
    if (res.success) {
      setUser(res.user);
      setIsLoggedIn(true);
    }
    return res;
  }, []);

  // Used when backend JWT login succeeds — directly set the user without going through mock store
  const setUserDirectly = useCallback((userObj) => {
    authService._setCurrentUser(userObj);
    setUser(userObj);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const register = useCallback((data) => {
    const res = authService.register(data);
    if (res.success) {
      setUser(res.user);
      setIsLoggedIn(true);
    }
    return res;
  }, []);

  const updateProfile = useCallback((updates) => {
    const res = authService.updateProfile(updates);
    if (res.success) {
      setUser(res.user);
    }
    return res;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, register, updateProfile, refreshUser, setUserDirectly }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export default AuthContext;
