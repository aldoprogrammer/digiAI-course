import React from 'react';

import useWindowSize from '@/hooks/useWindowSize';
import { cn } from '@/lib/utils/cn';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  // eslint-disable-next-line no-unused-vars
  onClick?: (() => void) | ((e: any) => void);
  variant?: 'main' | 'secondary' | 'third';
  type?: 'button' | 'submit' | 'reset';
  size?: 'small' | 'default' | 'large';
  shadow?: boolean;
  icon?: React.ReactNode;
}

const Button = ({
  children,
  className,
  onClick,
  disabled = false,
  variant = 'main',
  type = 'button',
  size = 'default',
  shadow = true,
  icon,
}: ButtonProps) => {
  const { isMobile } = useWindowSize();

  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={cn(
        'relative z-10 flex items-center justify-center gap-2 rounded-md transition-all duration-200',
        shadow && 'shadow-md hover:shadow-lg',
        variant === 'main' &&
          'bg-gradient-to-r from-indigo-500 to-teal-500 text-white hover:from-indigo-600 hover:to-teal-600',
        variant === 'secondary' &&
          'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900',
        variant === 'third' &&
          'border border-indigo-500 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-600',
        (size === 'small' || isMobile) && 'h-10 px-5 text-[14px]',
        size === 'default' && 'h-12 px-6 text-[16px]',
        size === 'large' && 'h-14 px-8 text-[18px]',
        disabled &&
          'cursor-not-allowed opacity-50 bg-gray-400 text-gray-200 shadow-none hover:shadow-none',
        className,
      )}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
