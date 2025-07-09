import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Settings, Library, BookOpen, Users, CalendarDays } from 'lucide-react';
import TaskLibrary from './TaskLibrary';
import RecipeLibrary from './RecipeLibrary';
import PersonnelSection from './PersonnelSection';
import CostSummary from './CostSummary';
import BurnPlanCalendar from './BurnPlanCalendar';
import InfoSection from './InfoSection';
import TaskRecipeManager from './TaskRecipeManager';

export const CollapsibleSection = ({ title, children, icon: Icon }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <section className="space-card">
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={24} className="text-space-blue-light" />}
          <h2 className="text-2xl">{title}</h2>
        </div>
        {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </div>
      
      {isExpanded && (
        <div className="mt-6 animate-fadeIn">
          {children}
        </div>
      )}
    </section>
  );
};

const ProjectConfigurationSection = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'management'>('library');
  
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'library'
              ? 'bg-light-border dark:bg-space-gray-800 border border-light-border dark:border-space-gray-700 text-space-blue-light'
              : 'hover:bg-light-border dark:hover:bg-space-gray-800'
          }`}
          onClick={() => setActiveTab('library')}
        >
          <Library size={18} />
          Task & Recipe Library
        </button>
        
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'management'
              ? 'bg-light-border dark:bg-space-gray-800 border border-light-border dark:border-space-gray-700 text-space-blue-light'
              : 'hover:bg-light-border dark:hover:bg-space-gray-800'
          }`}
          onClick={() => setActiveTab('management')}
        >
          <BookOpen size={18} />
          Task & Recipe Management
        </button>
      </div>
      
      {activeTab === 'library' ? (
        <div className="grid grid-cols-2 gap-6">
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
              ? 'bg-light-border dark:bg-space-gray-800 border border-light-border dark:border-space-gray-700 text-space-blue-light'
              : 'hover:bg-light-border dark:hover:bg-space-gray-800'
          }`}
          onClick={() => setActiveTab('personnel')}
        >
          <Users size={18} />
          Personnel & Tasks
        </button>
        
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'burnplan'
              ? 'bg-light-border dark:bg-space-gray-800 border border-light-border dark:border-space-gray-700 text-space-blue-light'
              : 'hover:bg-light-border dark:hover:bg-space-gray-800'
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

const ProposalCalculator = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <InfoSection />
      
      <CollapsibleSection title="Project Configuration" icon={Settings}>
        <ProjectConfigurationSection />
      </CollapsibleSection>
      
      <ResourcePlanningSection />
      
      <CostSummary />
    </div>
  );
};

export default ProposalCalculator;