import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ProjectBoard } from './components/ProjectBoard';
import { RoutineTracker } from './components/RoutineTracker';
import { TeamChat } from './components/TeamChat';
import { View, Project, Task, TaskStatus } from './types';
import { Menu } from 'lucide-react';

const MOCK_PROJECTS: Project[] = [
  { id: '1', name: 'Website Redesign', description: 'Overhaul the corporate site', color: 'indigo' },
  { id: '2', name: 'Mobile App Launch', description: 'Q3 Launch strategy', color: 'emerald' },
  { id: '3', name: 'Marketing Campaign', description: 'Social media blitz', color: 'amber' },
];

const MOCK_TASKS: Task[] = [
  { id: '101', projectId: '1', title: 'Design Homepage Mockup', status: TaskStatus.COMPLETED, isRoutine: false, priority: 'high', dueDate: '2023-11-01' },
  { id: '102', projectId: '1', title: 'Implement React Components', status: TaskStatus.PENDING, isRoutine: false, priority: 'high', dueDate: '2023-11-05' },
  { id: '103', projectId: '2', title: 'App Store Submission', status: TaskStatus.SCHEDULED, isRoutine: false, priority: 'medium', dueDate: '2023-12-01' },
  { id: '201', projectId: null, title: 'Morning Standup', status: TaskStatus.COMPLETED, isRoutine: true, priority: 'medium' },
  { id: '202', projectId: null, title: 'Review PRs', status: TaskStatus.PENDING, isRoutine: true, priority: 'high' },
  { id: '203', projectId: null, title: 'Check Emails', status: TaskStatus.SCHEDULED, isRoutine: true, priority: 'low' },
];

function App() {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  const handleAddTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const handleUpdateTask = (taskId: string, status: TaskStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleAddRoutine = (title: string) => {
      const newRoutine: Task = {
          id: crypto.randomUUID(),
          projectId: null,
          title,
          status: TaskStatus.PENDING,
          isRoutine: true,
          priority: 'medium'
      };
      setTasks([...tasks, newRoutine]);
  };

  const handleToggleRoutine = (id: string) => {
      const task = tasks.find(t => t.id === id);
      if (task) {
          const newStatus = task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED;
          handleUpdateTask(id, newStatus);
      }
  };

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard tasks={tasks} />;
      case View.PROJECTS:
        return (
          <ProjectBoard 
            projects={projects} 
            tasks={tasks.filter(t => !t.isRoutine)} 
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      case View.ROUTINES:
        return (
            <RoutineTracker 
                routines={tasks.filter(t => t.isRoutine)}
                onToggleRoutine={handleToggleRoutine}
                onAddRoutine={handleAddRoutine}
                onDeleteRoutine={handleDeleteTask}
            />
        );
      case View.CHAT:
        return <TeamChat currentUser="Alex Developer" />;
      default:
        return <Dashboard tasks={tasks} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onChangeView={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }} 
        isOpen={isSidebarOpen} 
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center z-10">
          <h1 className="font-bold text-slate-800 text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            NEUROTECH
          </h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Menu size={24} />
          </button>
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <main className="flex-1 overflow-y-auto w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;