import React, { useState } from "react";
import DateSelector from "../components/Dashboard/DateSelector";
import FilterButton from "../components/Dashboard/FilterButton";
import Title from "../components/Dashboard/Title";
import profileImage from '../assets/profile.png';
import DashboardCard from "../components/Dashboard/DashboardCard";
import NavbarDashboard from "../components/Dashboard/NavbarDashboard";
import RecentClient from "../components/Dashboard/RecentClient";
import RevenueChart from "../components/Dashboard/RevenueChart";
import { useDashboard } from "../hooks";
import { LoaderCircle } from "lucide-react";

// Define type for client (matching the RecentClient component interface)
interface Client {
  name: string;
  status: "Client Invited" | "Application Started" | "Approved";
  timeAgo: string;
  avatar: string;
}

interface DashboardProps {
  onSelect?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelect }) => {
  const [selectedDateRange, setSelectedDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });

  const [activeFilter, setActiveFilter] = useState<"30" | "90" | "custom">("30");

  // Helper function to map API status to component status
  const mapApiStatusToComponentStatus = (apiStatus: string): Client['status'] => {
    switch (apiStatus.toLowerCase()) {
      case 'client invited':
        return 'Client Invited';
      case 'application started':
        return 'Application Started';
      case 'approved':
      case 'funded':
        return 'Approved';
      default:
        return 'Application Started'; // Default fallback
    }
  };

  // Use dashboard hook to fetch real data
  const {
    activeClients,
    recentClients,
    isLoading,
    isRefreshing,
    isError,
    error,
    refreshDashboard,
  } = useDashboard();

  // Transform recent clients data to match the Client interface
  const transformedClients: Client[] = recentClients.map((client) => ({
    name: client.fullName,
    status: mapApiStatusToComponentStatus(client.status),
    timeAgo: client.formattedDate,
    avatar: profileImage, // Using default avatar for now
  }));

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div> */}
          <LoaderCircle className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading dashboard data...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="h-[98%] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Failed to load dashboard</h2>
          <p className="text-gray-600 mb-4">{error?.message || 'An error occurred while loading dashboard data'}</p>
          <button 
            onClick={refreshDashboard}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[98%]">
      {/* 🔹 Top Navbar */}
      <NavbarDashboard onSelect={onSelect || (() => {})} />

      {/* 🔹 Secondary Navbar (Business Activity) */}
      <div className="flex items-center justify-between py-4 bg-gray-100">
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
          {/* Refresh button */}
          {/* <button
            onClick={refreshDashboard}
            disabled={isRefreshing}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button> */}
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
          title="Active Clients"
          amount={activeClients?.active_clients?.toString() || "0"}
          percentage="12%"
          icon="up"
          bgColor="bg-green-100"
          textColor="text-green-700"
        />
        <DashboardCard
          title="Applications Started"
          amount={activeClients?.application_started?.toString() || "0"}
          percentage="2%"
          icon="down"
          bgColor="bg-red-100"
          textColor="text-red-700"
        />
      </div>

      {/* 🔹 Chart + Recent Clients in one row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Revenue Chart takes 2/3 width */}
        <div className="lg:col-span-3 bg-gray-50 border rounded-md shadow p-4 relative">
        <RevenueChart />
        </div>

        {/* Recent Clients takes 1/3 width */}
        <RecentClient clients={transformedClients} />
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
