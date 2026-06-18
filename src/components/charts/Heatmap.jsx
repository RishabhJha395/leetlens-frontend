import React from 'react';
import { Card } from '../common/Card';

export const Heatmap = ({ data, title }) => {
  // Generate mock days
  const days = Array.from({ length: 365 }, (_, i) => {
    // some random activity for visual effect
    return Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0;
  });

  const getColor = (count) => {
    if (count === 0) return 'bg-slate-800';
    if (count === 1) return 'bg-emerald-900';
    if (count === 2) return 'bg-emerald-700';
    if (count === 3) return 'bg-emerald-500';
    return 'bg-emerald-400';
  };

  return (
    <Card className="overflow-hidden">
      <h3 className="text-lg font-semibold mb-4 text-slate-200">{title}</h3>
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
        {/* Render columns (weeks) */}
        {Array.from({ length: 52 }).map((_, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, dayIndex) => {
              const day = days[weekIndex * 7 + dayIndex];
              if (day === undefined) return null;
              return (
                <div 
                  key={dayIndex}
                  className={`w-3 h-3 rounded-sm ${getColor(day)} transition-colors hover:ring-2 hover:ring-slate-400`}
                  title={`${day} submissions`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 text-sm text-slate-400">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-slate-800" />
        <div className="w-3 h-3 rounded-sm bg-emerald-900" />
        <div className="w-3 h-3 rounded-sm bg-emerald-700" />
        <div className="w-3 h-3 rounded-sm bg-emerald-500" />
        <div className="w-3 h-3 rounded-sm bg-emerald-400" />
        <span>More</span>
      </div>
    </Card>
  );
};
