import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/store';
import type { UserRole } from '../type';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const location = useLocation();
  const currentUser = useAppSelector((state) => state.user.currentUser);

  // Check if logged in
  if (!currentUser || !currentUser.id) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role permissions if specified
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/task" replace />;
  }

  return children;
};

export default ProtectedRoute;
