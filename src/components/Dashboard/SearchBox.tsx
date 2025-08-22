import React from "react";
import { Search } from "lucide-react";

interface SearchBoxProps {
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "Search",
  onChange,
  className
}) => {
  return (
      <div className={`flex items-center border rounded-md px-3 py-2 bg-white w-64 ${className}`}>
      <Search size={16} className="text-gray-400 mr-2" />
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="outline-none flex-1 text-sm text-gray-700"
      />
    </div>
  );
};

export default SearchBox;
