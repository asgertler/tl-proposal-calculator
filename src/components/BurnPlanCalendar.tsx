import React, { useRef, useState } from 'react';
import { Share2 } from 'lucide-react';
import { useProposalContext } from '../context/ProposalContext';
import { formatDate } from '../utils/formatters';
import ExportDialog from './ExportDialog';

const BurnPlanCalendar = () => {
  const { 
    personnel, 
    burnPlan,
    updateBurnPlanDates,
    updateBurnPlanAllocation,
    updatePersonnelNotes
  } = useProposalContext();
  
  const [showExportDialog, setShowExportDialog] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBurnPlanDates(e.target.value, burnPlan.endDate);
  };
  
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBurnPlanDates(burnPlan.startDate, e.target.value);
  };
  
  const weekRanges = burnPlan.weeks.map((week, index) => {
    return {
      id: index,
      label: `Week ${index + 1}`,
      startDate: formatDate(week.startDate),
      endDate: formatDate(week.endDate)
    };
  });
  
  const resourceHours = personnel.map(person => {
    const totalHours = person.tasks.reduce((sum, task) => sum + task.hours, 0);
    const hoursPerWeek = Math.floor(totalHours / weekRanges.length);
    const remainingHours = totalHours % weekRanges.length;
    
    return {
      id: person.id,
      name: person.name,
      role: person.role.name,
      notes: person.notes || '',
      totalHours,
      hoursPerWeek,
      remainingHours
    };
  });
  
  const totalTaskHours = personnel.reduce(
    (sum, person) => sum + person.tasks.reduce((taskSum, task) => taskSum + task.hours, 0),
    0
  );
  
  const allocatedHours = resourceHours.reduce((total, resource) => {
    const resourceTotal = weekRanges.reduce((weekTotal, _, weekIndex) => {
      const suggestedHours = resource.hoursPerWeek + (weekIndex < resource.remainingHours ? 1 : 0);
      const allocation = burnPlan.weeks[weekIndex].allocations.find(
        a => a.personnelId === resource.id
      );
      return weekTotal + (allocation?.hours || suggestedHours);
    }, 0);
    return total + resourceTotal;
  }, 0);
  
  const hasAllocationDiscrepancy = Math.abs(allocatedHours - totalTaskHours) > 0.01;
  
  return (
    <section className="space-card">
      <div className="flex items-center justify-end gap-4 mb-6">
        <button
          className="space-button-outline flex items-center gap-2"
          onClick={() => setShowExportDialog(true)}
        >
          <Share2 size={18} />
          Export
        </button>
        
        <span className={`text-sm px-2 py-1 rounded-full ${
          hasAllocationDiscrepancy
            ? allocatedHours < totalTaskHours 
              ? 'bg-amber-900/50 text-amber-300' 
              : 'bg-red-900/50 text-red-300'
            : 'bg-green-900/50 text-green-300'
        }`}>
          {allocatedHours} / {totalTaskHours} hours allocated
        </span>
      </div>
      
      <div ref={contentRef}>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-space-gray-200">
              Project Start Date
            </label>
            <input
              type="date"
              className="space-input"
              value={burnPlan.startDate}
              onChange={handleStartDateChange}
            />
          </div>
          
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-space-gray-200">
              Project End Date
            </label>
            <input
              type="date"
              className="space-input"
              value={burnPlan.endDate}
              onChange={handleEndDateChange}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-space-gray-800">
                <th className="sticky left-0 z-20 bg-space-gray-800 p-3 text-left text-sm font-semibold text-space-gray-200 border-b border-space-gray-700 min-w-[250px]">
                  Resource & Total Hours
                </th>
                <th className="sticky left-[250px] z-20 bg-space-gray-800 p-3 text-left text-sm font-semibold text-space-gray-200 border-b border-space-gray-700 min-w-[200px]">
                  Notes
                </th>
                {weekRanges.map(week => (
                  <th key={week.id} className="p-2 text-center text-sm text-space-gray-200 border-b border-space-gray-700" style={{minWidth: '120px'}}>
                    <div>{week.label}</div>
                    <div className="text-xs text-space-gray-400">{week.startDate} - {week.endDate}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resourceHours.map((resource, resourceIndex) => (
                <tr key={resource.id} className="hover:bg-space-gray-800/50">
                  <td className="sticky left-0 z-10 bg-space-gray-900 p-3 border-b border-space-gray-700">
                    <div className="font-medium text-space-gray-100">{resource.role}</div>
                    <div className="text-sm text-space-gray-400">{resource.totalHours} total hours</div>
                  </td>
                  <td className="sticky left-[250px] z-10 bg-space-gray-900 p-3 border-b border-space-gray-700">
                    <textarea
                      className="space-input min-h-[60px] resize-y"
                      placeholder="Add notes..."
                      value={resource.notes}
                      onChange={(e) => updatePersonnelNotes(resource.id, e.target.value)}
                    />
                  </td>
                  {weekRanges.map((week, weekIndex) => {
                    const suggestedHours = resource.hoursPerWeek + (weekIndex < resource.remainingHours ? 1 : 0);
                    
                    const allocation = burnPlan.weeks[week.id].allocations.find(
                      a => a.personnelId === resource.id
                    );
                    
                    return (
                      <td key={week.id} className="p-2 border-b border-space-gray-700 text-center">
                        <input
                          type="number"
                          className="space-input text-center"
                          min={0}
                          step={1}
                          placeholder={suggestedHours.toString()}
                          value={allocation?.hours || suggestedHours}
                          onChange={(e) => {
                            const hours = Number(e.target.value);
                            personnel[resourceIndex].tasks.forEach(task => {
                              const taskHourRatio = task.hours / resource.totalHours;
                              updateBurnPlanAllocation({
                                weekId: week.id,
                                personnelId: resource.id,
                                taskId: task.id,
                                hours: Math.round(hours * taskHourRatio)
                              });
                            });
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {hasAllocationDiscrepancy && (
          <div className={`mt-4 p-3 rounded-md ${
            allocatedHours < totalTaskHours 
              ? 'bg-amber-900/20 text-amber-300 border border-amber-700' 
              : 'bg-red-900/20 text-red-300 border border-red-700'
          }`}>
            {allocatedHours < totalTaskHours ? (
              <p className="text-sm">
                Warning: You've only allocated {allocatedHours} out of {totalTaskHours} total hours.
                Distribute the remaining {totalTaskHours - allocatedHours} hours across weeks.
              </p>
            ) : (
              <p className="text-sm">
                Warning: You've over-allocated by {allocatedHours - totalTaskHours} hours.
                Reduce allocations to match the total of {totalTaskHours} hours.
              </p>
            )}
          </div>
        )}
      </div>

      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        personnel={personnel}
        burnPlan={burnPlan}
        burnPlanHtml={contentRef.current?.innerHTML || ''}
        costSummaryHtml=""
      />
    </section>
  );
};

export default BurnPlanCalendar;