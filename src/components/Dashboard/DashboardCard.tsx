import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface DashboardCardProps {
  title: string;
  amount: string;
  percentage: string;
  isPositive?: boolean; // fallback logic
  bgColor?: string;     // Tailwind background (e.g. "bg-green-50")
  textColor?: string;   // Tailwind text color (e.g. "text-green-600")
  icon?: "up" | "down"; // choose arrow
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  amount,
  percentage,
  isPositive = true,
  bgColor,
  textColor,
  icon,
}) => {
  // default fallback colors
  const defaultBg = isPositive ? "bg-green-50" : "bg-red-50";
  const defaultText = isPositive ? "text-green-600" : "text-red-600";

  const Icon = icon === "down" ? ArrowDown : ArrowUp;

  return (
    <div className="rounded-lg shadow-sm border border-gray-200 bg-white p-4 ">
      <p className="text-gray-600 text-sm">{title}</p>

      <div className="flex items-center gap-2 mt-2">
        <h2 className="text-2xl font-bold text-gray-900">{amount}</h2>

        <span
          className={`flex items-center gap-1 px-2 py-0.5 text-sm font-medium rounded-full ${bgColor || defaultBg} ${textColor || defaultText}`}
        >
          <Icon size={14} className={textColor || defaultText} />
          {percentage}
        </span>
      </div>
    </div>
  );
};

export default DashboardCard;
