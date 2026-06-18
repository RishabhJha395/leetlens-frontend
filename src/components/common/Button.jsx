import React from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export const Button = ({ children, className, variant = 'primary', ...props }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30",
    secondary: "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700",
    outline: "bg-transparent border border-blue-600 text-blue-500 hover:bg-blue-600/10",
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
};
