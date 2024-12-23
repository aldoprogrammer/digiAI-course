import { forwardRef, InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export interface CustomInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  prefix?: string;
  prefixClassName?: string;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      error,
      containerClassName,
      labelClassName,
      inputClassName,
      errorClassName,
      prefix,
      prefixClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn(
          'w-full font-medium text-gray-700 md:text-base',
          containerClassName,
        )}
      >
        {label && (
          <label
            htmlFor={props.id}
            className={cn('mb-2 block font-semibold text-gray-800', labelClassName)}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 text-gray-500',
                prefixClassName,
              )}
            >
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-4 placeholder-gray-400 transition duration-200',
              'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none',
              prefix && 'pl-10',
              inputClassName,
            )}
            {...props}
          />
        </div>
        {error && (
          <p className={cn('mt-1 text-sm font-medium text-red-500', errorClassName)}>
            {error}
          </p>
        )}
      </div>
    );
  },
);

CustomInput.displayName = 'CustomInput';

export { CustomInput };
