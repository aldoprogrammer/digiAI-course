import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils/cn';
import { useAuthManager } from '@/store/AuthProvider';

import Button from '../../Button/Button';
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

  const dashboardMenu = menuSections.slice(0, -1);

  return (
    <aside className="h-[calc(100vh-81px)] w-full max-w-[250px] border-r border-border bg-white shadow-md">
      <div className="flex flex-col divide-y divide-border">
        {dashboardMenu.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-1 p-2">
            {section.items.map((item, itemIndex) => (
              <Link
                key={itemIndex}
                to={item.to ?? '#'}
                className={cn(
                  'flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 bg-graydark dark:bg-meta-4',
                  item.to === history &&
                    [
                      'bg-blue-100 text-blue-800',
                      'bg-green-100 text-green-800',
                      'bg-purple-100 text-purple-800',
                    ][sectionIndex],
                  section.activeClassName,
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-border px-3 pt-6">
        <Button
          className="w-full bg-red-600 text-white rounded-lg px-4 py-2 shadow-md hover:bg-red-700 transition-colors"
          onClick={logout}
        >
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default DashboardMenu;
