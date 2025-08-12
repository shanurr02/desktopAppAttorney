import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  error?: string;
  label?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  id,
  name,
  autoComplete,
  error,
  label
}) => {
  const baseClasses = "w-full px-4 py-2 border border-gray-300 rounded-md outline-none transition-all duration-200 focus:ring-2 focus:ring-green-50 focus:border-green-500"; 
  const errorClasses = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-green-50 focus:border-green-500";
  const disabledClasses = disabled ? "bg-gray-100 cursor-not-allowed opacity-50" : "";
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`${baseClasses} ${errorClasses} ${disabledClasses} ${className}`}
      />
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
