import React from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export const ProgressBar = ({ progress, className, colorClass = "bg-blue-500" }) => {
  return (
    <div className={cn("w-full bg-slate-800 rounded-full h-2.5 overflow-hidden", className)}>
      <motion.div 
        className={cn("h-2.5 rounded-full", colorClass)}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
};
