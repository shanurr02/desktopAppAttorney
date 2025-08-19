import React, { useState } from "react";
import SidePanel from "../components/SidePanel";
import Dashboard from "./Dashboard";

const HomePage: React.FC = () => {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return (
          <div>
            <Dashboard />
          </div>
        );
      case "finance":
        return <div>💰 Finance Content</div>;
      case "layers":
        return <div>📦 Layers Content</div>;
      case "send":
        return <div>📤 Send Content</div>;
      case "clock":
        return <div>⏰ Clock Content</div>;
      case "globe":
        return <div>🌍 Globe Content</div>;
      case "refresh":
        return <div>🔄 Refresh Content</div>;
      case "chart":
        return <div>📊 Chart Content</div>;
      default:
        return <div>Select a page</div>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Side panel stays fixed without scrolling */}
      <div className="h-screen flex-shrink-0">
        <SidePanel activePage={activePage} onSelect={setActivePage} />
      </div>

      {/* Main content scrolls independently */}
      <main className="flex-1 p-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
};

export default HomePage;
