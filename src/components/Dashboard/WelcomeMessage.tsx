import React from "react";

interface WelcomeMessageProps {
  name: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ name }) => {
  return (
    <h1 className="text-xl font-semibold text-gray-900">
      Welcome back, {name}
    </h1>
  );
};

export default WelcomeMessage;
