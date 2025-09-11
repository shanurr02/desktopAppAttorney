import React from "react";

interface FilterButtonProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded-md text-sm font-medium transition 
        ${isActive ? "bg-gray-200 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
    >
      {label}
    </button>
  );
};

export default FilterButton;
