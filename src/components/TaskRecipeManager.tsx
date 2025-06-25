import { useState } from 'react';
import { Plus, Save, X, Library, BookOpen } from 'lucide-react';
import type { Task, Recipe } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { taskLibrary } from '../data/taskLibrary';
import { recipes } from '../data/recipes';
import { toast } from 'react-toastify';

const TaskRecipeManager = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'recipes'>('tasks');
  const [newTask, setNewTask] = useState<Partial<Task>>({ name: '', hours: 0 });
  const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
    name: '',
    description: '',
    tasks: []
  });
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  
  const handleAddTask = () => {
    if (!newTask.name || !newTask.hours) {
      toast.error('Please enter both task name and hours');
      return;
    }
    
    const task: Task = {
      id: `custom-${uuidv4()}`,
      name: newTask.name,
      hours: newTask.hours,
      isCustom: true
    };
    
    taskLibrary.push(task);
    taskLibrary.sort((a, b) => a.name.localeCompare(b.name));
    
    setNewTask({ name: '', hours: 0 });
    toast.success('Task added successfully');
  };
  
  const handleDeleteTask = (taskId: string) => {
    const index = taskLibrary.findIndex(t => t.id === taskId);
    if (index !== -1) {
      taskLibrary.splice(index, 1);
      setSelectedTasks(prev => prev.filter(id => id !== taskId));
      toast.success('Task deleted successfully');
    }
  };
  
  const handleAddRecipe = () => {
    if (!newRecipe.name || !newRecipe.description || selectedTasks.length === 0) {
      toast.error('Please fill in all recipe details and select at least one task');
      return;
    }
    
    const recipe: Recipe = {
      id: uuidv4(),
      name: newRecipe.name,
      description: newRecipe.description,
      tasks: taskLibrary
        .filter(task => selectedTasks.includes(task.id))
        .map(task => ({
          id: uuidv4(),
          name: task.name,
          hours: task.hours
        }))
    };
    
    recipes.push(recipe);
    
    setNewRecipe({ name: '', description: '', tasks: [] });
    setSelectedTasks([]);
    toast.success('Recipe added successfully');
  };

  const sortedTasks = [...taskLibrary].sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <div className="space-card">
      <div className="flex items-center gap-4 mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'tasks'
              ? 'bg-light-border dark:bg-space-gray-800 text-space-blue-light'
              : 'hover:bg-light-border dark:hover:bg-space-gray-800'
          }`}
          onClick={() => setActiveTab('tasks')}
        >
          <Library size={18} />
          Manage Tasks
        </button>
        
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'recipes'
              ? 'bg-light-border dark:bg-space-gray-800 text-space-blue-light'
              : 'hover:bg-light-border dark:hover:bg-space-gray-800'
          }`}
          onClick={() => setActiveTab('recipes')}
        >
          <BookOpen size={18} />
          Manage Recipes
        </button>
      </div>
      
      {activeTab === 'tasks' ? (
        <div className="space-y-6">
          <div className="bg-light-card dark:bg-space-gray-800 rounded-md p-4">
            <h3 className="text-lg mb-4">Add New Task</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Task name"
                className="space-input"
                value={newTask.name}
                onChange={e => setNewTask(prev => ({ ...prev, name: e.target.value }))}
              />
              <input
                type="number"
                placeholder="Hours"
                className="space-input"
                value={newTask.hours}
                onChange={e => setNewTask(prev => ({ ...prev, hours: Number(e.target.value) }))}
              />
            </div>
            <button
              className="space-button mt-4 flex items-center gap-2"
              onClick={handleAddTask}
            >
              <Plus size={18} />
              Add Task
            </button>
          </div>
          
          <div>
            <h3 className="text-lg mb-4">Existing Tasks</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sortedTasks.map(task => (
                <div
                  key={task.id}
                  className="bg-light-card dark:bg-space-gray-800 p-3 rounded-md flex justify-between items-center hover:border-space-blue border border-light-border dark:border-space-gray-700 transition-all"
                >
                  <div>
                    <div className="text-light-text-primary dark:text-space-gray-200">{task.name}</div>
                    <div className="text-sm text-light-text-secondary dark:text-space-gray-400">{task.hours} hours</div>
                  </div>
                  {task.isCustom && (
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors"
                      onClick={() => handleDeleteTask(task.id)}
                      title="Delete task"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-light-card dark:bg-space-gray-800 rounded-md p-4">
            <h3 className="text-lg mb-4">Create New Recipe</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Recipe name"
                className="space-input"
                value={newRecipe.name}
                onChange={e => setNewRecipe(prev => ({ ...prev, name: e.target.value }))}
              />
              <textarea
                placeholder="Recipe description"
                className="space-input h-24"
                value={newRecipe.description}
                onChange={e => setNewRecipe(prev => ({ ...prev, description: e.target.value }))}
              />
              
              <div>
                <h4 className="text-light-text-primary dark:text-space-gray-200 mb-2">Select Tasks</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {sortedTasks.map(task => (
                    <label
                      key={task.id}
                      className="flex items-center gap-2 p-2 bg-light-bg dark:bg-space-gray-900 rounded-md cursor-pointer hover:bg-light-border dark:hover:bg-space-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedTasks(prev => [...prev, task.id]);
                          } else {
                            setSelectedTasks(prev => prev.filter(id => id !== task.id));
                          }
                        }}
                        className="text-space-blue"
                      />
                      <span className="text-light-text-primary dark:text-space-gray-200">{task.name} ({task.hours}h)</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <button
                className="space-button flex items-center gap-2"
                onClick={handleAddRecipe}
              >
                <Save size={18} />
                Save Recipe
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg mb-4">Existing Recipes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipes.map(recipe => (
                <div key={recipe.id} className="bg-light-card dark:bg-space-gray-800 rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-light-text-primary dark:text-space-gray-200">{recipe.name}</h4>
                    <button
                      className="text-red-500 hover:text-red-600"
                      onClick={() => {
                        const index = recipes.findIndex(r => r.id === recipe.id);
                        if (index !== -1) {
                          recipes.splice(index, 1);
                          toast.success('Recipe deleted successfully');
                        }
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-light-text-secondary dark:text-space-gray-400 mb-3">{recipe.description}</p>
                  <div className="space-y-1">
                    {recipe.tasks.map(task => (
                      <div key={task.id} className="text-sm text-light-text-secondary dark:text-space-gray-300">
                        • {task.name} ({task.hours}h)
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskRecipeManager;