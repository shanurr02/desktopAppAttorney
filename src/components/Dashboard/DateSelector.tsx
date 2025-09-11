import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowMonthDropdown(false);
        setShowYearDropdown(false);
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
    setShowMonthDropdown(false);
    setShowYearDropdown(false);
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    onDateSelect?.(null, null);
    setIsOpen(false);
    setShowMonthDropdown(false);
    setShowYearDropdown(false);
  };

  const generateCalendarDays = () => {
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
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

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  const handleMonthChange = (monthIndex: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
    setShowMonthDropdown(false);
  };

  const handleYearChange = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setShowYearDropdown(false);
  };

  const getMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i,
      label: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'long' })
    }));
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 10; year <= currentYear + 2; year++) {
      years.push({ value: year, label: year.toString() });
    }
    return years;
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
            {/* Month Navigation Header */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={goToPreviousMonth}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-150"
                title="Previous month"
              >
                <ChevronLeft size={16} className="text-gray-600" />
              </button>
              
              <div className="flex items-center gap-2">
                {/* Month Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                    className="text-sm font-medium text-gray-900 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded transition-colors duration-150"
                  >
                    {currentMonth.toLocaleDateString('en-US', { month: 'long' })}
                  </button>
                  {showMonthDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px] max-h-48 overflow-y-auto">
                      {getMonthOptions().map((month) => (
                        <button
                          key={month.value}
                          onClick={() => handleMonthChange(month.value)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors duration-150 ${
                            month.value === currentMonth.getMonth()
                              ? 'bg-green-100 text-green-700 font-medium'
                              : 'text-gray-700'
                          }`}
                        >
                          {month.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Year Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowYearDropdown(!showYearDropdown)}
                    className="text-sm font-medium text-gray-900 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded transition-colors duration-150"
                  >
                    {currentMonth.getFullYear()}
                  </button>
                  {showYearDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[80px] max-h-48 overflow-y-auto">
                      {getYearOptions().map((year) => (
                        <button
                          key={year.value}
                          onClick={() => handleYearChange(year.value)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors duration-150 ${
                            year.value === currentMonth.getFullYear()
                              ? 'bg-green-100 text-green-700 font-medium'
                              : 'text-gray-700'
                          }`}
                        >
                          {year.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={goToCurrentMonth}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded transition-colors duration-150"
                  title="Go to current month"
                >
                  Today
                </button>
              </div>
              
              <button
                onClick={goToNextMonth}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-150"
                title="Next month"
              >
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            </div>
            
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
                    date.getMonth() !== currentMonth.getMonth()
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
