import { useState } from "react";

function BudgetModal({ onClose, onSave, budget, selectedMonth, isSaving }) {
  const [month, setMonth] = useState(budget?.month || selectedMonth);

  const [amount, setAmount] = useState(budget?.amount || "");

  async function handleSubmit(e) {
    e.preventDefault();

    const success = await onSave({
      month,
      amount: Number(amount),
    });

    if (success) {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {budget ? "Edit Budget" : "Tambah Budget"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Atur budget untuk bulan yang dipilih.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Bulan
            </label>

            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Nominal Budget
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Contoh: 3000000"
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BudgetModal;
