import React, { useState } from "react";
import SidePanel from "../components/SidePanel";

const Dashboard: React.FC = () => {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <div>🏠 Home Content</div>;
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
    <div className="flex">
      <SidePanel activePage={activePage} onSelect={setActivePage} />
      <main className="flex-1 p-6">{renderPage()}</main>
    </div>
  );
};

export default Dashboard;
