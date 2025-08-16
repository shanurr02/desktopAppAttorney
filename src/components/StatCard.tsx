import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  percentage: number;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, percentage }) => {
  const isPositive = percentage >= 0;

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm w-fit">
      <p className="text-sm text-gray-600">{title}</p>
      <div className="flex items-center gap-2 mt-1">
        <h2 className="text-2xl font-bold">${value}</h2>
        <span
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            isPositive
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default StatCard;
