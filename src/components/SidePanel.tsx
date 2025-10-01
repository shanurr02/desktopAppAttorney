import {
  ArrowLeftRight,
  BarChart3,
  Bell,
  DollarSign,
  Home,
  Layers,
  LogOut,
  Menu,
  Send,
  Settings,
  User,
  File,
  SquareMenu,
  Users
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Tooltip } from "react-tooltip";

type SidePanelProps = {
  onSelect: (page: string) => void;
  activePage: string;
};

// Memoized menu items to prevent unnecessary re-renders
const menuItems = [
  { id: "menu", label: "Toggle Menu", icon: Menu, isHamburger: true },
  { id: "home", label: "Dashboard", icon: Home, isHamburger: false },
  { id: "finance", label: "Collect Payment", icon: DollarSign, isHamburger: false },
  { id: "layers", label: "Start Application", icon: Layers, isHamburger: false },
  { id: "invite", label: "Invite Client", icon: Send, isHamburger: false },
  { id: "refer", label: "Refer Colleague", icon: Users, isHamburger: false },
  // { id: "timer", label: "Payment Plans", icon: ChartPie, isHamburger: false },
  { id: "compass", label: "Transactions", icon: ArrowLeftRight, isHamburger: false },
  // { id: "refresh", label: "Refund", icon: RotateCcw, isHamburger: false },
  { id: "chart", label: "Reports", icon: BarChart3, isHamburger: false },
  { id: "all", label: "All Applications", icon: SquareMenu  , isHamburger: false },
] as const;

const SidePanel: React.FC<SidePanelProps> = ({ onSelect, activePage }) => {
  const [expanded, setExpanded] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (expanded || showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded, showProfileMenu]);

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

  const handleLogoutClick = useCallback(async () => {
    console.log('Logout button clicked!');
    try {
      await logout();
      navigate('/app/login');
      setShowProfileMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate to login even if logout fails
      navigate('/app/login');
      setShowProfileMenu(false);
    }
  }, [logout, navigate]);

  const handleSettingsClick = useCallback(() => {
    console.log('Settings clicked');
  }, []);

  const handleProfileClick = useCallback(() => {
    setShowProfileMenu(prev => !prev);
  }, []);

  // Memoized classes to prevent recalculation - positioned below title bar
  const sidebarClasses = useMemo(() =>
    `bg-[#1d1f1f] backdrop-blur-sm text-white flex flex-col transition-all duration-200 ease-out z-50 ${expanded ? "w-64 shadow-2xl" : "w-16"
    }`, [expanded]
  );

  const headerClasses = useMemo(() =>
    `flex items-center justify-center h-16 border-b border-gray-700/30 px-4 bg-[#161717]/40`, []
  );

  return (
    <div className="min-w-16 h-full">
      <div ref={sidebarRef} className={`${sidebarClasses} h-full`}>
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
                  data-tooltip-id={`tooltip-${item.id}`}
                  data-tooltip-content={!expanded ? item.label : ""}
                  className={`w-full flex items-center ${expanded ? "justify-start gap-2" : "justify-center"}  py-2 px-4 rounded-md text-sm font-medium transition-all duration-150 ease-out text-gray-300 hover:bg-[#161717]/50 hover:text-white`}
                >
                  <Icon size={20} className="flex-shrink-0 text-center" />
                  <div
                    className={`overflow-hidden transition-all duration-200 ease-out ${expanded ? "w-auto opacity-100" : "w-0 opacity-0"
                      }`}
                  >
                    <span className="text-sm whitespace-nowrap select-none">{item.label}</span>
                  </div>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleMenuSelect(item.id)}
                data-tooltip-id={`tooltip-${item.id}`}
                data-tooltip-content={!expanded ? item.label : ""}
                className={`w-full flex items-center ${expanded ? "justify-start gap-2" : "justify-center"}  py-2 px-4 rounded-md text-sm font-medium transition-all duration-150 ease-out
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
              </button>
            );
          })}
        </nav>

        {/* Footer with profile and settings */}
        <div className={`py-2 border-t border-gray-700/30 bg-[#161717]/40 relative`} ref={profileMenuRef}>
          {/* Expanded state footer */}
          <div className={`flex items-center w-full ${expanded ? "h-12 px-4" : "h-12 justify-center "} relative`}>
            <button
              onClick={handleProfileClick}
              data-tooltip-id="tooltip-profile"
              data-tooltip-content={!expanded ? (currentUser?.name || currentUser?.first_name || 'Profile') : ""}
              className={`flex items-center transition-all duration-150 ease-out rounded-md
                ${expanded
                  ? "py-2 w-full px-4 hover:bg-[#161717]/50"
                  : "h-8 w-8 justify-center bg-orange-500 hover:bg-orange-600"
                }`
              }
            >
              <div className="relative">
                <div className="rounded-md flex items-center justify-center h-8 w-8 bg-orange-500">
                  {currentUser?.first_name
                    ? (
                      <span className="text-xs font-medium text-white">
                        {currentUser.first_name.charAt(0).toUpperCase()}
                      </span>
                    )
                    : (
                      <User className="h-4 w-4 text-white" />
                    )
                  }
                </div>
              </div>
              {expanded && (
                <div className="ml-3 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {currentUser?.name || currentUser?.first_name || 'Profile'}
                  </p>
                </div>
              )}
            </button>
          </div>

          {/* Single Profile Context Menu - positioned absolutely with high z-index */}
          {showProfileMenu && (
            <div className={`absolute w-48 bg-[#161717] backdrop-blur-sm border border-gray-700/30 rounded-md shadow-lg z-[999999] ${expanded ? 'bottom-4 left-44' : 'bottom-4 left-12'}`}>
              <div className="py-1">
                {/* User Info Section */}
                <div className="px-4 py-2 border-b border-gray-700/30">
                  <p className="text-sm font-medium text-white truncate">
                    {currentUser?.name || currentUser?.first_name || 'User'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {currentUser?.email}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('View Profile clicked');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-[#161717]/50 hover:text-white flex items-center"
                >
                  <User className="h-4 w-4 mr-3" />
                  View Profile
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Settings clicked');
                    handleSettingsClick();
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-[#161717]/50 hover:text-white flex items-center"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Notifications clicked');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-[#161717]/50 hover:text-white flex items-center"
                >
                  <Bell className="h-4 w-4 mr-3" />
                  Notifications
                </button>
                <div className="border-t border-gray-700/30 my-1"></div>
                <button
                  onClick={(e) => {
                    console.log('Logout button clicked directly!');
                    e.preventDefault();
                    e.stopPropagation();
                    handleLogoutClick();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tooltip components */}
      {menuItems.map((item) => (
        <Tooltip
          key={`tooltip-${item.id}`}
          id={`tooltip-${item.id}`}
          place="right"
          style={{
            backgroundColor: '#161717',
            color: 'white',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            zIndex: 9999
          }}
          opacity={0.95}
        />
      ))}
      
      <Tooltip
        id="tooltip-profile"
        place="right"
        style={{
          backgroundColor: '#161717',
          color: 'white',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          zIndex: 9999
        }}
        opacity={0.95}
      />
    </div>
  );
};

export default SidePanel;
