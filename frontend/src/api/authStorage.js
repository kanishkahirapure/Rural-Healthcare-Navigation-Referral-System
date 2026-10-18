// Small helper that saves the login data (token, role, name, userId) in localStorage.
// Every read and write is wrapped in try/catch because storage can be blocked or full.

const KEYS = {
  token: "rc_token",
  role: "rc_role",
  name: "rc_name",
  userId: "rc_userId",
};

// Save the login data after a successful login.
export function saveSession({ token, role, name, userId }) {
  try {
    localStorage.setItem(KEYS.token, token);
    localStorage.setItem(KEYS.role, role);
    localStorage.setItem(KEYS.name, name);
    localStorage.setItem(KEYS.userId, String(userId));
  } catch (error) {
    console.error("Could not save the session", error);
  }
}

// Read the saved login data. Returns null when nobody is logged in.
export function loadSession() {
  try {
    const token = localStorage.getItem(KEYS.token);
    if (!token) return null;
    return {
      token,
      role: localStorage.getItem(KEYS.role),
      name: localStorage.getItem(KEYS.name),
      userId: Number(localStorage.getItem(KEYS.userId)),
    };
  } catch (error) {
    console.error("Could not read the session", error);
    return null;
  }
}

// Remove the saved login data (logout, or an expired token).
export function clearSession() {
  try {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("Could not clear the session", error);
  }
}

// Only the token, used by the request interceptor.
export function getToken() {
  try {
    return localStorage.getItem(KEYS.token);
  } catch {
    return null;
  }
}
