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
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  async function fetchBudgets() {
    if (!user) return;

    try {
      const data = await getBudgets(user.id);
      setBudgets(data);
    } catch (error) {
      console.error("Gagal mengambil budget:", error);
    }
  }

  async function fetchExpenses() {
    if (!user) return;

    try {
      const data = await getExpenses(user.id);
      setExpenses(data);
    } catch (error) {
      console.error("Gagal mengambil pengeluaran:", error);
    }
  }

  useEffect(() => {
    if (!user) {
      setBudgets([]);
      setExpenses([]);
      return;
    }

    fetchBudgets();
    fetchExpenses();
  }, [user]);

  async function saveBudget(data) {
    if (!user) return false;

    setIsSaving(true);

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
    } finally {
      setIsSaving(false);
    }
  }

  async function saveExpense(data) {
    if (!user) return false;

    setIsSaving(true);

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
    } finally {
      setIsSaving(false);
    }
  }

  async function removeExpense(id) {
    if (!user) return false;

    const confirmDelete = window.confirm(
      "Yakin ingin menghapus pengeluaran ini?",
    );

    if (!confirmDelete) return false;

    try {
      await deleteExpense(user.id, id);
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
