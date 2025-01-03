import React, { Fragment } from 'react';

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';

import { cn } from '@/lib/utils/cn';

export type DropdownItemType = {
  label: string;
  icon?: React.ReactNode;
  value?: any;
};

interface CustomDropdownProps {
  triggerContent: React.ReactNode;
  options: DropdownItemType[];
  // eslint-disable-next-line no-unused-vars
  onItemClick?: (item: DropdownItemType) => void;
  className?: string;
  menuClassName?: string;
}

const CustomDropdown = ({
  triggerContent,
  options,
  onItemClick,
  className,
  menuClassName,
}: CustomDropdownProps) => {
  return (
    <Menu as="div" className={cn('relative inline-block text-left', className)}>
      {/* Dropdown Trigger */}
      <MenuButton className="w-full focus:outline-none">
        {triggerContent}
      </MenuButton>

      {/* Dropdown Items */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems
          className={cn(
            'absolute right-0 z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-md bg-white shadow-lg',
            'border border-gray-200 font-medium text-gray-700',
            menuClassName,
          )}
        >
          {options.map((item, index) => (
            <MenuItem key={index}>
              {({ active }) => (
                <div
                  onClick={() => {
                    if (onItemClick) onItemClick(item);
                  }}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 px-4 py-2 transition duration-200',
                    active ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700',
                  )}
                >
                  {item.icon && <span>{item.icon}</span>}
                  {item.label}
                </div>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default CustomDropdown;
