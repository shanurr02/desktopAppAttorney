import React, { useState } from "react";
import SidePanel from "../components/SidePanel";
import Dashboard from "./Dashboard";
import CustomTitleBar from "../components/CustomTitleBar";

const LayoutDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <Dashboard />;
      default:
        return <div className="bg-[#1d1f1f]">coming soon</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen h-screen bg-gray-100">
      {/* Top title bar - fixed height */}
      <div className="flex-shrink-0">
        <CustomTitleBar title="Case Funders" />
      </div>

      {/* Main layout with sidebar and content */}
      <div className="flex flex-1 min-h-0">
        {/* Side panel - positioned below title bar */}
        <div className="flex-shrink-0 h-full relative z-10">
          <SidePanel activePage={activePage} onSelect={setActivePage} />
        </div>

    <div className="flex-1 min-h-0 overflow-y-auto bg-[#1d1f1f] relative z-0">

        {/* Main content area */}
        <main className="bg-gray-100 px-2 rounded-md relative z-0">
          {renderPage()}
        </main>

    </div>
      </div>
    </div>
  );
};

export default LayoutDashboard;
