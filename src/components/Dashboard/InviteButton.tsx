import React from "react";
import { Send } from "lucide-react";

interface InviteButtonProps {
  onClick?: () => void;
}

const InviteButton: React.FC<InviteButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
    >
      <Send size={16} />
    
    </button>
  );
};

export default InviteButton;

