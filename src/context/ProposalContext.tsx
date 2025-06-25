import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { 
  Personnel, 
  Task, 
  Role, 
  BurnPlan, 
  Recipe,
} from '../types';
import { roles } from '../data/roles';
import { generateWeekRanges } from '../utils/dateUtils';
import { useGlobalTasks } from '../hooks/useGlobalTasks';

interface ProposalContextType {
  personnel: Personnel[];
  burnPlan: BurnPlan;
  addPersonnel: () => void;
  removePersonnel: (id: string) => void;
  updatePersonnelRole: (personnelId: string, role: Role) => void;
  updatePersonnelBillRate: (personnelId: string, billRate: number) => void;
  updatePersonnelNotes: (personnelId: string, notes: string) => void;
  addTaskToPersonnel: (personnelId: string, task: Task) => void;
  addTaskToAllPersonnel: (task: Task) => void;
  updateTaskHours: (personnelId: string, taskId: string, hours: number) => void;
  removeTaskFromPersonnel: (personnelId: string, taskId: string) => void;
  removeTaskFromAllPersonnel: (taskId: string) => void;
  calculatePersonnelCost: (personnelId: string) => number;
  addRecipeToAllPersonnel: (recipe: Recipe) => void;
  updateBurnPlanDates: (startDate: string, endDate: string) => void;
  updateBurnPlanAllocation: (allocation: {
    weekId: number;
    personnelId: string;
    taskId: string;
    hours: number;
  }) => void;
  getTotalCost: () => number;
  getTotalCostWithoutMargin: () => number;
  getProfitAmount: () => number;
  loadProjectData: (data: { personnel: Personnel[]; burnPlan: BurnPlan }) => void;
}

const ProposalContext = createContext<ProposalContextType | undefined>(undefined);

