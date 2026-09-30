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

export function useFinance(user) {
  const userId = user?.id;
  const [budgetState, setBudgetState] = useState({ userId: null, data: [] });
  const [expenseState, setExpenseState] = useState({ userId: null, data: [] });
  const [editingExpense, setEditingExpense] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const budgets = budgetState.userId === userId ? budgetState.data : [];
  const expenses = expenseState.userId === userId ? expenseState.data : [];

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

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    async function loadBudgets() {
      try {
        const data = await getBudgets(userId);
        if (!cancelled) setBudgetState({ userId, data });
      } catch (error) {
        console.error("Gagal mengambil budget:", error);
      }
    }

    async function loadExpenses() {
      try {
        const data = await getExpenses(userId);
        if (!cancelled) setExpenseState({ userId, data });
      } catch (error) {
        console.error("Gagal mengambil pengeluaran:", error);
      }
    }

    loadBudgets();
    loadExpenses();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function saveBudget(data) {
    if (!userId) return false;

    setIsSaving(true);

    const existingBudget = budgets.find(
      (budget) => budget.month === data.month,
    );

    try {
      if (existingBudget) {
        await updateBudget(userId, existingBudget.id, data);
      } else {
        await createBudget(userId, data);
      }

      await fetchBudgets();

      return true;
    } catch (error) {
      console.error("Gagal menyimpan budget:", error);
      return false;
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

  return {
    budgets,
    expenses,

    editingExpense,
    setEditingExpense,

    saveBudget,
    saveExpense,
    removeExpense,
    isSaving,
  };
}
