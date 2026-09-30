import { useEffect, useState } from "react";

function IncomeModal({ onClose, onSave, income, isSaving }) {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (income) {
      setDate(income.date ?? "");
      setDescription(income.description ?? "");
      setAmount(income.amount ?? "");
    }
  }, [income]);

  async function handleSubmit(e) {
    e.preventDefault();

    const success = await onSave({
      date,
      description,
      amount: Number(amount),
    });

    if (success) {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            {income ? "Edit Income" : "Tambah Income"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-400 hover:text-slate-700"
          >
            Tutup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Tanggal
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Keterangan
            </label>

            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Gaji September"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Jumlah
            </label>

            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="5000000"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Menyimpan..." : "Simpan Income"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default IncomeModal;
