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
import AuthForm from "./components/AuthForm";
import { useAuth } from "./hooks/useAuth";
import { useFinance } from "./hooks/useFinance";
import { useFinanceSummary } from "./hooks/useFinanceSummary";
import { exportExpensesToCsv } from "./utils/exportCsv";

function App() {
  const { session, user, authLoading, Logout } = useAuth();
  const {
    budgets,
    expenses,
    editingExpense,
    setEditingExpense,
    saveBudget,
    saveExpense,
    removeExpense,
    isSaving,
  } = useFinance(user);

  const now = new Date();

  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}`;

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const {
    currentBudget,
    filteredExpenses,
    totalExpense,
    budgetAmount,
    remainingBudget,
    budgetUsage,
    dailyTotals,
    highestExpenseDay,
  } = useFinanceSummary(budgets, expenses, selectedMonth);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [previousUserId, setPreviousUserId] = useState(user?.id);

  if (previousUserId !== user?.id) {
    setPreviousUserId(user?.id);
    setCurrentPage(1);
  }

  function handleEditExpense(expense) {
    setEditingExpense(expense);
    setShowExpenseModal(true);
  }

  function handleExportCsv() {
    exportExpensesToCsv(
      filteredExpenses,
      selectedMonth,
      budgetAmount,
      totalExpense,
      remainingBudget,
    );
  }

  const sortedExpenses = [...filteredExpenses].reverse();

  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);

  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;

  const paginatedExpenses = sortedExpenses.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

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

          <MonthSelector
            selectedMonth={selectedMonth}
            onChange={(month) => {
              setSelectedMonth(month);
              setCurrentPage(1);
            }}
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
          expenses={paginatedExpenses}
          onEdit={handleEditExpense}
          onDelete={removeExpense}
        />

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              disabled={safeCurrentPage === 1}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sebelumnya
            </button>

            <span className="text-sm text-slate-500">
              {safeCurrentPage} / {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
              disabled={safeCurrentPage === totalPages}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        )}

        <button
          onClick={handleExportCsv}
          disabled={filteredExpenses.length === 0}
          className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Export CSV
        </button>

        <div className="mt-6 border-t border-gray-200 pt-4 pb-6">
          <p className="mb-3 text-center text-xs text-gray-400">
            {user?.email}
          </p>

          <button
            onClick={Logout}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            Logout
          </button>
        </div>

        {/* MODALS */}
        {showBudgetModal && (
          <BudgetModal
            budget={currentBudget}
            selectedMonth={selectedMonth}
            onClose={() => setShowBudgetModal(false)}
            onSave={saveBudget}
            isSaving={isSaving}
          />
        )}

        {showExpenseModal && (
          <ExpenseModal
            onClose={() => {
              setShowExpenseModal(false);
              setEditingExpense(null);
            }}
            onSave={saveExpense}
            expense={editingExpense}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}

export default App;
