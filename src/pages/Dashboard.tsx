import React from "react";
import DashboardCard from "../components/Dashboard/DashboardCard";
import NavbarDashboard from "../components/Dashboard/NavbarDashboard";
import Navbar2 from "../components/Dashboard/Navbar2";
import RevenueChart from "../components/Dashboard/RevenueChart";
import RecentClient from "../components/Dashboard/RecentClient";
import profileImage from '../assets/profile.png';

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
  return (
    <div>
      {/* 🔹 Top Navbar */}
      <NavbarDashboard />

      {/* 🔹 Secondary Navbar (Business Activity) */}
      <Navbar2 />

      {/* 🔹 Stats Cards */}
      <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mx-0">
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
      <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Revenue Chart takes 2/3 width */}
        <div className="lg:col-span-3 bg-gray-50 border rounded-lg shadow p-4">
          <RevenueChart />
        </div>

        {/* Recent Clients takes 1/3 width */}
        <RecentClient clients={sampleClients} />
      </div>
    </div>
  );
};

export default Dashboard;
