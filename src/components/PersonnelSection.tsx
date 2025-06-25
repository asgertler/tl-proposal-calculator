import React from 'react';
import { Trash2, UserPlus, X, Clock } from 'lucide-react';
import { useProposalContext } from '../context/ProposalContext';
import { formatCurrency } from '../utils/formatters';
import { roles } from '../data/roles';

const PersonnelSection = () => {
  const { 
    personnel,
    addPersonnel,
    removePersonnel,
    updatePersonnelRole,
    updatePersonnelBillRate,
    updatePersonnelNotes,
    updateTaskHours,
    calculatePersonnelCost,
    removeTaskFromAllPersonnel
  } = useProposalContext();
  
  const uniqueTasks = Array.from(new Set(
    personnel.flatMap(p => p.tasks.map(t => t.id))
  ));
  
  const getTaskName = (taskId: string) => {
    for (const person of personnel) {
      const task = person.tasks.find(t => t.id === taskId);
      if (task) return task.name;
    }
    return '';
  };

  const totalHours = personnel.reduce((maxHours, person) => {
    const personHours = person.tasks.reduce((sum, task) => sum + task.hours, 0);
    return Math.max(maxHours, personHours);
  }, 0);
  
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <button
          className="space-button-outline flex items-center gap-2"
          onClick={addPersonnel}
        >
          <UserPlus size={18} />
          Add Resource
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 bg-space-gray-800 p-3 text-left text-sm font-semibold text-space-gray-200 border-b border-space-gray-700 min-w-[200px]">Role</th>
              <th className="sticky left-[200px] z-20 bg-space-gray-800 p-3 text-left text-sm font-semibold text-space-gray-200 border-b border-space-gray-700 min-w-[200px]">Notes</th>
              <th className="sticky left-[400px] z-20 bg-space-gray-800 p-3 text-left text-sm font-semibold text-space-gray-200 border-b border-space-gray-700 min-w-[150px]">Bill Rate</th>
              {uniqueTasks.map(taskId => (
                <th key={taskId} className="bg-space-gray-800 p-3 text-center text-sm font-semibold text-space-gray-200 border-b border-space-gray-700 min-w-[120px] whitespace-nowrap">
                  <div className="flex items-center justify-between px-2">
                    {getTaskName(taskId)}
                    <button
                      className="text-space-gray-400 hover:text-red-500 transition-colors"
                      onClick={() => removeTaskFromAllPersonnel(taskId)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </th>
              ))}
              <th className="bg-space-gray-800 p-3 text-right text-sm font-semibold text-space-gray-200 border-b border-space-gray-700 min-w-[120px]">Total Cost</th>
              <th className="bg-space-gray-800 p-3 text-center text-sm font-semibold text-space-gray-200 border-b border-space-gray-700 w-[80px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {personnel.map(person => (
              <tr key={person.id} className="hover:bg-space-gray-800/50">
                <td className="sticky left-0 z-10 bg-space-gray-900 p-3 border-b border-space-gray-700">
                  <select 
                    className="space-input w-full"
                    value={person.role.id}
                    onChange={(e) => {
                      const role = roles.find(r => r.id === e.target.value);
                      if (role) updatePersonnelRole(person.id, role);
                    }}
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="sticky left-[200px] z-10 bg-space-gray-900 p-3 border-b border-space-gray-700">
                  <textarea
                    className="space-input min-h-[60px] resize-y"
                    placeholder="Add notes..."
                    value={person.notes || ''}
                    onChange={(e) => updatePersonnelNotes(person.id, e.target.value)}
                  />
                </td>
                <td className="sticky left-[400px] z-10 bg-space-gray-900 p-3 border-b border-space-gray-700">
                  <input
                    type="number"
                    className="space-input"
                    value={person.billRate}
                    onChange={(e) => updatePersonnelBillRate(person.id, Number(e.target.value))}
                  />
                </td>
                {uniqueTasks.map(taskId => {
                  const task = person.tasks.find(t => t.id === taskId);
                  return (
                    <td key={taskId} className="p-3 border-b border-space-gray-700 text-center">
                      <input
                        type="number"
                        className="space-input w-24 text-center"
                        value={task?.hours || 0}
                        onChange={(e) => updateTaskHours(person.id, taskId, Number(e.target.value))}
                      />
                    </td>
                  );
                })}
                <td className="p-3 border-b border-space-gray-700 text-right font-medium text-white">
                  {formatCurrency(calculatePersonnelCost(person.id))}
                </td>
                <td className="p-3 border-b border-space-gray-700 text-center">
                  <button
                    className="text-red-500 hover:text-red-700 transition-colors"
                    onClick={() => removePersonnel(person.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <div className="bg-space-gray-800 p-4 rounded-lg border border-space-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={20} className="text-space-blue-light" />
            <h3 className="text-lg">Total Hours</h3>
          </div>
          <p className="text-2xl text-white">{totalHours} hrs</p>
          <p className="text-sm text-space-gray-400 mt-1">Maximum parallel work hours</p>
        </div>
      </div>
    </>
  );
};

export default PersonnelSection;