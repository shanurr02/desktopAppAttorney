import React, { useState } from "react";
import DateSelector from "../components/Dashboard/DateSelector";
import FilterButton from "../components/Dashboard/FilterButton";
import Title from "../components/Dashboard/Title";
import profileImage from '../assets/profile.png';
import DashboardCard from "../components/Dashboard/DashboardCard";
import NavbarDashboard from "../components/Dashboard/NavbarDashboard";
import RecentClient from "../components/Dashboard/RecentClient";
import RevenueChart from "../components/Dashboard/RevenueChart";

// Define type for client
interface Client {
  name: string;
  status: "Client Invited" | "Application Started" | "Approved";
  timeAgo: string;
  avatar: string;
}

const sampleClients: Client[] = [
  { 
    name: "Aliah Lane", 
    status: "Client Invited", 
    timeAgo: "2 hours ago",
    avatar: profileImage
  },
  { 
    name: "Lana Steiner", 
    status: "Client Invited", 
    timeAgo: "2 hours ago",
    avatar: profileImage
  },
  { 
    name: "Koray Okumus", 
    status: "Application Started", 
    timeAgo: "2 hours ago",
    avatar: profileImage
  },
  { 
    name: "Joshua Wilson", 
    status: "Approved", 
    timeAgo: "2 hours ago",
    avatar: profileImage
  },
  { 
    name: "Joshua Wilson", 
    status: "Approved", 
    timeAgo: "2 hours ago",
    avatar: profileImage
  },
];

const Dashboard: React.FC = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });

  const [activeFilter, setActiveFilter] = useState<"30" | "90" | "custom">("30");

  const handleDateSelect = (startDate: Date | null, endDate: Date | null) => {
    setSelectedDateRange({ startDate, endDate });
    if (startDate && endDate) {
      setActiveFilter("custom");
    }
    console.log("Date range selected:", { startDate, endDate });
  };

  const handleFilterClick = (filter: "30" | "90") => {
    setActiveFilter(filter);
    setSelectedDateRange({ startDate: null, endDate: null });
    console.log("Filter changed to:", filter);
  };

  return (
    <div className="px-2 min-h-full py-2">
      {/* 🔹 Top Navbar */}
      <NavbarDashboard />

      {/* 🔹 Secondary Navbar (Business Activity) */}
      <div className="flex items-center justify-between py-4  bg-gray-100">
      {/* Left */}
      <Title text="Business Activity" />

      {/* Right */}
      <div className="flex items-center gap-2">
        <FilterButton 
          label="30 Days" 
          isActive={activeFilter === "30"} 
          onClick={() => handleFilterClick("30")}
        />
        <FilterButton 
          label="90 Days" 
          isActive={activeFilter === "90"} 
          onClick={() => handleFilterClick("90")}
        />
        <DateSelector onDateSelect={handleDateSelect} />
      </div>
    </div>


      <div className="space-y-3"> 
        {/* 🔹 Stats Cards */}
      <div className="pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mx-0">
        <DashboardCard
          title="Today's Revenue"
          amount="$68,768"
          percentage="10%" 
          icon="up"
          bgColor="bg-green-100"
          textColor="text-green-700"
        />
        <DashboardCard
          title="Case Funding"
          amount="$48,768"
          percentage="2%"
          icon="down"
          bgColor="bg-red-100"
          textColor="text-red-700"
        />
        <DashboardCard
          title="Active Application"
          amount="32"
          percentage="12%"
          icon="up"
          bgColor="bg-green-100"
          textColor="text-green-700"
        />
        <DashboardCard
          title="Funded Cases"
          amount="12"
          percentage="2%"
          icon="down"
          bgColor="bg-red-100"
          textColor="text-red-700"
        />
      </div>

      {/* 🔹 Chart + Recent Clients in one row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Revenue Chart takes 2/3 width */}
        <div className="lg:col-span-3 bg-gray-50 border rounded-lg shadow p-4 relative">
        <RevenueChart />
        </div>

        {/* Recent Clients takes 1/3 width */}
        <RecentClient clients={sampleClients} />
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
