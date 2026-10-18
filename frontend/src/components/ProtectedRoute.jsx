import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

// Wrap a page with this. Visitors who are not logged in are sent to /login.
export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // "from" lets the Login page send the user back here after signing in.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
