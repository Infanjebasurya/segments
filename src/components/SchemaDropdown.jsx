import React from 'react';

const SchemaDropdown = ({ selectedValue, onChange, availableOptions, index, disabled = false }) => {
  return (
    <div className="relative">
      <select 
        value={selectedValue} 
        onChange={(e) => onChange(index, e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none pr-10"
        disabled={disabled}
      >
        <option value="">Select a schema...</option>
        {availableOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default SchemaDropdown;