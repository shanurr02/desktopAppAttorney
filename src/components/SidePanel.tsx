import React from "react";
import { Home, DollarSign, Layers, Send, ChartPie, ArrowLeftRight, RotateCcw, BarChart3 } from "lucide-react";

type SidePanelProps = {
  onSelect: (page: string) => void;
  activePage: string;
};

const menuItems = [
  { id: "home", icon: <Home size={20} /> },
  { id: "finance", icon: <DollarSign size={20} /> },
  { id: "layers", icon: <Layers size={20} /> },
  { id: "send", icon: <Send size={20} /> },
  { id: "timer", icon: <ChartPie size={20} /> },     // ✅ fixed
  { id: "compass", icon: <ArrowLeftRight size={20} /> }, // ✅ fixed
  { id: "refresh", icon: <RotateCcw size={20} /> },
  { id: "chart", icon: <BarChart3 size={20} /> },
];

const SidePanel: React.FC<SidePanelProps> = ({ onSelect, activePage }) => {
  return (
    <div className="h-screen w-12 bg-white flex flex-col items-center py-4 shadow">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`p-2 my-2 rounded-lg transition ${
            activePage === item.id ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
};

export default SidePanel;
