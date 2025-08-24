import React, { forwardRef } from 'react';
import { InputProps } from '../../data/types';

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}, ref) => {
  const inputClasses = `
    w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 
    border-2 transition-all duration-300
    ${error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400'
    }
    focus:ring-2 focus:ring-opacity-50 outline-none
    text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
    ${disabled ? 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed' : 'hover:border-gray-300 dark:hover:border-gray-600'}
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';

export default Input;