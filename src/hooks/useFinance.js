import { useEffect, useState } from "react";

import {
  getBudgets,
  createBudget,
  updateBudget,
} from "../services/budgetService";

import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../services/expenseService";

import {
  getIncomes,
  createIncome,
  updateIncome,
  deleteIncome,
} from "../services/incomeService";

export function useFinance(user) {
  const userId = user?.id;
  const [budgetState, setBudgetState] = useState({ userId: null, data: [] });
  const [expenseState, setExpenseState] = useState({ userId: null, data: [] });
  const [incomeState, setIncomeState] = useState({
    userId: null,
    data: [],
  });
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const budgets = budgetState.userId === userId ? budgetState.data : [];
  const expenses = expenseState.userId === userId ? expenseState.data : [];
  const incomes = incomeState.userId === userId ? incomeState.data : [];

  async function fetchBudgets() {
    if (!userId) return;

    try {
      const data = await getBudgets(userId);
      setBudgetState({ userId, data });
    } catch (error) {
      console.error("Gagal mengambil budget:", error);
    }
  }

  async function fetchExpenses() {
    if (!userId) return;

    try {
      const data = await getExpenses(userId);
      setExpenseState({ userId, data });
    } catch (error) {
      console.error("Gagal mengambil pengeluaran:", error);
    }
  }

  async function fetchIncomes() {
    if (!userId) return;

    try {
      const data = await getIncomes(userId);

      setIncomeState({
        userId,
        data,
      });
    } catch (error) {
      console.error("Gagal mengambil income:", error);
    }
  }

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    async function loadBudgets() {
      try {
        const data = await getBudgets(userId);

        if (!cancelled) {
          setBudgetState({
            userId,
            data,
          });
        }
      } catch (error) {
        console.error("Gagal mengambil budget:", error);
      }
    }

    async function loadExpenses() {
      try {
        const data = await getExpenses(userId);

        if (!cancelled) {
          setExpenseState({
            userId,
            data,
          });
        }
      } catch (error) {
        console.error("Gagal mengambil pengeluaran:", error);
      }
    }

    async function loadIncomes() {
      try {
        const data = await getIncomes(userId);

        if (!cancelled) {
          setIncomeState({
            userId,
            data,
          });
        }
      } catch (error) {
        console.error("Gagal mengambil income:", error);
      }
    }

    loadBudgets();
    loadExpenses();
    loadIncomes();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function saveBudget(data) {
    if (!userId) return false;

    setIsSaving(true);

    try {
      const existingBudget = data.id
        ? budgets.find((budget) => budget.id === data.id)
        : data.periodType === "monthly"
          ? budgets.find(
              (budget) =>
                budget.period_type === "monthly" && budget.month === data.month,
            )
          : null;

      if (existingBudget) {
        await updateBudget(userId, existingBudget.id, data);
      } else {
        await createBudget(userId, data);
      }

      const updatedBudgets = await getBudgets(userId);

      setBudgetState({
        userId,
        data: updatedBudgets,
      });

      return { success: true };
    } catch (error) {
      console.error("Gagal menyimpan budget:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    } finally {
      setIsSaving(false);
    }
  }

  async function saveExpense(data) {
    if (!userId) return false;

    setIsSaving(true);

    try {
      if (editingExpense) {
        await updateExpense(userId, editingExpense.id, data);

        setEditingExpense(null);
      } else {
        await createExpense(userId, data);
      }

      await fetchExpenses();

      return true;
    } catch (error) {
      console.error("Gagal menyimpan pengeluaran:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function removeExpense(id) {
    if (!userId) return false;

    const confirmDelete = window.confirm(
      "Yakin ingin menghapus pengeluaran ini?",
    );

    if (!confirmDelete) return false;

    try {
      await deleteExpense(userId, id);
      await fetchExpenses();

      return true;
    } catch (error) {
      console.error("Gagal menghapus pengeluaran:", error);
      return false;
    }
  }

  async function saveIncome(data) {
    if (!user) return false;

    setIsSaving(true);

    try {
      if (editingIncome) {
        await updateIncome(user.id, editingIncome.id, data);

        setEditingIncome(null);
      } else {
        await createIncome(user.id, data);
      }

      await fetchIncomes();

      return true;
    } catch (error) {
      console.error("Gagal menyimpan income:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function removeIncome(id) {
    if (!user) return false;

    const confirmDelete = window.confirm("Yakin ingin menghapus income ini?");

    if (!confirmDelete) return false;

    try {
      await deleteIncome(user.id, id);
      await fetchIncomes();

      return true;
    } catch (error) {
      console.error("Gagal menghapus income:", error);
      return false;
    }
  }

  return {
    budgets,
    expenses,
    incomes,

    editingExpense,
    setEditingExpense,

    editingIncome,
    setEditingIncome,

    saveBudget,
    saveExpense,
    saveIncome,

    removeExpense,
    removeIncome,

    isSaving,
  };
}
