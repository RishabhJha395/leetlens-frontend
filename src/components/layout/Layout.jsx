import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';

export const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans selection:bg-blue-500/30">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {!isHome && <Sidebar />}
        <main className={`flex-1 overflow-y-auto relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 ${!isHome ? 'pb-16 md:pb-0' : ''}`}>
          <Outlet />
          <Footer />
        </main>
      </div>
      {!isHome && <BottomNav />}
    </div>
  );
};
