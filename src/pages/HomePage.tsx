import React, { useState } from "react";
import SidePanel from "../components/SidePanel";
import Dashboard from "./Dashboard";
import CustomTitleBar from "../components/CustomTitleBar";

const HomePage: React.FC = () => {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return (
          <Dashboard />
        );
      default:
        return <div>coming soon</div>;
    }
  };

  return (
    <div className="flex flex-col max-h-screen">
      {/* Top title bar */}
      <CustomTitleBar title="Case Funders" />

      {/* Main layout with sidebar and content */}
      <div className="relative min-h-full flex flex-1">
        {/* Side panel stays fixed without scrolling */}
        <div className="min-h-full flex-shrink-0">
          <SidePanel activePage={activePage} onSelect={setActivePage} />
        </div>

        {/* Main content scrolls independently */}
        <main className="flex-1 overflow-y-auto min-h-full rounded-md bg-gray-100">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
