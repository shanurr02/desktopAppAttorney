import React from "react";

interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
  return <h2 className="text-xl font-semibold text-[#101828CC]">{text}</h2>;
};

export default Title;
