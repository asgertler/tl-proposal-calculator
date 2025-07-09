import { utils, write } from 'xlsx';
import type { Personnel, BurnPlan, WeekRange } from '../types';
import { formatCurrency } from './formatters';

export const exportToExcel = (personnel: Personnel[], burnPlan: BurnPlan) => {
  // Create burn plan worksheet
  const burnPlanData = burnPlan.weeks.map((week: WeekRange, weekIndex: number) => {
    const row: any = {
      'Week': `Week ${weekIndex + 1}`,
      'Date Range': `${week.startDate} - ${week.endDate}`,
    };

    personnel.forEach(person => {
      const allocation = week.allocations.find(a => a.personnelId === person.id);
      row[`${person.role.title} Hours`] = allocation?.hours || 0;
    });

    return row;
  });

  // Create cost summary worksheet
  const costSummaryData = personnel.map(person => {
    const totalHours = person.tasks.reduce((sum, task) => sum + task.hours, 0);
    const totalCost = totalHours * person.billRate;

    return {
      'Role': person.role.title,
      'Bill Rate': formatCurrency(person.billRate),
      'Total Hours': totalHours,
      'Total Cost': formatCurrency(totalCost),
      'Notes': person.notes || '',
    };
  });

  const workbook = utils.book_new();
  
  utils.book_append_sheet(
    workbook,
    utils.json_to_sheet(burnPlanData),
    'Burn Plan'
  );
  
  utils.book_append_sheet(
    workbook,
    utils.json_to_sheet(costSummaryData),
    'Cost Summary'
  );

  const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
  
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'proposal-plan.xlsx';
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToCSV = (personnel: Personnel[], burnPlan: BurnPlan) => {
  // Combine burn plan and cost summary data
  let csv = 'Burn Plan\n';
  csv += 'Week,Date Range,' + personnel.map(p => `${p.role.ntitleame} Hours`).join(',') + '\n';

  burnPlan.weeks.forEach((week, weekIndex) => {
    const row = [
      `Week ${weekIndex + 1}`,
      `${week.startDate} - ${week.endDate}`,
    ];

    personnel.forEach(person => {
      const allocation = week.allocations.find(a => a.personnelId === person.id);
      row.push(allocation?.hours || 0);
    });

    csv += row.join(',') + '\n';
  });

  csv += '\nCost Summary\n';
  csv += 'Role,Bill Rate,Total Hours,Total Cost,Notes\n';

  personnel.forEach(person => {
    const totalHours = person.tasks.reduce((sum, task) => sum + task.hours, 0);
    const totalCost = totalHours * person.billRate;

    csv += [
      person.role.name,
      formatCurrency(person.billRate),
      totalHours,
      formatCurrency(totalCost),
      person.notes || '',
    ].join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'proposal-plan.csv';
  link.click();
  URL.revokeObjectURL(url);
};