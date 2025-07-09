import React, { useRef, useState } from 'react';
import { DollarSign, Share2 } from 'lucide-react';
import { useProposalContext } from '../context/ProposalContext';
import { formatCurrency } from '../utils/formatters';
import ExportDialog from './ExportDialog';

const CostSummary = () => {
  const { 
    personnel, 
    burnPlan,
    getTotalCost,
    getTotalCostWithoutMargin,
    getProfitAmount
  } = useProposalContext();
  
  const [showExportDialog, setShowExportDialog] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const totalCost = getTotalCost();
  const totalWithoutMargin = getTotalCostWithoutMargin();
  const profitAmount = getProfitAmount();
  
  const roleData = personnel.reduce((acc, person) => {
    const roleKey = person.role.name;
    const totalHours = person.tasks.reduce((sum, task) => sum + task.hours, 0);
    const totalCost = totalHours * person.billRate;
    
    if (!acc[roleKey]) {
      acc[roleKey] = {
        hours: 0,
        billRate: person.billRate,
        cost: 0,
        notes: []
      };
    }
    
    acc[roleKey].hours += totalHours;
    acc[roleKey].cost += totalCost;
    if (person.notes) {
      acc[roleKey].notes.push(person.notes);
    }
    
    return acc;
  }, {} as Record<string, { hours: number; billRate: number; cost: number; notes: string[] }>);
  
  return (
    <section 
      ref={contentRef}
      className="space-card print:shadow-none"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <DollarSign size={24} className="text-space-blue-light" />
          <h2 className="text-2xl">Cost Summary</h2>
        </div>
        
        <button
          className="space-button-outline flex items-center gap-2"
          onClick={() => setShowExportDialog(true)}
        >
          <Share2 size={18} />
          Export
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="dark:bg-space-gray-800 p-4 rounded-lg border dark:border-space-gray-700">
          <h3 className="text-lg text-space-gray-200 mb-2">Total Cost</h3>
          <p className="text-3xl dark:text-white">{formatCurrency(totalCost)}</p>
          <p className="text-sm text-space-gray-400 mt-1">Includes 30% profit margin</p>
        </div>
        
        <div className="dark:bg-space-gray-800 p-4 rounded-lg border dark:border-space-gray-700">
          <h3 className="text-lg text-space-gray-200 mb-2">Base Cost</h3>
          <p className="text-3xl dark:text-white">{formatCurrency(totalWithoutMargin)}</p>
          <p className="text-sm text-space-gray-400 mt-1">Cost without profit margin</p>
        </div>
        
        <div className="dark:bg-space-gray-800 p-4 rounded-lg border dark:border-space-gray-700">
          <h3 className="text-lg text-space-gray-200 mb-2">Profit</h3>
          <p className="text-3xl text-space-blue-light">{formatCurrency(profitAmount)}</p>
          <p className="text-sm text-space-gray-400 mt-1">30% profit margin</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="dark:bg-space-gray-800">
              <th className="p-3 text-left text-sm text-space-gray-200 border-b border-space-gray-700">Role</th>
              <th className="p-3 text-left text-sm text-space-gray-200 border-b border-space-gray-700">Notes</th>
              <th className="p-3 text-center text-sm text-space-gray-200 border-b border-space-gray-700">Hours</th>
              <th className="p-3 text-center text-sm text-space-gray-200 border-b border-space-gray-700">Bill Rate</th>
              <th className="p-3 text-right text-sm text-space-gray-200 border-b border-space-gray-700">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(roleData).map(([role, data]) => (
              <tr key={role} className="hover:bg-space-gray-800/50">
                <td className="p-3 border-b dark:border-space-gray-700 text-space-gray-100">{role}</td>
                <td className="p-3 border-b dark:border-space-gray-700 text-space-gray-100 max-w-[300px]">
                  {data.notes.length > 0 ? (
                    <ul className="list-disc list-inside text-sm">
                      {data.notes.map((note, index) => (
                        <li key={index} className="truncate">{note}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-space-gray-400 text-sm italic">No notes</span>
                  )}
                </td>
                <td className="p-3 border-b dark:border-space-gray-700 text-center text-space-gray-100">{data.hours}</td>
                <td className="p-3 border-b dark:border-space-gray-700 text-center text-space-gray-100">{formatCurrency(data.billRate)}</td>
                <td className="p-3 border-b dark:border-space-gray-700 text-right font-medium text-white">{formatCurrency(data.cost)}</td>
              </tr>
            ))}
            
            <tr className="dark:bg-space-gray-800 font-semibold">
              <td colSpan={4} className="p-3 border-t-2 dark:border-space-gray-600 text-right">Total:</td>
              <td className="p-3 border-t-2 dark:border-space-gray-600 text-right text-lg dark:text-white">{formatCurrency(totalCost)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        personnel={personnel}
        burnPlan={burnPlan}
        burnPlanHtml=""
        costSummaryHtml={contentRef.current?.innerHTML || ''}
      />
    </section>
  );
};

export default CostSummary;