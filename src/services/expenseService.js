import { supabase } from "../lib/supabase";

export async function getExpenses(userId) {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((expense) => ({
    id: expense.id,
    date: expense.date,
    description: expense.description,
    amount: Number(expense.amount),
    paymentMethod: expense.payment_method,
  }));
}

export async function createExpense(userId, expense) {
  const { error } = await supabase.from("expenses").insert({
    user_id: userId,
    date: expense.date,
    description: expense.description,
    amount: expense.amount,
    payment_method: expense.paymentMethod,
  });

  if (error) throw error;
}

export async function updateExpense(userId, id, expense) {
  const { error } = await supabase
    .from("expenses")
    .update({
      date: expense.date,
      description: expense.description,
      amount: expense.amount,
      payment_method: expense.paymentMethod,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function deleteExpense(userId, id) {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}
