import React, { useState } from 'react';
import { Plus, Wand2, Calendar, MoreHorizontal, Trash2 } from 'lucide-react';
import { Project, Task, TaskStatus } from '../types';
import { generateSubtasks } from '../services/geminiService';

interface ProjectBoardProps {
  projects: Project[];
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (taskId: string, status: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
}

export const ProjectBoard: React.FC<ProjectBoardProps> = ({ projects, tasks, onAddTask, onUpdateTask, onDeleteTask }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);

  const currentProject = projects.find(p => p.id === selectedProjectId);
  const projectTasks = tasks.filter(t => t.projectId === selectedProjectId);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const task: Task = {
      id: crypto.randomUUID(),
      projectId: selectedProjectId,
      title: newTaskTitle,
      status: TaskStatus.PENDING,
      isRoutine: false,
      priority: 'medium',
      dueDate: newTaskDate
    };
    onAddTask(task);
    setNewTaskTitle('');
    setNewTaskDate('');
    setShowAddModal(false);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    const generatedTasks = await generateSubtasks(aiPrompt);
    
    generatedTasks.forEach(t => {
      onAddTask({
        id: crypto.randomUUID(),
        projectId: selectedProjectId,
        title: t.title,
        status: TaskStatus.PENDING,
        isRoutine: false,
        priority: t.priority as 'low' | 'medium' | 'high',
        dueDate: new Date().toISOString().split('T')[0]
      });
    });
    setIsGenerating(false);
    setShowAiModal(false);
    setAiPrompt('');
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING: return 'bg-amber-100 text-amber-800 border-amber-200';
      case TaskStatus.SCHEDULED: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case TaskStatus.COMPLETED: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const Columns = [
    { title: 'Pending', status: TaskStatus.PENDING },
    { title: 'Scheduled', status: TaskStatus.SCHEDULED },
    { title: 'Completed', status: TaskStatus.COMPLETED },
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Projects</h2>
          <p className="text-slate-500">Manage tasks and track progress.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            className="bg-white border border-slate-300 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button 
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Wand2 size={18} />
            <span className="hidden sm:inline">AI Generate</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 min-w-[1000px] h-full">
          {Columns.map(col => (
            <div key={col.status} className="flex-1 bg-slate-100/50 rounded-xl p-4 flex flex-col h-full border border-slate-200/60">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${col.status === TaskStatus.PENDING ? 'bg-amber-400' : col.status === TaskStatus.SCHEDULED ? 'bg-indigo-400' : 'bg-emerald-400'}`}></span>
                  {col.title}
                </h3>
                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">
                  {projectTasks.filter(t => t.status === col.status).length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {projectTasks.filter(t => t.status === col.status).map(task => (
                  <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 group hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-medium uppercase tracking-wider ${task.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                        {task.priority}
                      </span>
                      <div className="relative group/menu">
                         <button className="text-slate-400 hover:text-slate-600">
                             <MoreHorizontal size={16} />
                         </button>
                      </div>
                    </div>
                    <h4 className="font-medium text-slate-800 mb-2">{task.title}</h4>
                    {task.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                            <Calendar size={12} />
                            {task.dueDate}
                        </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                         {/* Quick Actions for simplicity instead of DnD */}
                         <div className="flex gap-1">
                             {task.status !== TaskStatus.PENDING && (
                                 <button onClick={() => onUpdateTask(task.id, TaskStatus.PENDING)} className="p-1 hover:bg-slate-100 rounded text-xs text-slate-500" title="Move to Pending">Wait</button>
                             )}
                             {task.status !== TaskStatus.SCHEDULED && (
                                 <button onClick={() => onUpdateTask(task.id, TaskStatus.SCHEDULED)} className="p-1 hover:bg-slate-100 rounded text-xs text-indigo-500" title="Schedule">Plan</button>
                             )}
                             {task.status !== TaskStatus.COMPLETED && (
                                 <button onClick={() => onUpdateTask(task.id, TaskStatus.COMPLETED)} className="p-1 hover:bg-slate-100 rounded text-xs text-emerald-500" title="Complete">Done</button>
                             )}
                         </div>
                         <button onClick={() => onDeleteTask(task.id)} className="text-slate-300 hover:text-red-400 transition">
                             <Trash2 size={14} />
                         </button>
                    </div>
                  </div>
                ))}
                {projectTasks.filter(t => t.status === col.status).length === 0 && (
                  <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                    No tasks here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">New Task</h3>
            <input 
              type="text" 
              className="w-full border border-slate-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <input 
              type="date" 
              className="w-full border border-slate-300 rounded-lg p-3 mb-6 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button onClick={handleAddTask} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add Task</button>
            </div>
          </div>
        </div>
      )}

      {/* AI Generate Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Wand2 className="text-purple-600" /> AI Task Generator
            </h3>
            <p className="text-slate-500 text-sm mb-4">Describe your project goal, and AI will create actionable tasks for you.</p>
            <textarea 
              className="w-full border border-slate-300 rounded-lg p-3 mb-4 h-32 resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="e.g., Plan a company retreat for 50 people in Bali..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAiModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button 
                onClick={handleAiGenerate} 
                disabled={isGenerating}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isGenerating ? 'Generating...' : 'Magic Generate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};