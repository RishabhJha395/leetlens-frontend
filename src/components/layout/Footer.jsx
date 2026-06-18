import React from 'react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-900/50 py-6 mt-auto">
      <div className="container mx-auto px-6 text-center text-slate-500 text-sm flex flex-col items-center">
        <p>© {new Date().getFullYear()} LeetLens. All rights reserved.</p>
        <p className="mt-2 mb-2">An AI-powered LeetCode Analytics & Comparison Platform</p>
        <p className="text-xs font-medium text-slate-400 tracking-wide mt-1">Made with ❤️ by Rishabh Jha</p>
      </div>
    </footer>
  );
};
