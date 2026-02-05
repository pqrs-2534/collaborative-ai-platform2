import React from 'react';
import Login from '../components/auth/Login';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <Login />
    </div>
  );
};

export default LoginPage;