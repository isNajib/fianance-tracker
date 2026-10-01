export function filterExpensesByMonth(expenses, selectedMonth) {
  return expenses.filter((expense) => expense.date.startsWith(selectedMonth));
}

export function calculateTotalExpense(expenses) {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

export function calculateDailyTotals(expenses) {
  return expenses.reduce((acc, expense) => {
    if (!acc[expense.date]) {
      acc[expense.date] = 0;
    }

    acc[expense.date] += expense.amount;

    return acc;
  }, {});
}

export function findHighestExpenseDay(dailyTotals) {
  return Object.entries(dailyTotals).reduce((highest, current) => {
    if (!highest || current[1] > highest[1]) {
      return current;
    }

    return highest;
  }, null);
}

export function filterExpensesByDateRange(expenses, startDate, endDate) {
  return expenses.filter(
    (expense) => expense.date >= startDate && expense.date <= endDate,
  );
}
