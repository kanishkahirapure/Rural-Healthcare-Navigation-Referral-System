import { createContext } from "react";

// The empty "box" that holds the login data. AuthProvider fills it, useAuth reads it.
export const AuthContext = createContext(null);
