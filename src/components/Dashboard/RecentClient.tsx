import React from "react";
import { Clock } from "lucide-react"; // clock icon

// Define type for client data
interface Client {
  name: string;
  status: "Client Invited" | "Application Started" | "Approved";
  timeAgo: string;
  avatar: string;
}

// Props for component
interface RecentClientProps {
  clients: Client[];
}

const RecentClient: React.FC<RecentClientProps> = ({ clients }) => {
  // color mapping for statuses
  const statusColors: Record<Client["status"], string> = {
    "Client Invited": "text-[#C08B00]",
    "Application Started": "text-[#1858FA]",
    "Approved": "text-[#21C55D]",
  };

  return (
    <div className="bg-gray-50 border rounded-md shadow p-4 ">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-gray-800">Recent clients</h2>
        <button className={`py-2 px-4 rounded-md text-sm font-medium transition bg-gray-100 hover:bg-slate-200 text-gray-900 `} >View all</button>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-64 md:max-h-80 lg:max-h-[400px] pr-1">
        {clients.map((client, idx) => (
          <div key={idx} className="flex items-top space-x-3 border-b-2 border-gray-100 pb-4">
            <img
              src={client.avatar}
              alt={client.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-800 text-sm">{client.name}</p>
              <p className={`text-xs ${statusColors[client.status]}`}>
                {client.status}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <Clock size={12} className="text-gray-400" />
                <span className="text-gray-500 text-xs">{client.timeAgo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentClient;

// Example usage

