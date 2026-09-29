import { useState } from "react";
import Header from "./components/Header";
import ActionButtons from "./components/ActionButtons";
import SummaryCard from "./components/SummaryCard";
import BudgetModal from "./components/BudgetModal";
import ExpenseModal from "./components/ExpenseModal";
import ExpenseTable from "./components/ExpenseTable";
import HighestExpenseCard from "./components/HighestExpenseCard";
import ExpenseChart from "./components/ExpenseChart";
import MonthSelector from "./components/MonthSelector";

function App() {
  const [selectedMonth, setSelectedMonth] = useState("2026-09");
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  function handleSaveBudget(data) {
    const existingBudget = budgets.find(
      (budget) => budget.month === data.month,
    );

    if (existingBudget) {
      const updatedBudgets = budgets.map((budget) =>
        budget.month === data.month
          ? { ...budget, amount: data.amount }
          : budget,
      );
      setBudgets(updatedBudgets);
    } else {
      setBudgets([
        ...budgets,
        {
          id: Date.now(),
          month: data.month,
          amount: data.amount,
        },
      ]);
    }
  }

  function handleSaveExpense(data) {
    if (editingExpense) {
      const updatedExpenses = expenses.map((expense) =>
        expense.id === editingExpense.id
          ? { ...data, id: editingExpense.id }
          : expense,
      );
      setExpenses(updatedExpenses);
      setEditingExpense(null);
    } else {
      setExpenses([...expenses, data]);
    }
  }

  function handleDeleteExpense(id) {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
  }

  function handleEditExpense(expense) {
    setEditingExpense(expense);
    setShowExpenseModal(true);
  }

  const currentBudget = budgets.find(
    (budget) => budget.month === selectedMonth,
  );

  const filteredExpenses = expenses.filter((expense) =>
    expense.date.startsWith(selectedMonth),
  );

  const totalExpense = filteredExpenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );

  const budgetAmount = currentBudget ? currentBudget.amount : 0;

  const remainingBudget = budgetAmount - totalExpense;

  const budgetUsage =
    budgetAmount > 0 ? Math.min((totalExpense / budgetAmount) * 100, 100) : 0;

  const dailyTotals = filteredExpenses.reduce((acc, expense) => {
    if (!acc[expense.date]) {
      acc[expense.date] = 0;
    }

    acc[expense.date] += expense.amount;

    return acc;
  }, {});

  const highestExpenseDay = Object.entries(dailyTotals).reduce(
    (highest, current) => {
      if (!highest || current[1] > highest[1]) {
        return current;
      }

      return highest;
    },
    null,
  );

  const latestExpenses = filteredExpenses.slice(-4).reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-fuchsia-50 px-4 py-4 text-slate-800">
      <div className="mx-auto w-full max-w-md">
        {/* HEADER */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <Header />

          <MonthSelector
            selectedMonth={selectedMonth}
            onChange={setSelectedMonth}
          />
        </div>

        {/* ACTION BUTTON */}
        <div className="mb-4">
          <ActionButtons
            onAddBudget={() => setShowBudgetModal(true)}
            onAddExpense={() => setShowExpenseModal(true)}
          />
        </div>

        {/* SUMMARY */}
        <div className="mb-4 overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-lg backdrop-blur-xl">
          <div className="grid grid-cols-3">
            <SummaryCard
              title="Budget Bulanan"
              amount={`Rp${budgetAmount.toLocaleString("id-ID")}`}
              onEdit={() => setShowBudgetModal(true)}
            />

            <SummaryCard
              title="Total Pengeluaran"
              amount={`Rp${totalExpense.toLocaleString("id-ID")}`}
            />

            <SummaryCard
              title="Sisa Budget"
              amount={`Rp${remainingBudget.toLocaleString("id-ID")}`}
            />
          </div>

          <div className="px-4 pb-4">
            <div className="h-2 overflow-hidden rounded-full bg-slate-200/70">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400"
                style={{ width: `${budgetUsage}%` }}
              />
            </div>

            <p className="mt-2 text-center text-xs font-medium text-slate-500">
              {budgetUsage.toFixed(1)}% terpakai
            </p>
          </div>
        </div>

        {/* HIGHEST EXPENSE */}
        <HighestExpenseCard data={highestExpenseDay} />

        {/* CHART */}
        <ExpenseChart dailyTotals={dailyTotals} />

        {/* EXPENSE TABLE */}
        <ExpenseTable
          expenses={latestExpenses}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
        />

        {/* MODALS */}
        {showBudgetModal && (
          <BudgetModal
            budget={currentBudget}
            selectedMonth={selectedMonth}
            onClose={() => setShowBudgetModal(false)}
            onSave={handleSaveBudget}
          />
        )}

        {showExpenseModal && (
          <ExpenseModal
            onClose={() => {
              setShowExpenseModal(false);
              setEditingExpense(null);
            }}
            onSave={handleSaveExpense}
            expense={editingExpense}
          />
        )}
      </div>
    </div>
  );
}

export default App;
