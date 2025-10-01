import React from "react";
import { Send } from "lucide-react";

interface InviteButtonProps {
  onClick?: () => void;
}

const InviteButton: React.FC<InviteButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-[10px] px-4 rounded-md text-sm font-medium transition-all duration-150"
    >
      <Send size={16} />
    
    </button>
  );
};

export default InviteButton;

