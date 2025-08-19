import React from "react";
import { Calendar } from "lucide-react";

interface DateSelectorProps {
  label?: string;
  onClick?: () => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  label = "Select dates",
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 border rounded-md px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
    >
      <Calendar size={16} />
      {label}
    </button>
  );
};

export default DateSelector;
