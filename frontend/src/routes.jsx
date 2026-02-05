export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  project: (id) => `/projects/${id}`,
  analytics: '/analytics',
  profile: '/profile',
};

export const navLinks = [
  { name: 'Dashboard', path: routes.dashboard, icon: 'dashboard' },
  { name: 'Analytics', path: routes.analytics, icon: 'analytics' },
  { name: 'Profile', path: routes.profile, icon: 'person' },
];