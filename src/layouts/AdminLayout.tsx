import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/menus/AdminSidebar';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main Content Area */}
      <main className="flex-1 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;