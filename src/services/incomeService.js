import { supabase } from "../lib/supabase";

export async function getIncomes(userId) {
  const { data, error } = await supabase
    .from("incomes")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((income) => ({
    id: income.id,
    date: income.date,
    description: income.description,
    amount: Number(income.amount),
  }));
}

export async function createIncome(userId, income) {
  const { error } = await supabase.from("incomes").insert({
    user_id: userId,
    date: income.date,
    description: income.description,
    amount: income.amount,
  });

  if (error) throw error;
}

export async function updateIncome(userId, id, income) {
  const { error } = await supabase
    .from("incomes")
    .update({
      date: income.date,
      description: income.description,
      amount: income.amount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function deleteIncome(userId, id) {
  const { error } = await supabase
    .from("incomes")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}
