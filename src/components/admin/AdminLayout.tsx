
import React, { ReactNode } from 'react';
import AdminNavbar from './AdminNavbar';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminNavbar />
      <div className="container py-6 flex-1">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
