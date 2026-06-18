import React from 'react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../common/Card';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#f43f5e'];

export const PieChart = ({ data, title, colors = COLORS }) => {
  return (
    <Card className="h-80 flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-slate-200">{title}</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPie>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
              itemStyle={{ color: '#f8fafc' }}
            />
          </RechartsPie>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-2 max-h-24 overflow-y-auto">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
            {entry.name}
          </div>
        ))}
      </div>
    </Card>
  );
};
