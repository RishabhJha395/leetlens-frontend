import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiActivity, FiUsers, FiBarChart2, FiClock, FiUser } from 'react-icons/fi';
import { cn } from '../../utils/cn';

const navItems = [
  { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { path: '/compare', icon: FiUsers, label: 'Compare' },
  { path: '/analytics', icon: FiBarChart2, label: 'Analytics' },
  { path: '/leaderboard', icon: FiActivity, label: 'Leaderboard' },
  { path: '/history', icon: FiClock, label: 'History' },
  { path: '/profile', icon: FiUser, label: 'Profile' },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-md h-[calc(100vh-4rem)] sticky top-16 hidden md:flex flex-col">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              isActive 
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
