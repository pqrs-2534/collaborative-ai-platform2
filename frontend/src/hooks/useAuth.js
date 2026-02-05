import { useSelector } from 'react-redux';

const useAuth = () => {
  const { user, token, loading, error } = useSelector((state) => state.auth);

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    isProjectManager: user?.role === 'project_manager' || user?.role === 'admin',
  };
};

export default useAuth;