export const ProposalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { globalTasks } = useGlobalTasks();
  const today = new Date();
  const fourWeeksLater = new Date(today);
  fourWeeksLater.setDate(today.getDate() + 28);
  
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  const initialStartDate = formatDateForInput(today);
  const initialEndDate = formatDateForInput(fourWeeksLater);
  
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [burnPlan, setBurnPlan] = useState<BurnPlan>({
    startDate: initialStartDate,
    endDate: initialEndDate,
    weeks: generateWeekRanges(initialStartDate, initialEndDate)
  });
  
  useEffect(() => {
    if (personnel.length === 0) {
      addPersonnel();
    }
  }, []);
  
  useEffect(() => {
    const weekRanges = generateWeekRanges(burnPlan.startDate, burnPlan.endDate);
    const existingAllocations = burnPlan.weeks.flatMap(week => week.allocations);
    
    const updatedWeeks = weekRanges.map((week, index) => {
      if (index < burnPlan.weeks.length) {
        return {
          ...week,
          allocations: burnPlan.weeks[index].allocations
        };
      }
      return week;
    });
    
    setBurnPlan(prev => ({
      ...prev,
      weeks: updatedWeeks
    }));
  }, [burnPlan.startDate, burnPlan.endDate]);
  
  const addPersonnel = () => {
    const defaultRole = roles[1];
    
    const existingTasks = Array.from(
      new Set(
        personnel.flatMap(p => 
          p.tasks.map(t => ({ ...t, id: t.id.split('-')[0] }))
        )
      )
    );
    
    const allTasks = [...existingTasks, ...globalTasks].map(task => ({
      ...task,
      id: `${task.id}-${Date.now()}`
    }));

    const newPersonnel: Personnel = {
      id: uuidv4(),
      name: `Resource ${personnel.length + 1}`,
      role: defaultRole,
      billRate: defaultRole.defaultRate,
      tasks: allTasks,
      notes: ''
    };
    
    setPersonnel(prev => [...prev, newPersonnel]);
  };
  
  const removePersonnel = (id: string) => {
    setPersonnel(prev => prev.filter(person => person.id !== id));
    
    setBurnPlan(prev => ({
      ...prev,
      weeks: prev.weeks.map(week => ({
        ...week,
        allocations: week.allocations.filter(a => a.personnelId !== id)
      }))
    }));
  };
  
  const updatePersonnelRole = (personnelId: string, role: Role) => {
    setPersonnel(prev => 
      prev.map(person => 
        person.id === personnelId
          ? { ...person, role, billRate: role.defaultRate }
          : person
      )
    );
  };
  
  const updatePersonnelBillRate = (personnelId: string, billRate: number) => {
    setPersonnel(prev => 
      prev.map(person => 
        person.id === personnelId
          ? { ...person, billRate }
          : person
      )
    );
  };
  
  const updatePersonnelNotes = (personnelId: string, notes: string) => {
    setPersonnel(prev => 
      prev.map(person => 
        person.id === personnelId
          ? { ...person, notes }
          : person
      )
    );
  };
  
  const addTaskToPersonnel = (personnelId: string, task: Task) => {
    setPersonnel(prev => 
      prev.map(person => {
        if (person.id === personnelId) {
          const taskExists = person.tasks.some(t => t.id === task.id);
          
          if (taskExists) {
            return person;
          }
          
          return {
            ...person,
            tasks: [...person.tasks, { ...task }]
          };
        }
        return person;
      })
    );
  };
  
  const addTaskToAllPersonnel = (task: Task) => {
    const taskToAdd = {
      ...task,
      id: task.isCustom ? `${task.id}-${Date.now()}` : task.id
    };
    
    personnel.forEach(person => {
      addTaskToPersonnel(person.id, taskToAdd);
    });
  };
  
  const updateTaskHours = (personnelId: string, taskId: string, hours: number) => {
    setPersonnel(prev => 
      prev.map(person => {
        if (person.id === personnelId) {
          return {
            ...person,
            tasks: person.tasks.map(task => 
              task.id === taskId
                ? { ...task, hours }
                : task
            )
          };
        }
        return person;
      })
    );
  };
  
  const removeTaskFromPersonnel = (personnelId: string, taskId: string) => {
    setPersonnel(prev => 
      prev.map(person => {
        if (person.id === personnelId) {
          return {
            ...person,
            tasks: person.tasks.filter(task => task.id !== taskId)
          };
        }
        return person;
      })
    );
    
    setBurnPlan(prev => ({
      ...prev,
      weeks: prev.weeks.map(week => ({
        ...week,
        allocations: week.allocations.filter(
          a => !(a.personnelId === personnelId && a.taskId === taskId)
        )
      }))
    }));
  };
  
  const removeTaskFromAllPersonnel = (taskId: string) => {
    setPersonnel(prev => 
      prev.map(person => ({
        ...person,
        tasks: person.tasks.filter(task => task.id !== taskId)
      }))
    );
    
    setBurnPlan(prev => ({
      ...prev,
      weeks: prev.weeks.map(week => ({
        ...week,
        allocations: week.allocations.filter(a => a.taskId !== taskId)
      }))
    }));
  };
  
  const calculatePersonnelCost = (personnelId: string) => {
    const person = personnel.find(p => p.id === personnelId);
    if (!person) return 0;
    
    return person.tasks.reduce((sum, task) => sum + (task.hours * person.billRate), 0);
  };
  
  const addRecipeToAllPersonnel = (recipe: Recipe) => {
    recipe.tasks.forEach(task => {
      const taskToAdd = {
        ...task,
        id: `${task.id}`
      };
      
      personnel.forEach(person => {
        if (!person.tasks.some(t => t.id === taskToAdd.id)) {
          addTaskToPersonnel(person.id, taskToAdd);
        }
      });
    });
  };
  
  const updateBurnPlanDates = (startDate: string, endDate: string) => {
    setBurnPlan(prev => ({
      ...prev,
      startDate,
      endDate
    }));
  };
  
  const updateBurnPlanAllocation = (allocation: {
    weekId: number;
    personnelId: string;
    taskId: string;
    hours: number;
  }) => {
    setBurnPlan(prev => {
      const updatedWeeks = [...prev.weeks];
      const week = updatedWeeks[allocation.weekId];
      
      if (!week) return prev;
      
      const existingAllocationIndex = week.allocations.findIndex(
        a => a.personnelId === allocation.personnelId && a.taskId === allocation.taskId
      );
      
      if (existingAllocationIndex >= 0) {
        week.allocations[existingAllocationIndex].hours = allocation.hours;
      } else {
        week.allocations.push({
          personnelId: allocation.personnelId,
          taskId: allocation.taskId,
          hours: allocation.hours
        });
      }
      
      return {
        ...prev,
        weeks: updatedWeeks
      };
    });
  };
  
  const PROFIT_MARGIN = 0.3;
  
  const getTotalCost = () => {
    return personnel.reduce((sum, person) => {
      return sum + person.tasks.reduce((taskSum, task) => {
        return taskSum + (task.hours * person.billRate);
      }, 0);
    }, 0);
  };
  
  const getTotalCostWithoutMargin = () => {
    const totalCost = getTotalCost();
    return totalCost / (1 + PROFIT_MARGIN);
  };
  
  const getProfitAmount = () => {
    const totalCost = getTotalCost();
    const costWithoutMargin = getTotalCostWithoutMargin();
    return totalCost - costWithoutMargin;
  };

  const loadProjectData = (data: { personnel: Personnel[]; burnPlan: BurnPlan }) => {
    setPersonnel(data.personnel);
    setBurnPlan(data.burnPlan);
  };
  
  return (
    <ProposalContext.Provider
      value={{
        personnel,
        burnPlan,
        addPersonnel,
        removePersonnel,
        updatePersonnelRole,
        updatePersonnelBillRate,
        updatePersonnelNotes,
        addTaskToPersonnel,
        addTaskToAllPersonnel,
        updateTaskHours,
        removeTaskFromPersonnel,
        removeTaskFromAllPersonnel,
        calculatePersonnelCost,
        addRecipeToAllPersonnel,
        updateBurnPlanDates,
        updateBurnPlanAllocation,
        getTotalCost,
        getTotalCostWithoutMargin,
        getProfitAmount,
        loadProjectData
      }}
    >
      {children}
    </ProposalContext.Provider>
  );
};

export const useProposalContext = () => {
  const context = useContext(ProposalContext);
  if (context === undefined) {
    throw new Error('useProposalContext must be used within a ProposalProvider');
  }
  return context;
};