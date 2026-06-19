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

export const BottomNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around px-2 z-50 pb-safe">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
            isActive ? "text-blue-400" : "text-slate-400 hover:text-slate-200"
          )}
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
