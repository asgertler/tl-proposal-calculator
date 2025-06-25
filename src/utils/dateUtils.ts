import type { WeekRange } from '../types';

/**
 * Generate week ranges between start and end dates
 */
export const generateWeekRanges = (startDateStr: string, endDateStr: string): WeekRange[] => {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  
  // Ensure dates are valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return [];
  }
  
  const weeks: WeekRange[] = [];
  let currentStart = new Date(startDate);
  
  while (currentStart < endDate) {
    // Calculate end of this week (or the project end date, whichever comes first)
    let currentEnd = new Date(currentStart);
    currentEnd.setDate(currentStart.getDate() + 6); // 7 days total (today + 6)
    
    if (currentEnd > endDate) {
      currentEnd = new Date(endDate);
    }
    
    weeks.push({
      startDate: currentStart.toISOString().split('T')[0],
      endDate: currentEnd.toISOString().split('T')[0],
      allocations: []
    });
    
    // Move to start of next week
    currentStart = new Date(currentEnd);
    currentStart.setDate(currentEnd.getDate() + 1);
  }
  
  return weeks;
};