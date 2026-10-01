import {
  filterExpensesByMonth,
  filterExpensesByDateRange,
  calculateTotalExpense,
  calculateDailyTotals,
  findHighestExpenseDay,
} from "../utils/finance";

export function useFinanceSummary(budgets, expenses, incomes, selectedMonth) {
  const monthlyBudget = budgets.find(
    (budget) =>
      budget.period_type === "monthly" && budget.month === selectedMonth,
  );

  const customBudget = budgets.find((budget) => {
    if (budget.period_type !== "custom") return false;

    const monthStart = `${selectedMonth}-01`;

    const [year, month] = selectedMonth.split("-").map(Number);

    const lastDay = new Date(year, month, 0).getDate();

    const monthEnd = `${selectedMonth}-${String(lastDay).padStart(2, "0")}`;

    return budget.start_date <= monthEnd && budget.end_date >= monthStart;
  });

  const currentBudget = customBudget ?? monthlyBudget;

  const filteredExpenses = currentBudget
    ? currentBudget.period_type === "custom"
      ? filterExpensesByDateRange(
          expenses,
          currentBudget.start_date,
          currentBudget.end_date,
        )
      : filterExpensesByMonth(expenses, selectedMonth)
    : filterExpensesByMonth(expenses, selectedMonth);

  const totalExpense = calculateTotalExpense(filteredExpenses);

  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    const category = expense.category || "Lainnya";

    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category] += Number(expense.amount);

    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);

  const budgetAmount = currentBudget ? Number(currentBudget.amount) : 0;

  const remainingBudget = budgetAmount - totalExpense;

  const budgetUsage =
    budgetAmount > 0 ? Math.min((totalExpense / budgetAmount) * 100, 100) : 0;

  const dailyTotals = calculateDailyTotals(filteredExpenses);

  const highestExpenseDay = findHighestExpenseDay(dailyTotals);

  const filteredIncomes = incomes.filter((income) =>
    income.date.startsWith(selectedMonth),
  );

  const monthlyIncome = filteredIncomes.reduce(
    (total, income) => total + Number(income.amount),
    0,
  );

  const monthlySaving = monthlyIncome - budgetAmount;

  const totalIncome = incomes.reduce(
    (total, income) => total + Number(income.amount),
    0,
  );

  const totalBudget = budgets.reduce(
    (total, budget) => total + Number(budget.amount),
    0,
  );

  const totalSaving = totalIncome - totalBudget;

  return {
    currentBudget,
    filteredExpenses,
    filteredIncomes,

    totalExpense,
    budgetAmount,
    remainingBudget,
    budgetUsage,

    monthlyIncome,
    monthlySaving,
    totalSaving,

    dailyTotals,
    highestExpenseDay,

    categoryChartData,
  };
}
