import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../services/auth.jsx";

export default function PrivateRoute({ allowedRoles }) {
  const { user, role } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/login" replace />;

  return <Outlet />;
}
