import React from 'react';
import { Outlet } from 'react-router-dom';
import iconImage from './assets/logo/icon.png';

// Layout component using Outlet
const Layout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            {/* Main Content */}
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;