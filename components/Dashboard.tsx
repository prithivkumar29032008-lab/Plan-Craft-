import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Task, TaskStatus } from '../types';
import { CheckCircle2, Clock, CalendarDays, AlertCircle } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const pendingCount = tasks.filter(t => t.status === TaskStatus.PENDING).length;
  const scheduledCount = tasks.filter(t => t.status === TaskStatus.SCHEDULED).length;
  const completedCount = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const totalCount = tasks.length;

  const data = [
    { name: 'Pending', value: pendingCount, color: '#f59e0b' },
    { name: 'Scheduled', value: scheduledCount, color: '#6366f1' },
    { name: 'Completed', value: completedCount, color: '#10b981' },
  ];

  const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== TaskStatus.COMPLETED);

  return (
    <div className="p-6 md:p-10 space-y-8 animate-fade-in">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Overview</h2>
        <p className="text-slate-500">Welcome back! Here is your daily production summary.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Tasks</p>
            <p className="text-2xl font-bold text-slate-800">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Pending</p>
            <p className="text-2xl font-bold text-slate-800">{pendingCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Scheduled</p>
            <p className="text-2xl font-bold text-slate-800">{scheduledCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Completed</p>
            <p className="text-2xl font-bold text-slate-800">{completedCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-96">
        {/* Chart Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Task Distribution</h3>
          <div className="flex-1 w-full min-h-0">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={40}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Priority List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-y-auto">
          <h3 className="text-lg font-bold text-slate-800 mb-4">High Priority</h3>
          {highPriority.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
               <CheckCircle2 size={48} className="mb-2 opacity-50"/>
               <p>All caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {highPriority.map(task => (
                <div key={task.id} className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0"></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{task.title}</p>
                    <p className="text-xs text-slate-500">Due: {task.dueDate || 'No date'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};