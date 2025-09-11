import React, { useEffect, useState } from "react";
import WelcomeMessage from "./WelcomeMessage";
import InviteButton from "./InviteButton";
import SearchBox from "./SearchBox";

// Get user from localStorage (as set by auth.ts after login)
function getUserName(): string {
  try {
    const userData = localStorage.getItem("user_data");
    if (!userData) return "Attorney";
    const user = JSON.parse(userData);
    // Prefer first_name + last_name, fallback to email, fallback to "Attorney"
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.first_name) return user.first_name;
    if (user.email) return user.email;
    return "Attorney";
  } catch {
    return "Attorney";
  }
}

const NavbarDashboard: React.FC = () => {
  const [userName, setUserName] = useState<string>("Attorney");

  useEffect(() => {
    setUserName(getUserName());
  }, []);

  return (
    <div className="bg-gray-100 border-b"> 
      {/* Inner container with border under content */}
      <div className="flex items-center justify-between py-3 ">
        {/* Left */}
        <WelcomeMessage name={userName} />

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
