import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils/cn';
import { useAuthManager } from '@/store/AuthProvider';

import { menuSections } from '../Navbar/UserDropdown';

const DashboardMenu = () => {
  const { pathname } = useLocation();
  const { logout } = useAuthManager();

  const [history, setHistory] = useState(localStorage.getItem('lastPath') || pathname);

  useEffect(() => {
    if (pathname && pathname !== '/dashboard/courses-studio/post') {
      setHistory(pathname);
      localStorage.setItem('lastPath', pathname);
    }
  }, [pathname]);

  const dashboardMenu = menuSections.slice(0, -1); // Remove the last section (logout section)

  return (
    <aside className="h-[calc(100vh-81px)] w-full max-w-[280px] border-r border-gray-200 bg-white shadow-lg overflow-y-auto">
      {dashboardMenu.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-4 py-4 px-5">
          {section.items.map((item, itemIndex) => (
            <Link
              key={itemIndex}
              to={item.to ?? '#'}
              className={cn(
                'flex items-center gap-4 rounded-lg px-5 py-3 text-sm font-semibold text-gray-700 transition-colors duration-300 ease-in-out hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white dark:hover:text-gray-200',
                item.to === history &&
                [
                  'bg-blue-500 text-white',
                  'bg-green-500 text-white',
                ][sectionIndex],
                section.activeClassName,
              )}
            >
              {item.icon}
              <span className="capitalize">{item.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </aside>
  );
};

export default DashboardMenu;
