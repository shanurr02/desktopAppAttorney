import React from "react";
import { Clock } from "lucide-react"; // clock icon

// Define type for client data
interface Client {
  name: string;
  status: "Client Invited" | "Application Started" | "Approved";
  timeAgo: string;
}

// Props for component
interface RecentClientProps {
  clients: Client[];
}

const RecentClient: React.FC<RecentClientProps> = ({ clients }) => {
  // color mapping for statuses
  const statusColors: Record<Client["status"], string> = {
    "Client Invited": "text-yellow-600",
    "Application Started": "text-blue-600",
    "Approved": "text-green-600",
  };

  return (
    <div className=" bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-gray-800">Recent client</h2>
        <button className="text-xs text-blue-600 hover:underline">View all</button>
      </div>

      <ul className="space-y-4">
        {clients.map((client, idx) => (
          <li key={idx} className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {client.name}
            </span>
            <span className={`text-xs font-medium ${statusColors[client.status]}`}>
              {client.status}
            </span>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Clock size={12} className="mr-1" />
              {client.timeAgo}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentClient;

// Example usage

