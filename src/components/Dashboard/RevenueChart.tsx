import React, { useState, useEffect, useRef } from "react";
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
import FilterButton from "./FilterButton";
import DateSelector from "./DateSelector";

const originalChartData = {
  '30': {
    labels: ['2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30'],
    datasets: [
      {
        label: 'Payment Processing Revenue',
        data: [2500, 3100, 1000, 1500, 1800, 700, 2900, 3100, 3300, 3300, 3200, 2300, 2100, 3000, 3000],
        backgroundColor: '#22C55E',
        borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
        maxBarThickness: 32,
        stack: 'stack1'
      },
      {
        label: 'Case Funding Revenue',
        data: [1000, 1600, 700, 700, 500, 200, 1200, 1300, 1400, 1500, 1300, 1000, 900, 1500, 1400],
        backgroundColor: '#86EFAC',
        borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 4, bottomRight: 4 },
        maxBarThickness: 32,
        stack: 'stack1'
      }
    ]
  },
  '90': {
    labels: Array.from({ length: 15 }, (_, i) => ((i + 1) * 6).toString()),
    datasets: [
      {
        label: 'Payment Processing Revenue',
        data: [120, 100, 90, 110, 130, 120, 140, 150, 160, 170, 180, 190, 200, 210, 220],
        backgroundColor: '#22C55E',
        borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
        maxBarThickness: 32,
        stack: 'stack1'
      },
      {
        label: 'Case Funding Revenue',
        data: [60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200],
        backgroundColor: '#86EFAC',
        borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 4, bottomRight: 4 },
        maxBarThickness: 32,
        stack: 'stack1'
      }
    ]
  }
};

const RevenueChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState("30");
  const [dateFilter, setDateFilter] = useState<{ startDay: number; endDay: number } | null>(null);

  // Get current chart data (with or without date filter)
  const getCurrentChartData = () => {
    const baseData = originalChartData[activeTab as keyof typeof originalChartData];

    if (!dateFilter) {
      return baseData;
    }

    const { startDay, endDay } = dateFilter;
    const filteredIndexes = baseData.labels
      .map((label, idx) => ({ label: parseInt(label, 10), idx }))
      .filter(obj => obj.label >= startDay && obj.label <= endDay)
      .map(obj => obj.idx);

    return {
      labels: filteredIndexes.map(idx => baseData.labels[idx]),
      datasets: baseData.datasets.map(ds => ({
        ...ds,
        data: filteredIndexes.map(idx => ds.data[idx])
      }))
    };
  };

  const currentData = getCurrentChartData();

  // Convert the data format for Recharts
  const chartData = currentData.labels.map((label, index) => ({
    day: label,
    payment: currentData.datasets[0].data[index],
    case: currentData.datasets[1].data[index],
  }));

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setDateFilter(null); // Reset date filter when changing tabs
  };

  const handleDateSelector = () => {
    // This would open a date picker modal in a real implementation
    alert("Open date picker");
  };

  return (
    <div>
      {/* Chart Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4" id="tab-buttons">
          <button
            className={`py-2 px-4 rounded-md text-sm font-medium transition ${
              activeTab === "30" 
                ? "bg-gray-100 text-gray-700" 
                : "text-gray-500 hover:bg-gray-50"
            }`}
            onClick={() => handleTabChange("30")}
          >
            30 Days
          </button>
          <button
            className={`py-2 px-4 rounded-md text-sm font-medium transition  ${
              
              activeTab === "90" 
                ? "bg-gray-100 text-gray-700" 
                : "text-gray-500 hover:bg-gray-50"
            }`}
            onClick={() => handleTabChange("90")}
          >
            90 Days
          </button>
        </div>
        <button
         className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
         onClick={handleDateSelector}
        >
          <i className="fas fa-calendar text-sm"></i>
          <span>Select dates</span>
        </button>
      </div>

      {/* Chart Legend */}
      <div className="flex justify-end space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600 text-sm">Payment Processing Revenue</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-300 rounded-full"></div>
          <span className="text-gray-600 text-sm">Case Funding Revenue</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barCategoryGap="15%"
            margin={{ top: 40, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#6B7280" }}
              label={{ 
                value: "Days", 
                position: "insideBottom", 
                offset: -10,
                style: { textAnchor: "middle", fill: "#6B7280", fontSize: "12px" }
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickFormatter={(value) => `$${value}`}
              domain={[0, 5000]}
              ticks={[0, 1000, 2000, 3000, 4000, 5000]}
              label={{
                value: "Amount in dollars",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#6B7280", fontSize: "12px" },
              }}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              labelFormatter={(label) => `Day ${label}`}
              cursor={{ fill: "rgba(0,0,0,0.02)" }}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar
              dataKey="payment"
              name="Payment Processing Revenue"
              stackId="a"
              fill="#22C55E"
              radius={[0, 0, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="case"
              name="Case Funding Revenue"
              stackId="a"
              fill="#86EFAC"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
