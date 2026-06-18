import React from 'react';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../common/Card';

export const RadarChart = ({ data, title, keys = ["A"], colors = ["#3b82f6", "#10b981"] }) => {
  return (
    <Card className="h-80 flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-slate-200">{title}</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            {keys.map((key, i) => (
              <Radar key={key} name={key} dataKey={key} stroke={colors[i % colors.length]} fill={colors[i % colors.length]} fillOpacity={0.4} />
            ))}
          </RechartsRadar>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
