import React from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';

export default function SelectInput({
  name,
  value,
  onChange,
  options = [],
  label = '',
  error,
  required = false,
  icon = null,
  className = '',
  ...props
}) {
  return (
    <div>
      {label && <InputLabel htmlFor={name} value={label} required={required} />}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 dark:text-neutral-400">
            <i className={`fa-solid ${icon}`}></i>
          </span>
        )}
        <select
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          className={`mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white ${
            icon ? 'pl-10' : ''
          } ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <InputError message={error} className="mt-2" />}
    </div>
  );
}
