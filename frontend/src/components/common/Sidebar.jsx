import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FiHome,
  FiFolder,
  FiBarChart2,
  FiMessageSquare,
  FiUsers,
  FiX
} from 'react-icons/fi';
import { FaLightbulb } from 'react-icons/fa';
import { setSidebarOpen } from '../../redux/slices/uiSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);

  const menuItems = [
    { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
    { name: 'Projects', icon: FiFolder, path: '/dashboard' },
    { name: 'Analytics', icon: FiBarChart2, path: '/analytics' },
    { name: 'AI Ideas', icon: FaLightbulb, path: '/dashboard' },
    { name: 'Team', icon: FiUsers, path: '/dashboard' },
    { name: 'Messages', icon: FiMessageSquare, path: '/dashboard' },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50
          h-screen w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="text-lg font-bold text-gray-900">Menu</span>
            <button
              onClick={() => dispatch(setSidebarOpen(false))}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <FiX size={20} />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-primary-900 mb-1">
                Upgrade to Pro
              </h3>
              <p className="text-xs text-primary-700 mb-3">
                Get unlimited projects and AI features
              </p>
              <button className="w-full px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
