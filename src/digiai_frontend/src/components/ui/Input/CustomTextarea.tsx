import { forwardRef, TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export interface CustomTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
  errorClassName?: string;
}

const CustomTextarea = forwardRef<HTMLTextAreaElement, CustomTextareaProps>(
  (
    {
      label,
      error,
      containerClassName,
      labelClassName,
      textareaClassName,
      errorClassName,
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
        <textarea
          ref={ref}
          className={cn(
            'w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-4 placeholder-gray-400',
            'resize-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none',
            textareaClassName,
          )}
          {...props}
        />
        {error && (
          <p className={cn('mt-1 text-sm font-medium text-red-500', errorClassName)}>
            {error}
          </p>
        )}
      </div>
    );
  },
);

CustomTextarea.displayName = 'CustomTextarea';

export { CustomTextarea };
