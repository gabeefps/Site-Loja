import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authApi } from '../services/api';
import { canRestoreSession, clearAuthentication } from '../services/authSession';

export default function ProtectedRoute({ children, roles }) {
  const [state, setState] = useState({ loading: true, user: null });
  const location = useLocation();
  useEffect(() => {
    let active = true;
    if (!canRestoreSession()) {
      authApi.logout().catch(() => {}).finally(() => active && setState({ loading: false, user: null, returnHome: true }));
      return () => { active = false; };
    }
    authApi.me().then(({ user }) => active && setState({ loading: false, user })).catch(() => {
      clearAuthentication();
      if (active) setState({ loading: false, user: null });
    });
    return () => { active = false; };
  }, []);
  if (state.loading) return <main className="route-loading" aria-live="polite">Verificando acesso...</main>;
  if (state.returnHome) return <Navigate to="/" replace />;
  if (!state.user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (roles && !roles.includes(state.user.role)) return <Navigate to="/cliente" replace />;
  return children;
}
