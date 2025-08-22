import React from "react";
import WelcomeMessage from "./WelcomeMessage";
import InviteButton from "./InviteButton";
import SearchBox from "./SearchBox";

const NavbarDashboard: React.FC = () => {
  return (
    <div className="bg-white border-b px-4"> 
      {/* Inner container with border under content */}
      <div className="flex items-center justify-between py-3 ">
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
