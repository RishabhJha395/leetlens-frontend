import React from 'react';
import { AreaChart as RechartsArea, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../common/Card';

export const LineChart = ({ data, title }) => {
  return (
    <Card className="h-80 flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-slate-200">{title}</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsArea data={data}>
            <defs>
              <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} tickLine={false} axisLine={false} />
            <YAxis domain={['dataMin - 50', 'dataMax + 50']} stroke="#64748b" tick={{fill: '#64748b'}} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Area 
              type="linear" 
              dataKey="rating" 
              stroke="#f59e0b" 
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRating)"
              dot={{ fill: '#1e293b', stroke: '#f59e0b', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#f59e0b', stroke: '#1e293b', strokeWidth: 2 }}
            />
          </RechartsArea>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
