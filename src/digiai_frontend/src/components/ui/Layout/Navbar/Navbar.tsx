import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils/cn';
import { useAuthManager } from '@/store/AuthProvider';

import Button from '../../Button/Button';
import UserDropdown from './UserDropdown';

const Navbar = () => {
  const { isAuthenticated, login } = useAuthManager();

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between py-4 px-6 md:px-10">
        {/* Left Section: Logo and Links */}
        <div className="flex items-center space-x-12">
          <Link to="/">
            <img
              alt="nekotip logo"
              src="https://media.discordapp.net/attachments/1314806383195197475/1319296521648472115/Blue_and_Yellow_Modern_Innovating_Online_Learning_Logo-3.png?ex=67661ae2&is=6764c962&hm=b61d401349e5a7c30bb048d47deeec8aebed84779a4341510902f1a2e4e696f8&=&format=webp&quality=lossless&width=733&height=733"
              className="h-10"
              loading="eager"
            />
          </Link>
          <ul className="flex space-x-8 text-gray-600 font-semibold text-lg">
            {isAuthenticated && (
              <li className="hover:text-black transition-colors">
                <Link to="/dashboard">Dashboard</Link>
              </li>
            )}
            <li className="hover:text-black transition-colors">
              <Link to="/courses">Finding A Courses</Link>
            </li>
            <li className="hover:text-black transition-colors">
              <Link to="/#">Become An Instructor</Link>
            </li>
            <li className="hover:text-black transition-colors">
              <Link to="/#">Career</Link>
            </li>
          </ul>
        </div>

        {/* Right Section: Authentication / User Dropdown */}
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <Button onClick={login} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
              Login
            </Button>
          ) : (
            <UserDropdown />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
