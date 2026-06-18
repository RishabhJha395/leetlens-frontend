import React from 'react';
import { cn } from '../../utils/cn';

export const Input = ({ className, icon: Icon, ...props }) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-slate-400" />
        </div>
      )}
      <input
        className={cn(
          "w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
          Icon && "pl-10",
          className
        )}
        {...props}
      />
    </div>
  );
};
