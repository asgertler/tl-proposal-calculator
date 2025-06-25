import React, { useState } from 'react';
import { Plus, Filter, Grid3X3 } from 'lucide-react';
import { useProposalContext } from '../context/ProposalContext';
import { taskLibrary } from '../data/taskLibrary';

const TaskLibrary = () => {
  const { addTaskToAllPersonnel } = useProposalContext();
  const [filterText, setFilterText] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const sortedAndFilteredTasks = taskLibrary
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter(task => 
      task.name.toLowerCase().includes(filterText.toLowerCase())
    );
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg text-light-text-primary dark:text-space-gray-200">Task Library</h3>
        <div className="flex gap-2">
          <button 
            className={`p-1 rounded ${viewMode === 'grid' ? 'bg-light-border dark:bg-space-gray-700' : 'bg-light-card dark:bg-space-gray-900'}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <Grid3X3 size={18} />
          </button>
          <button 
            className={`p-1 rounded ${viewMode === 'list' ? 'bg-light-border dark:bg-space-gray-700' : 'bg-light-card dark:bg-space-gray-900'}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>
      
      <div className="relative">
        <input
          type="text"
          placeholder="Filter tasks..."
          className="space-input pl-8"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
        />
        <Filter size={16} className="absolute left-2.5 top-3 text-light-text-secondary dark:text-space-gray-400" />
      </div>
      
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-2 sm:grid-cols-3 gap-2' 
          : 'flex flex-col space-y-2'
        }
        max-h-[350px] overflow-y-auto p-1
      `}>
        {sortedAndFilteredTasks.map(task => (
          <button
            key={task.id}
            className={`
              ${viewMode === 'grid' 
                ? 'text-xs sm:text-sm p-2 flex flex-col items-center justify-center text-center'
                : 'text-sm p-2 flex justify-between items-center'
              }
              bg-light-card dark:bg-space-gray-800 border border-light-border dark:border-space-gray-700 rounded-md 
              hover:border-space-blue hover:bg-light-border dark:hover:bg-space-gray-700 transition-all duration-200
            `}
            onClick={() => addTaskToAllPersonnel(task)}
          >
            <span className="text-light-text-primary dark:text-space-gray-200">{task.name}</span>
            <span className="text-light-text-secondary dark:text-space-gray-400 mt-1">{task.hours}h</span>
          </button>
        ))}
        
        <button
          className={`
            ${viewMode === 'grid' 
              ? 'text-xs sm:text-sm p-2 flex flex-col items-center justify-center text-center'
              : 'text-sm p-2 flex justify-between items-center'
            }
            bg-light-card dark:bg-space-gray-800 border border-dashed border-light-border dark:border-space-gray-600 rounded-md 
            hover:border-space-blue hover:bg-light-border dark:hover:bg-space-gray-700 transition-all duration-200
          `}
          onClick={() => addTaskToAllPersonnel({
            id: `custom-${Date.now()}`,
            name: 'Custom Task',
            hours: 8,
            isCustom: true
          })}
        >
          <span className="text-light-text-primary dark:text-space-gray-200 flex items-center gap-1">
            <Plus size={14} /> Custom Task
          </span>
        </button>
      </div>
    </div>
  );
};

export default TaskLibrary;