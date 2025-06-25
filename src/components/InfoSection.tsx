import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const InfoSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <section className="space-card">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2">
          <HelpCircle className="text-space-blue-light" size={24} />
          <h2 className="text-2xl">How to Use</h2>
        </div>
        {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </div>
      
      {isExpanded && (
        <div className="mt-4 text-light-text-primary dark:text-space-gray-100 space-y-3 animate-fadeIn">
          <p>
            This pricing calculator helps you model and price deliverables, core offerings, and activities required for delivery. 
            Follow these steps to get started:
          </p>
          
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Add personnel by clicking the "Add Personnel" button</li>
            <li>Configure each person's role and bill rate</li>
            <li>Select tasks from the task library or apply a predefined recipe</li>
            <li>Adjust the estimated hours for each task as needed</li>
            <li>Set up a burn plan calendar if you need to distribute hours over time</li>
            <li>Review the total cost summary with and without profit margin</li>
            <li>Export to PDF when you're ready to share or present</li>
          </ol>
          
          <p className="mt-4 italic text-light-text-secondary dark:text-space-gray-300">
            Note: All calculations are performed locally in your browser - no data is sent to any server.
          </p>
        </div>
      )}
    </section>
  );
};

export default InfoSection;