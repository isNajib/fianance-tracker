import {
  filterExpensesByMonth,
  calculateTotalExpense,
  calculateDailyTotals,
  findHighestExpenseDay,
} from "../utils/finance";

export function useFinanceSummary(budgets, expenses, selectedMonth) {
  const currentBudget = budgets.find(
    (budget) => budget.month === selectedMonth,
  );

  const filteredExpenses = filterExpensesByMonth(expenses, selectedMonth);

  const totalExpense = calculateTotalExpense(filteredExpenses);

  const budgetAmount = currentBudget ? Number(currentBudget.amount) : 0;

  const remainingBudget = budgetAmount - totalExpense;

  const budgetUsage =
    budgetAmount > 0 ? Math.min((totalExpense / budgetAmount) * 100, 100) : 0;

  const dailyTotals = calculateDailyTotals(filteredExpenses);

  const highestExpenseDay = findHighestExpenseDay(dailyTotals);

  const latestExpenses = filteredExpenses.slice(-4).reverse();

  return {
    currentBudget,
    filteredExpenses,
    totalExpense,
    budgetAmount,
    remainingBudget,
    budgetUsage,
    dailyTotals,
    highestExpenseDay,
    latestExpenses,
  };
}
