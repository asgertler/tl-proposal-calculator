import React, { useState } from 'react';
import { Settings, Users, Library, BookOpen, CalendarDays } from 'lucide-react';
import { CollapsibleSection } from './ProposalCalculator';
import TaskLibrary from './TaskLibrary';
import RecipeLibrary from './RecipeLibrary';
import PersonnelSection from './PersonnelSection';
import CostSummary from './CostSummary';
import BurnPlanCalendar from './BurnPlanCalendar';
import InfoSection from './InfoSection';
import TaskRecipeManager from './TaskRecipeManager';

const ProjectConfigurationSection = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'management'>('library');
  
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'library'
              ? 'bg-space-gray-800 text-space-blue-light'
              : 'hover:bg-space-gray-800'
          }`}
          onClick={() => setActiveTab('library')}
        >
          <Library size={18} />
          Task & Recipe Library
        </button>
        
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'management'
              ? 'bg-space-gray-800 text-space-blue-light'
              : 'hover:bg-space-gray-800'
          }`}
          onClick={() => setActiveTab('management')}
        >
          <BookOpen size={18} />
          Task & Recipe Management
        </button>
      </div>
      
      {activeTab === 'library' ? (
        <div className="space-y-6">
          <TaskLibrary />
          <RecipeLibrary />
        </div>
      ) : (
        <TaskRecipeManager />
      )}
    </div>
  );
};

const ResourcePlanningSection = () => {
  const [activeTab, setActiveTab] = useState<'personnel' | 'burnplan'>('personnel');

  return (
    <CollapsibleSection title="Resource Planning" icon={Users}>
      <div className="flex items-center gap-4 mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'personnel'
              ? 'bg-space-gray-800 text-space-blue-light'
              : 'hover:bg-space-gray-800'
          }`}
          onClick={() => setActiveTab('personnel')}
        >
          <Users size={18} />
          Personnel & Tasks
        </button>
        
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'burnplan'
              ? 'bg-space-gray-800 text-space-blue-light'
              : 'hover:bg-space-gray-800'
          }`}
          onClick={() => setActiveTab('burnplan')}
        >
          <CalendarDays size={18} />
          Burn Plan Calendar
        </button>
      </div>

      {activeTab === 'personnel' ? (
        <PersonnelSection />
      ) : (
        <BurnPlanCalendar />
      )}
    </CollapsibleSection>
  );
};

const TestLayout = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6">
        <InfoSection />
        
        <div className="flex gap-6">
          <div className="w-1/3">
            <CollapsibleSection title="Project Configuration" icon={Settings}>
              <ProjectConfigurationSection />
            </CollapsibleSection>
          </div>
          
          <div className="w-2/3">
            <ResourcePlanningSection />
          </div>
        </div>
        
        <CostSummary />
      </div>
    </div>
  );
};

export default TestLayout;