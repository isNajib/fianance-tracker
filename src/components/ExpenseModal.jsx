import { useEffect, useState } from "react";

function ExpenseModal({ onClose, onSave, expense }) {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  useEffect(() => {
    if (expense) {
      setDate(expense.date);
      setDescription(expense.description);
      setAmount(expense.amount);
      setPaymentMethod(expense.paymentMethod);
    }
  }, [expense]);

  function handleSubmit(e) {
    e.preventDefault();

    onSave({
      id: expense ? expense.id : Date.now(),
      date,
      description,
      amount: Number(amount),
      paymentMethod,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {expense ? "Edit Pengeluaran" : "Tambah Pengeluaran"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Catat detail pengeluaranmu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Tanggal
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Keterangan
            </label>

            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Makan siang"
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Nominal
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Contoh: 25000"
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Metode Pembayaran
            </label>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            >
              <option>Cash</option>
              <option>QRIS</option>
              <option>Transfer</option>
              <option>Debit</option>
              <option>Kartu Kredit</option>
              <option>E-Wallet</option>
              <option>Lainnya</option>
            </select>
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
              className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-200/50 transition hover:-translate-y-0.5"
            >
              {expense ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseModal;
