import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar } from "lucide-react";

const data = [
  { day: 2, payment: 2500, case: 1000 },
  { day: 4, payment: 3100, case: 1200 },
  { day: 6, payment: 1000, case: 500 },
  { day: 8, payment: 1500, case: 700 },
  { day: 12, payment: 600, case: 200 },
  { day: 14, payment: 2800, case: 1200 },
  { day: 16, payment: 3200, case: 1300 },
  { day: 18, payment: 3300, case: 1400 },
  { day: 20, payment: 3250, case: 1300 },
  { day: 22, payment: 3100, case: 1200 },
  { day: 24, payment: 2400, case: 800 },
  { day: 26, payment: 2100, case: 900 },
  { day: 28, payment: 2000, case: 1000 },
  { day: 30, payment: 3100, case: 1200 },
];

const RevenueChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState("30 Days");

  return (
    <div className="">
      {/* Header with Tabs + Date Picker */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-3">
          {["30 Days", "90 Days"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-gray-200 text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button className="flex items-center border rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 shadow-sm">
          <Calendar className="w-4 h-4 mr-2" />
          Select dates
        </button>
      </div>

      {/* Chart */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barCategoryGap="20%"
            margin={{ top: 20, right: 10, left: 10, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              label={{ value: "Days", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              label={{
                value: "Amount in dollars",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
                offset: -5,
              }}
            />
            <Tooltip
              formatter={(value: number) => `$${value.toLocaleString()}`}
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: "10px" }}
            />
            <Bar
              dataKey="payment"
              name="Payment Processing Revenue"
              stackId="a"
              fill="#17ce3c"
              barSize={15}
            />
            <Bar
              dataKey="case"
              name="Case Funding Revenue"
              stackId="a"
              fill="#9ddca9"
              barSize={15}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
