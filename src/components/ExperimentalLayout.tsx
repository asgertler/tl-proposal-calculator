import React, { useState } from 'react';
import { useProposalContext } from '../context/ProposalContext';
import { Rocket, Users, Calendar, DollarSign, Settings, Plus, ChevronRight, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const ExperimentalLayout = () => {
  const { 
    personnel,
    burnPlan,
    addPersonnel,
    getTotalCost,
    getTotalCostWithoutMargin
  } = useProposalContext();
  
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  
  const totalCost = getTotalCost();
  const baseCost = getTotalCostWithoutMargin();
  const profitMargin = totalCost - baseCost;
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Bar */}
      <header className="bg-black/50 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Rocket className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-light tracking-wider">MISSION PLANNER</h1>
          </div>
          <button className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Mission Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-light uppercase tracking-wider text-slate-400">Total Budget</h3>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-light">{formatCurrency(totalCost)}</p>
            <div className="mt-2 text-sm text-slate-500 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-green-500" />
              <span>30% margin included</span>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-light uppercase tracking-wider text-slate-400">Crew Size</h3>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-light">{personnel.length}</p>
            <div className="mt-2 text-sm text-slate-500 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-green-500" />
              <span>Active members</span>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-light uppercase tracking-wider text-slate-400">Mission Duration</h3>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-light">{burnPlan.weeks.length}W</p>
            <div className="mt-2 text-sm text-slate-500 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-green-500" />
              <span>Timeline estimate</span>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-light uppercase tracking-wider text-slate-400">Profit Margin</h3>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-light">{formatCurrency(profitMargin)}</p>
            <div className="mt-2 text-sm text-slate-500 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-green-500" />
              <span>Expected return</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-slate-900 rounded-lg border border-slate-800">
          {/* Section Navigation */}
          <div className="divide-y divide-slate-800">
            <button
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
              onClick={() => setSelectedSection(selectedSection === 'team' ? null : 'team')}
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="font-light uppercase tracking-wider">Crew Management</span>
              </div>
              <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${
                selectedSection === 'team' ? 'rotate-90' : ''
              }`} />
            </button>
            
            {selectedSection === 'team' && (
              <div className="px-6 py-4 bg-slate-900/50">
                <div className="space-y-4">
                  {personnel.map(person => (
                    <div 
                      key={person.id} 
                      className="bg-slate-800 rounded-lg p-4 border border-slate-700 
                               hover:border-blue-500/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-light uppercase tracking-wider">{person.role.title}</h4>
                        <span className="text-sm text-blue-500">{formatCurrency(person.billRate)}/hr</span>
                      </div>
                      <p className="text-sm text-slate-400">{person.notes || 'No notes added'}</p>
                    </div>
                  ))}
                  
                  <button
                    onClick={addPersonnel}
                    className="w-full py-4 flex items-center justify-center gap-2 text-blue-500 
                             hover:bg-slate-800 rounded-lg border border-dashed border-slate-700 
                             hover:border-blue-500/50 transition-colors uppercase tracking-wider text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Crew Member
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExperimentalLayout;