import React, { useState } from "react";
import {
  Home,
  DollarSign,
  Layers,
  Send,
  ChartPie,
  ArrowLeftRight,
  RotateCcw,
  BarChart3,
  Menu, // hamburger
} from "lucide-react";

type SidePanelProps = {
  onSelect: (page: string) => void;
  activePage: string;
};

// add hamburger as first item in menu
const menuItems = [
  { id: "menu", label: "", icon: Menu, isHamburger: true },
  { id: "home", label: "Dashboard", icon: Home },
  { id: "finance", label: "Process Payment", icon: DollarSign },
  { id: "layers", label: "Start Application", icon: Layers },
  { id: "send", label: "Invite Client", icon: Send },
  { id: "timer", label: "Payment Plans", icon: ChartPie },
  { id: "compass", label: "Transactions", icon: ArrowLeftRight },
  { id: "refresh", label: "Refund", icon: RotateCcw },
  { id: "chart", label: "Reports", icon: BarChart3 },
];

const SidePanel: React.FC<SidePanelProps> = ({ onSelect, activePage }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`h-screen bg-white shadow flex flex-col py-4 px-1 transition-all duration-300 ${
        expanded ? "w-48" : "w-12"
      }`}
    >
      {menuItems.map((item) => {
        const Icon = item.icon;

        // special case for hamburger
        if (item.isHamburger) {
          return (
            <button
              key={item.id}
              onClick={() => setExpanded((prev) => !prev)}
              className="flex items-center gap-3 p-2 my-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <Icon size={20} />
              {expanded && <span className="text-sm">{item.label}</span>}
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => {
              onSelect(item.id);
              setExpanded(true); // expand when icon clicked
            }}
            className={`flex items-center gap-3 p-2 my-2 rounded-lg transition 
              ${
                activePage === item.id
                  ? "bg-gray-200 text-black"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            <Icon size={20} />
            {expanded && <span className="text-sm">{item.label}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default SidePanel;
