import React from 'react';
import { Book, ChefHat } from 'lucide-react';
import { useProposalContext } from '../context/ProposalContext';
import { recipes } from '../data/recipes';
import { toast } from 'react-toastify';

const RecipeLibrary = () => {
  const { addRecipeToAllPersonnel } = useProposalContext();
  
  const handleApplyRecipe = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
      addRecipeToAllPersonnel(recipe);
      toast.success(`Applied ${recipe.name} recipe`);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg text-light-text-primary dark:text-space-gray-200 flex items-center gap-2">
        <ChefHat size={18} className="text-space-blue-light" />
        Recipe Library
      </h3>
      
      <p className="text-sm text-light-text-secondary dark:text-space-gray-400">
        Recipes are pre-configured collections of tasks for common project types.
      </p>
      
      <div className="space-y-3 max-h-[350px] overflow-y-auto p-1">
        {recipes.map(recipe => (
          <div 
            key={recipe.id}
            className="bg-light-card dark:bg-space-gray-800 border border-light-border dark:border-space-gray-700 rounded-md p-3 
                     hover:border-space-blue hover:bg-light-border dark:hover:bg-space-gray-700 transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <h4 className="text-light-text-primary dark:text-space-gray-200">{recipe.name}</h4>
              <span className="text-xs bg-light-border dark:bg-space-gray-900 px-2 py-1 rounded-full text-light-text-secondary dark:text-space-gray-400">
                {recipe.tasks.length} tasks
              </span>
            </div>
            
            <p className="text-sm text-light-text-secondary dark:text-space-gray-400 mt-1">{recipe.description}</p>
            
            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs text-light-text-secondary dark:text-space-gray-500">
                Est. {recipe.tasks.reduce((sum, task) => sum + task.hours, 0)} hours total
              </span>
              
              <button 
                className="text-xs bg-light-border dark:bg-space-gray-900 text-space-blue border border-light-border dark:border-space-gray-600 
                          px-3 py-1 rounded-md hover:bg-light-bg dark:hover:bg-space-gray-800 hover:border-space-blue 
                          transition-all duration-200 flex items-center gap-1"
                onClick={() => handleApplyRecipe(recipe.id)}
              >
                <Book size={12} />
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeLibrary;