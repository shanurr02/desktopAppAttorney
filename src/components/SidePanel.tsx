import React, { useState, useCallback, useMemo } from "react";
import {
  Home,
  DollarSign,
  Layers,
  Send,
  ChartPie,
  ArrowLeftRight,
  RotateCcw,
  BarChart3,
  Menu,
  User,
  LogOut,
  Bell,
} from "lucide-react";
import { useEffect, useRef } from "react";
import iconImage from '../assets/logo/icon.png';

type SidePanelProps = {
  onSelect: (page: string) => void;
  activePage: string;
};

// Memoized menu items to prevent unnecessary re-renders
const menuItems = [
  { id: "menu", label: "", icon: Menu, isHamburger: true },
  { id: "home", label: "Dashboard", icon: Home, isHamburger: false },
  { id: "finance", label: "Process Payment", icon: DollarSign, isHamburger: false },
  { id: "layers", label: "Start Application", icon: Layers, isHamburger: false },
  { id: "send", label: "Invite Client", icon: Send, isHamburger: false },
  { id: "timer", label: "Payment Plans", icon: ChartPie, isHamburger: false },
  { id: "compass", label: "Transactions", icon: ArrowLeftRight, isHamburger: false },
  { id: "refresh", label: "Refund", icon: RotateCcw, isHamburger: false },
  { id: "chart", label: "Reports", icon: BarChart3, isHamburger: false },
] as const;

const SidePanel: React.FC<SidePanelProps> = ({ onSelect, activePage }) => {
  const [expanded, setExpanded] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    };

    if (expanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded]);

  // Optimized handlers with useCallback
  const handleToggleExpanded = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  const handleMenuSelect = useCallback((pageId: string) => {
    onSelect(pageId);
    // Don't auto-expand when selecting a menu item
  }, [onSelect]);

  const handleNotificationsClick = useCallback(() => {
    console.log('Notifications clicked');
  }, []);

  const handleLogoutClick = useCallback(() => {
    console.log('Logout clicked');
  }, []);

  // Memoized classes to prevent recalculation - made absolute and always w-16 collapsed, w-64 expanded as overlay
  const sidebarClasses = useMemo(() =>
    `absolute top-0 left-0 h-screen bg-[#161717]/95 backdrop-blur-sm text-white flex flex-col transition-all duration-200 ease-out z-50 ${expanded ? "w-64 shadow-2xl" : "w-16"
    }`, [expanded]
  );

  const headerClasses = useMemo(() =>
    `flex items-center justify-center h-16 border-b border-gray-700/30 px-4 bg-[#161717]/40`, []
  );

  const footerClasses = useMemo(() =>
    `py-4 border-t border-gray-700/30 bg-[#161717]/40 relative`, []
  );

  return (
    <div className="min-w-16">

      <div ref={sidebarRef} className={sidebarClasses}>
        {/* Header with logo */}
        <div className={headerClasses}>
          <div className="flex items-center min-w-0">
            <img
              src={iconImage}
              alt="Case Funders Logo"
              className="w-8 h-8 flex-shrink-0 select-none"
            />
            <div
              className={`ml-3 overflow-hidden transition-all duration-200 ease-out ${expanded ? "w-auto opacity-100" : "w-0 opacity-0"
                }`}
            >
              <span className="font-semibold text-lg whitespace-nowrap select-none">Case Funders</span>
            </div>
          </div>
        </div>

        {/* Menu items */}
        <nav className="flex-1 p-2 space-y-2 overflow-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            // Special case for hamburger
            if (item.isHamburger) {
              return (
                <button
                  key={item.id}
                  onClick={handleToggleExpanded}
                  className={`w-full flex items-center ${expanded ? "justify-start gap-2" : "justify-center"}  py-2 px-4 rounded-md text-sm font-medium transition-all duration-150 ease-out group relative text-gray-300 hover:bg-[#161717]/50 hover:text-white`}
                >
                  <Icon size={20} className="flex-shrink-0 text-center" />
                  <div
                    className={`overflow-hidden transition-all duration-200 ease-out ${expanded ? "w-auto opacity-100" : "w-0 opacity-0"
                      }`}
                  >
                    <span className="text-sm whitespace-nowrap select-none">{item.label}</span>
                  </div>

                  {/* Tooltip for collapsed state */}
                  {!expanded && (
                    <div className="absolute left-16 bg-[#161717]/95 backdrop-blur-sm text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-out pointer-events-none z-10 select-none">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleMenuSelect(item.id)}
                className={`w-full flex items-center ${expanded ? "justify-start gap-2" : "justify-center"}  py-2 px-4 rounded-md text-sm font-medium transition-all duration-150 ease-out group relative 
                ${isActive
                    ? "bg-green-600/90 text-white shadow-md"
                    : "text-gray-300 hover:bg-[#161717]/50 hover:text-white"
                  }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <div
                  className={`overflow-hidden transition-all duration-200 ease-out ${expanded ? "w-auto opacity-100" : "w-0 opacity-0"
                    }`}
                >
                  <span className="text-sm whitespace-nowrap select-none">{item.label}</span>
                </div>

                {/* Optimized tooltip for collapsed state */}
                {!expanded && (
                  <div className="absolute left-16 bg-[#161717]/95 backdrop-blur-sm text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-out pointer-events-none z-10 select-none">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer with profile and notifications */}
        <div className={footerClasses}>
          {/* Expanded state footer */}
          {expanded && (
            <div className="flex items-center h-full px-4">
              <div className="flex items-center w-full">
                {/* Profile section */}
                <div className="flex items-center flex-1 min-w-0">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-3 min-w-0">
                    <p className="text-sm font-medium text-white truncate">Profile</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Collapsed state footer */}
          {!expanded && (
            <div className="flex flex-col items-center justify-center h-full space-y-2">
              {/* Profile icon */}
              <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
