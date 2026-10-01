import { supabase } from "../lib/supabase";

export async function getBudgets(userId) {
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", userId)
    .order("month", { ascending: true });

  if (error) throw error;

  return data ?? [];
}

function getMonthDateRange(month) {
  const [year, monthNumber] = month.split("-").map(Number);

  const startDate = `${month}-01`;

  const lastDay = new Date(year, monthNumber, 0).getDate();

  const endDate = `${month}-${String(lastDay).padStart(2, "0")}`;

  return {
    startDate,
    endDate,
  };
}

export async function createBudget(userId, budget) {
  let startDate = budget.startDate;
  let endDate = budget.endDate;

  if (budget.periodType === "monthly") {
    const range = getMonthDateRange(budget.month);

    startDate = range.startDate;
    endDate = range.endDate;
  }

  const { error } = await supabase.from("budgets").insert({
    user_id: userId,
    month: budget.periodType === "monthly" ? budget.month : null,
    name: budget.periodType === "monthly" ? budget.month : budget.name,
    period_type: budget.periodType,
    start_date: startDate,
    end_date: endDate,
    amount: budget.amount,
  });

  if (error) throw error;
}

export async function updateBudget(userId, id, budget) {
  let startDate = budget.startDate;
  let endDate = budget.endDate;

  if (budget.periodType === "monthly") {
    const range = getMonthDateRange(budget.month);

    startDate = range.startDate;
    endDate = range.endDate;
  }

  const { error } = await supabase
    .from("budgets")
    .update({
      month: budget.periodType === "monthly" ? budget.month : null,

      name: budget.periodType === "monthly" ? budget.month : budget.name,

      period_type: budget.periodType,
      start_date: startDate,
      end_date: endDate,
      amount: budget.amount,

      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}
