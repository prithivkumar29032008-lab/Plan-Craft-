import React from 'react';
import { LayoutDashboard, CheckSquare, Repeat, MessageSquare, Plus, Settings } from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.PROJECTS, label: 'Projects & Tasks', icon: CheckSquare },
    { id: View.ROUTINES, label: 'Daily Routines', icon: Repeat },
    { id: View.CHAT, label: 'Team Chat', icon: MessageSquare },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-1">
             <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d="M20 4L34 11V29L20 36L6 29V11L20 4Z" stroke="url(#logo_grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 13V27L26 13V27" stroke="url(#logo_grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 13L26 27" stroke="url(#logo_grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                    <linearGradient id="logo_grad" x1="6" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#60A5FA" />
                        <stop offset="0.5" stopColor="#A855F7" />
                        <stop offset="1" stopColor="#EC4899" />
                    </linearGradient>
                </defs>
             </svg>
            <span className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                NEUROTECH
            </span>
          </div>
          <p className="text-xs text-slate-400 pl-1">Project & Routine Manager</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-xl cursor-pointer hover:bg-slate-700 transition">
            <img src="https://picsum.photos/100/100" alt="User" className="w-8 h-8 rounded-full border border-slate-500" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Alex Developer</p>
              <p className="text-xs text-slate-400">Team Lead</p>
            </div>
            <Settings size={16} className="text-slate-400" />
          </div>
        </div>
      </div>
    </aside>
  );
};