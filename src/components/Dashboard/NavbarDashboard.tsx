import React from "react";
import WelcomeMessage from "./WelcomeMessage";
import InviteButton from "./InviteButton";
import SearchBox from "./SearchBox";

const NavbarDashboard: React.FC = () => {
  return (
    <div className="bg-white px-6"> 
      {/* Inner container with border under content */}
      <div className="flex items-center justify-between py-4 border-b">
        {/* Left */}
        <WelcomeMessage name="Attorney" />

        {/* Right */}
        <div className="flex items-center gap-4">
          <InviteButton onClick={() => alert("Invite clicked")} />
          <SearchBox onChange={(val) => console.log("Searching:", val)} />
        </div>
      </div>
    </div>
  );
};

export default NavbarDashboard;
