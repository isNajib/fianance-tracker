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

export async function createBudget(userId, budget) {
  const { error } = await supabase.from("budgets").insert({
    user_id: userId,
    month: budget.month,
    amount: budget.amount,
  });

  if (error) throw error;
}

export async function updateBudget(userId, id, budget) {
  const { error } = await supabase
    .from("budgets")
    .update({
      amount: budget.amount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}
