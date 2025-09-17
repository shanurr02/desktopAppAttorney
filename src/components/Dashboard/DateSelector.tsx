import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  format,
  addMonths,
  subMonths,
  getYear,
  getMonth
} from "date-fns";

interface DateSelectorProps {
  label?: string;
  onDateSelect?: (startDate: Date | null, endDate: Date | null) => void;
  className?: string;
  placeholder?: string;
  singleDate?: boolean; // New prop for single date selection (like DOB)
}

const DateSelector: React.FC<DateSelectorProps> = ({
  label = "Select dates",
  onDateSelect,
  className = "",
  placeholder,
  singleDate = false,
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
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowMonthDropdown(false);
        setShowYearDropdown(false);
      }
    };

    // Add a small delay to prevent immediate closure on first click
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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

  const handleDateClick = (date: Date, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (singleDate) {
      // Single date selection (like DOB)
      setStartDate(date);
      setEndDate(null);
      onDateSelect?.(date, null);
      setIsOpen(false);
      setShowMonthDropdown(false);
      setShowYearDropdown(false);
    } else {
      // Range selection
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
        // Auto-close calendar after completing range selection
        onDateSelect?.(startDate, date);
        setIsOpen(false);
        setShowMonthDropdown(false);
        setShowYearDropdown(false);
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
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 }); // Sunday end
    
    return eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd
    });
  };

  const isDateInRange = (date: Date) => {
    if (!startDate) return false;
    if (!endDate) {
      return hoveredDate && date >= startDate && date <= hoveredDate;
    }
    return date >= startDate && date <= endDate;
  };

  const isDateSelected = (date: Date) => {
    return (startDate && isSameDay(date, startDate)) ||
           (endDate && isSameDay(date, endDate));
  };

  const isDateToday = (date: Date) => {
    return isToday(date);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  const handleMonthChange = (monthIndex: number) => {
    setCurrentMonth(new Date(getYear(currentMonth), monthIndex, 1));
    setShowMonthDropdown(false);
  };

  const handleYearChange = (year: number) => {
    setCurrentMonth(new Date(year, getMonth(currentMonth), 1));
    setShowYearDropdown(false);
  };

  const getMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i,
      label: format(new Date(2024, i, 1), 'MMMM')
    }));
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    if (singleDate) {
      // For DOB selection, show a wider range (1900 to current year + 2)
      for (let year = 1900; year <= currentYear + 2; year++) {
        years.push({ value: year, label: year.toString() });
      }
    } else {
      // For date range selection, show a smaller range (current year - 10 to current year + 2)
      for (let year = currentYear - 10; year <= currentYear + 2; year++) {
        years.push({ value: year, label: year.toString() });
      }
    }
    
    return years;
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={calendarRef}>
      <button
        type="button"
        onClick={handleButtonClick}
        className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus-within:ring-0 bg-white ${className}`}
      >
        <Calendar size={16} />
        {getDisplayText()}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-50 min-w-[280px] animate-in slide-in-from-top-2 duration-200">
          <div className="mb-4">
            {/* Month Navigation Header */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
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
                    type="button"
                    onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                    className="text-sm font-medium text-gray-900 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded transition-colors duration-150"
                  >
                    {format(currentMonth, 'MMMM')}
                  </button>
                  {showMonthDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px] max-h-48 overflow-y-auto">
                      {getMonthOptions().map((month) => (
                        <button
                          key={month.value}
                          type="button"
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
                    type="button"
                    onClick={() => setShowYearDropdown(!showYearDropdown)}
                    className="text-sm font-medium text-gray-900 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded transition-colors duration-150"
                  >
                    {getYear(currentMonth)}
                  </button>
                  {showYearDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[100px] max-h-64 overflow-y-auto">
                      {getYearOptions().map((year) => (
                        <button
                          key={year.value}
                          type="button"
                          onClick={() => handleYearChange(year.value)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors duration-150 ${
                            year.value === getYear(currentMonth)
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
                  type="button"
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
                  type="button"
                  onClick={(e) => handleDateClick(date, e)}
                  onMouseEnter={() => setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  className={`p-2 text-center text-sm rounded-md transition-all duration-150 ease-in-out transform hover:scale-105 ${
                    isDateSelected(date)
                      ? 'bg-green-500 text-white shadow-md scale-105'
                      : isDateInRange(date)
                      ? 'bg-green-100 text-green-700 shadow-sm'
                      : isDateToday(date)
                      ? 'bg-gray-100 text-gray-900 font-medium shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                  } ${
                    !isSameMonth(date, currentMonth)
                      ? 'text-gray-400'
                      : ''
                  }`}
                >
                  {format(date, 'd')}
                </button>
              ))}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default DateSelector;
