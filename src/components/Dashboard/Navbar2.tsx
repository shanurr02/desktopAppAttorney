import React from "react";
import Title from "./Title";
import FilterButton from "./FilterButton";
import DateSelector from "./DateSelector";

const Navbar2: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-4 py-4  bg-gray-100">
      {/* Left */}
      <Title text="Business Activity" />

      {/* Right */}
      <div className="flex items-center gap-2">
        <FilterButton label="30 Days" isActive={true} />
        <FilterButton label="90 Days" isActive={true} />
        <DateSelector onClick={() => alert("Open date picker")} />
      </div>
    </div>
  );
};

export default Navbar2;
