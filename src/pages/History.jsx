import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { motion } from 'framer-motion';

import { getHistory } from '../services/api';

export const History = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory().then(data => {
      const newEvents = [];
      for(let i = 1; i < data.length; i++) {
         const prev = data[i-1];
         const curr = data[i];
         const diffSolved = curr.problemsSolved.total - prev.problemsSolved.total;
         if (diffSolved > 0) {
            newEvents.push({ type: 'problem', date: curr.date, title: `Solved ${diffSolved} new problems`, result: `Total: ${curr.problemsSolved.total}`, diff: null });
         }
         const diffRating = curr.contestRating - prev.contestRating;
         if (diffRating !== 0) {
            newEvents.push({ type: 'contest', date: curr.date, title: `Rating Changed`, result: `Rating: ${Math.round(curr.contestRating)}`, diff: diffRating > 0 ? `+${Math.round(diffRating)}` : `${Math.round(diffRating)}` });
         }
      }
      if (data.length > 1 && newEvents.length === 0) {
         newEvents.push({ type: 'badge', date: data[data.length-1].date, title: 'Joined LeetLens', result: 'Tracking started', diff: null });
      } else if (data.length === 1) {
         newEvents.push({ type: 'problem', date: data[0].date, title: 'Current Status', result: `Total Solved: ${data[0].problemsSolved?.total || 0}`, diff: null });
         newEvents.push({ type: 'contest', date: data[0].date, title: 'Current Rating', result: `Rating: ${Math.round(data[0].contestRating || 1500)}`, diff: null });
         newEvents.push({ type: 'badge', date: data[0].date, title: 'Tracking Started', result: 'Data will update daily', diff: null });
      } else if (data.length === 0) {
         newEvents.push({ type: 'badge', date: new Date().toISOString().split('T')[0], title: 'Welcome', result: 'Data will appear tomorrow', diff: null });
      }
      setEvents(newEvents.reverse());
      setLoading(false);
    });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Activity History</h1>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
        {loading ? (
          <div className="flex justify-center p-8 text-slate-400">Loading history...</div>
        ) : events.map((event, i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              {event.type === 'contest' ? '🏆' : event.type === 'badge' ? '🏅' : '💻'}
            </div>
            
            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="font-bold text-slate-200">{event.title}</div>
                <div className="text-xs text-slate-500">{event.date}</div>
              </div>
              <div className="text-sm text-slate-400 mb-3">{event.result}</div>
              {event.diff && (
                <Badge variant={event.diff.startsWith('+') ? 'success' : 'danger'}>
                  Rating {event.diff}
                </Badge>
              )}
            </Card>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
