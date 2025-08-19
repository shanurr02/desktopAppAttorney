import React from "react";
import Title from "./Title";
import FilterButton from "./FilterButton";
import DateSelector from "./DateSelector";

const Navbar2: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-6 py-3  bg-white">
      {/* Left */}
      <Title text="Business Activity" />

      {/* Right */}
      <div className="flex items-center gap-2">
        <FilterButton label="30 Days" isActive={true} />
        <FilterButton label="90 Days" />
        <DateSelector onClick={() => alert("Open date picker")} />
      </div>
    </div>
  );
};

export default Navbar2;
