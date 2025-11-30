import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { Check, Flame, Plus, Sparkles } from 'lucide-react';
import { suggestRoutine } from '../services/geminiService';

interface RoutineTrackerProps {
  routines: Task[];
  onToggleRoutine: (id: string) => void;
  onAddRoutine: (title: string) => void;
  onDeleteRoutine: (id: string) => void;
}

export const RoutineTracker: React.FC<RoutineTrackerProps> = ({ routines, onToggleRoutine, onAddRoutine, onDeleteRoutine }) => {
  const [newRoutine, setNewRoutine] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);

  const completedCount = routines.filter(r => r.status === TaskStatus.COMPLETED).length;
  const progress = routines.length > 0 ? (completedCount / routines.length) * 100 : 0;

  const handleAdd = () => {
    if (newRoutine.trim()) {
      onAddRoutine(newRoutine);
      setNewRoutine('');
    }
  };

  const handleAiSuggest = async () => {
      if(!goal.trim()) return;
      setLoading(true);
      const suggestions = await suggestRoutine(goal);
      suggestions.forEach(s => onAddRoutine(s.title));
      setLoading(false);
      setShowAiModal(false);
      setGoal('');
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
           <h2 className="text-3xl font-bold text-slate-800">Daily Routines</h2>
           <p className="text-slate-500">Build better habits, one day at a time.</p>
        </div>
        <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-sm">
            <Flame size={20} fill="currentColor" />
            <span>12 Day Streak!</span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <div className="flex justify-between mb-2 text-sm font-medium">
            <span className="text-slate-600">Daily Progress</span>
            <span className="text-indigo-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
      </div>

      {/* Routine List */}
      <div className="grid gap-4">
        {routines.map(routine => (
            <div 
                key={routine.id}
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                    routine.status === TaskStatus.COMPLETED 
                    ? 'bg-emerald-50 border-emerald-100' 
                    : 'bg-white border-slate-200 hover:shadow-md'
                }`}
            >
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => onToggleRoutine(routine.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            routine.status === TaskStatus.COMPLETED 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                        }`}
                    >
                        <Check size={18} />
                    </button>
                    <span className={`font-medium text-lg ${
                        routine.status === TaskStatus.COMPLETED ? 'text-emerald-800 line-through opacity-70' : 'text-slate-700'
                    }`}>
                        {routine.title}
                    </span>
                </div>
                <button 
                    onClick={() => onDeleteRoutine(routine.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition"
                >
                    Delete
                </button>
            </div>
        ))}

        {/* Add New Input */}
        <div className="flex gap-2 mt-4">
            <input 
                type="text" 
                className="flex-1 p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                placeholder="Add a new daily habit..."
                value={newRoutine}
                onChange={(e) => setNewRoutine(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button 
                onClick={handleAdd}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl font-medium transition shadow-sm"
            >
                <Plus size={24} />
            </button>
            <button
                onClick={() => setShowAiModal(true)}
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 rounded-xl font-medium transition shadow-sm"
                title="AI Suggestions"
            >
                <Sparkles size={24} />
            </button>
        </div>
      </div>

       {/* AI Modal */}
       {showAiModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="text-purple-600" /> Routine Suggestions
            </h3>
            <p className="text-slate-500 text-sm mb-4">What do you want to achieve?</p>
            <input 
              type="text"
              className="w-full border border-slate-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="e.g., Get fit, Learn to code, Sleep better..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAiModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button 
                onClick={handleAiSuggest} 
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Thinking...' : 'Get Routines'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};