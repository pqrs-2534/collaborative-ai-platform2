import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiBell, FiSettings, FiLogOut, FiUser, FiMenu } from 'react-icons/fi';
import { logout } from '../../redux/slices/authSlice';
import { toggleSidebar } from '../../redux/slices/uiSlice';
import useAuth from '../../hooks/useAuth';
import Avatar from './Avatar';
import Dropdown, { DropdownItem, DropdownDivider } from './Dropdown';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <FiMenu size={20} />
            </button>
            
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CA</span>
              </div>
              <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                CollabAI
              </span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <FiBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User Menu */}
            <Dropdown
              align="right"
              trigger={
                <div className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <Avatar src={user?.avatar} name={user?.name} size="sm" />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                  </div>
                </div>
              }
            >
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              <DropdownItem icon={<FiUser />} onClick={() => navigate('/profile')}>
                Profile
              </DropdownItem>
              
              <DropdownItem icon={<FiSettings />} onClick={() => navigate('/profile')}>
                Settings
              </DropdownItem>

              <DropdownDivider />

              <DropdownItem icon={<FiLogOut />} onClick={handleLogout} danger>
                Logout
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;