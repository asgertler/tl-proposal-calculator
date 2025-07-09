export interface Task {
  id: string;
  name: string;
  hours: number;
  isCustom?: boolean;
}

export interface Role {
  id: number;
  title: string;
  defaultRate: number;
}

export interface Personnel {
  id: string;
  name: string;
  role: Role;
  billRate: number;
  tasks: Task[];
  notes?: string;
}

export interface BurnPlanAllocation {
  personnelId: string;
  taskId: string;
  hours: number;
}

export interface WeekRange {
  startDate: string;
  endDate: string;
  allocations: BurnPlanAllocation[];
}

export interface BurnPlan {
  startDate: string;
  endDate: string;
  weeks: WeekRange[];
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}