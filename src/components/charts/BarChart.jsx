import React from 'react';
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../common/Card';

export const BarChart = ({ data, title, keys = [], colors = [] }) => {
  return (
    <Card className="h-80 flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-slate-200">{title}</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBar data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" tick={{fill: '#64748b'}} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
              itemStyle={{ color: '#f8fafc' }}
              cursor={{ fill: '#334155', opacity: 0.4 }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            {keys.map((k, i) => (
              <Bar key={k} dataKey={k} fill={colors[i] || '#3b82f6'} radius={[4, 4, 0, 0]} />
            ))}
          </RechartsBar>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
