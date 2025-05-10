
import React, { ReactNode } from 'react';
import AdminNavbar from './AdminNavbar';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AdminLayout = ({ children, title, subtitle }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminNavbar />
      <div className="container py-6 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
