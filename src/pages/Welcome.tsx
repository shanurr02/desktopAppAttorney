import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import iconImage from '../assets/logo/icon.png';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/app/login');
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="p-8 w-full max-w-md text-center"> 
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <img src={iconImage} alt="Case Funders" className="w-16 h-16" />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">Case Funders</h1>
          <p className="text-gray-600 font-medium">Legal case funding made simple</p>
        </div>

        {/* Loader */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
