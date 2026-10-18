import { useCallback, useMemo, useState } from "react";
import { login as loginRequest } from "../api/auth";
import { clearSession, loadSession, saveSession } from "../api/authStorage";
import { AuthContext } from "./authContextObject";

// Keeps the logged-in user (token, role, name, userId) for the whole app.
export function AuthProvider({ children }) {
  // Restore the session from localStorage once, when the app starts.
  const [user, setUser] = useState(() => loadSession());

  // Call the backend, save the session and update the state.
  // Errors are not caught here, so the Login page can show the message.
  const login = useCallback(async (credentials) => {
    const data = await loginRequest(credentials); // { token, role, name, userId }
    saveSession(data);
    setUser(data);
    return data;
  }, []);

  // Forget the session (the Logout button uses this).
  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoggedIn: Boolean(user?.token), login, logout }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
