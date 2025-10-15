import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";

export default function RequireAuth({ children }) {
  const { user, ready } = useAuth();
  const loc = useLocation();
  if (!ready) return null;                   // evita piscar
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}
