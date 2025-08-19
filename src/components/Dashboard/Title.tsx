import React from "react";

interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
  return <h2 className="text-lg font-semibold text-gray-700">{text}</h2>;
};

export default Title;
