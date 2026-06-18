import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({ children, className, variant = 'primary' }) => {
  const variants = {
    primary: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    success: "bg-green-500/10 text-green-400 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    neutral: "bg-slate-500/10 text-slate-400 border-slate-500/20"
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", variants[variant], className)}>
      {children}
    </span>
  );
};
