import React from 'react';
import cfIcon from '../assets/logo/cf-icon.png';

interface CustomTitleBarProps {
  title?: string;
}

const CustomTitleBar: React.FC<CustomTitleBarProps> = ({ title = "Case Funders" }) => {
  return (
    <div 
      className="min-h-[42px] bg-[#1d1f1f]  flex items-center justify-between pl-4 pr-[1px] select-none w-full"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Left side - App Icon and Name */}
      <div className="flex items-center space-x-3">
        <img src={cfIcon} alt="Case Funders" className="w-6 h-6" />
        <span className="text-white font-medium">{title}</span>
      </div>

    </div>
  );
};

export default CustomTitleBar;
