import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";

interface DateSelectorProps {
  label?: string;
  onDateSelect?: (startDate: Date | null, endDate: Date | null) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  label = "Select dates",
  onDateSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDisplayText = () => {
    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else if (startDate) {
      return formatDate(startDate);
    }
    return label;
  };

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(date);
      setEndDate(null);
    } else {
      // Complete the range
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const handleApply = () => {
    onDateSelect?.(startDate, endDate);
    setIsOpen(false);
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    onDateSelect?.(null, null);
    setIsOpen(false);
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    
    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!startDate) return false;
    if (!endDate) {
      return hoveredDate && date >= startDate && date <= hoveredDate;
    }
    return date >= startDate && date <= endDate;
  };

  const isDateSelected = (date: Date) => {
    return (startDate && date.getTime() === startDate.getTime()) ||
           (endDate && date.getTime() === endDate.getTime());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="relative" ref={calendarRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-all duration-150 ease-in-out transform hover:scale-105 hover:shadow-sm"
      >
        <Calendar size={16} />
        {getDisplayText()}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[280px] animate-in slide-in-from-top-2 duration-200">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            
            <div className="grid grid-cols-7 gap-1 text-xs">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="p-2 text-center text-gray-500 font-medium">
                  {day}
                </div>
              ))}
              
              {generateCalendarDays().map((date, index) => (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  onMouseEnter={() => setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  className={`p-2 text-center text-sm rounded-md transition-all duration-150 ease-in-out transform hover:scale-105 ${
                    isDateSelected(date)
                      ? 'bg-green-500 text-white shadow-md scale-105'
                      : isDateInRange(date)
                      ? 'bg-green-100 text-green-700 shadow-sm'
                      : isToday(date)
                      ? 'bg-gray-100 text-gray-900 font-medium shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                  } ${
                    date.getMonth() !== new Date().getMonth()
                      ? 'text-gray-400'
                      : ''
                  }`}
                >
                  {date.getDate()}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 pt-2 border-t">
            <button
              onClick={handleClear}
              className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-150 ease-in-out transform hover:scale-105"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-3 py-2 text-sm text-white rounded-md bg-green-600 hover:bg-green-700 transition-all duration-150 ease-in-out transform hover:scale-105 hover:shadow-md"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector;
