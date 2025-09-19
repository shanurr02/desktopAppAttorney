import React from "react";
import { Clock, ArrowRight, Zap, Users, DollarSign, BarChart3 } from "lucide-react";

const ComingSoon: React.FC = () => {
  const features = [
    {
      icon: DollarSign,
      title: "Collect Payment",
      description: "Streamlined payment collection system for attorneys and clients"
    },
    {
      icon: Users,
      title: "Invite Client",
      description: "Easy client invitation and onboarding process"
    },
    {
      icon: BarChart3,
      title: "Reports",
      description: "Comprehensive reporting and analytics dashboard"
    },
    {
      icon: ArrowRight,
      title: "Transactions",
      description: "Complete transaction history and management"
    }
  ];

  return (
    <div className="px-2 min-h-full py-2">
      {/* Header Section */}
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <Clock className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Coming Soon
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          We're working hard to bring you amazing new features. 
          Stay tuned for updates on our latest developments.
        </p>

        {/* Status Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-8">
          <Zap className="w-4 h-4 mr-2" />
          In Development
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
          Upcoming Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-4">
                  <Icon className="w-6 h-6 text-gray-600" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Section */}
      <div className="max-w-4xl mx-auto mt-16">
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Development Progress
          </h3>
          
          <div className="space-y-6">
            {/* Progress Item */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Dashboard & Analytics</span>
              </div>
              <span className="text-sm text-green-600 font-medium">Complete</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Loan Application System</span>
              </div>
              <span className="text-sm text-green-600 font-medium">Complete</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Payment Collection</span>
              </div>
              <span className="text-sm text-yellow-600 font-medium">In Progress</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                <span className="text-gray-700">Client Invitation System</span>
              </div>
              <span className="text-sm text-gray-500 font-medium">Planned</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                <span className="text-gray-700">Advanced Reporting</span>
              </div>
              <span className="text-sm text-gray-500 font-medium">Planned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Stay Updated
          </h3>
          <p className="text-gray-600 mb-6">
            Get notified when new features are released and stay ahead of the curve.
          </p>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200">
            Notify Me
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
