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
  const defaultText = isPositive ? "text-green-700" : "text-red-700";

  const Icon = icon === "down" ? ArrowDown : ArrowUp;

  return (
    <div className="rounded-md border bg-gray-50 text-card-foreground shadow-sm p-6">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>

      <div className="flex items-center gap-2 mt-2">
        <h2 className="text-2xl font-bold">{amount}</h2>

        <span
          className={`flex items-center gap-1 px-2 py-0.5 text-sm font-medium rounded-full ${bgColor || defaultBg} ${textColor || defaultText}`}
        >
          <Icon size={14} strokeWidth={3} className={textColor || defaultText} />
          {percentage}
        </span>
      </div>
    </div>
  );
};

export default DashboardCard;
