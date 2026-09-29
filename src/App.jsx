import { supabase } from "./lib/supabase";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import ActionButtons from "./components/ActionButtons";
import SummaryCard from "./components/SummaryCard";
import BudgetModal from "./components/BudgetModal";
import ExpenseModal from "./components/ExpenseModal";
import ExpenseTable from "./components/ExpenseTable";
import HighestExpenseCard from "./components/HighestExpenseCard";
import ExpenseChart from "./components/ExpenseChart";
import MonthSelector from "./components/MonthSelector";
import AuthForm from "./components/AuthForm";
import {
  getBudgets,
  createBudget,
  updateBudget,
} from "./services/budgetService";

import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "./services/expenseService";

import {
  filterExpensesByMonth,
  calculateTotalExpense,
  calculateDailyTotals,
  findHighestExpenseDay,
} from "./utils/finance";

function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("2026-09");
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchBudgets();
    fetchExpenses();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchBudgets() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    try {
      const data = await getBudgets(user.id);

      setBudgets(data);
    } catch (error) {
      console.error("Gagal mengambil budget:", error);
    }
  }

  async function handleSaveBudget(data) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const existingBudget = budgets.find(
      (budget) => budget.month === data.month,
    );

    try {
      if (existingBudget) {
        await updateBudget(user.id, existingBudget.id, data);
      } else {
        await createBudget(user.id, data);
      }

      await fetchBudgets();

      return true;
    } catch (error) {
      console.error("Gagal menyimpan budget:", error);

      return false;
    }
  }

  async function fetchExpenses() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    try {
      const data = await getExpenses(user.id);
      setExpenses(data);
    } catch (error) {
      console.error("Gagal mengambil pengeluaran:", error);
    }
  }

  async function handleSaveExpense(data) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    try {
      if (editingExpense) {
        await updateExpense(user.id, editingExpense.id, data);

        setEditingExpense(null);
      } else {
        await createExpense(user.id, data);
      }

      await fetchExpenses();

      return true;
    } catch (error) {
      console.error("Gagal menyimpan pengeluaran:", error);

      return false;
    }
  }

  async function handleDeleteExpense(id) {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus pengeluaran ini?",
    );

    if (!confirmDelete) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    try {
      await deleteExpense(user.id, id);

      await fetchExpenses();
    } catch (error) {
      console.error("Gagal menghapus pengeluaran:", error);
    }
  }

  function handleEditExpense(expense) {
    setEditingExpense(expense);
    setShowExpenseModal(true);
  }

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

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-fuchsia-50 px-4 py-4 text-slate-800">
      <div className="mx-auto w-full max-w-md">
        {/* HEADER */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <Header />

          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-rose-500"
          >
            Logout
          </button>

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
