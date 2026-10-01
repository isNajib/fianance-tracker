import { useState } from "react";

function BudgetModal({ onClose, onSave, budget, selectedMonth, isSaving }) {
  const [month, setMonth] = useState(budget?.month || selectedMonth);

  const [amount, setAmount] = useState(budget?.amount || "");

  const [periodType, setPeriodType] = useState(
    budget?.period_type ?? "monthly",
  );

  const [startDate, setStartDate] = useState(budget?.start_date ?? "");

  const [endDate, setEndDate] = useState(budget?.end_date ?? "");

  const [name, setName] = useState(budget?.name ?? "");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (periodType === "custom" && endDate < startDate) {
      setErrorMessage(
        "Tanggal akhir harus sama dengan atau setelah tanggal mulai.",
      );
      return;
    }

    setErrorMessage("");

    const result = await onSave({
      id: budget?.id,
      periodType,
      month: periodType === "monthly" ? month : null,
      name: periodType === "monthly" ? month : name,
      startDate: periodType === "custom" ? startDate : null,
      endDate: periodType === "custom" ? endDate : null,
      amount: Number(amount),
    });

    if (result?.success) {
      onClose();
    } else {
      setErrorMessage(result?.error || "Budget gagal disimpan.");
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
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Tipe Budget
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPeriodType("monthly")}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
                    periodType === "monthly"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  Bulanan
                </button>

                <button
                  type="button"
                  onClick={() => setPeriodType("custom")}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
                    periodType === "custom"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  Periode
                </button>
              </div>
            </div>

            {periodType === "monthly" && (
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
            )}

            {periodType === "custom" && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-600">
                    Nama Periode
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budget Gajian September"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-600">
                      Tanggal Mulai
                    </label>

                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-600">
                      Tanggal Akhir
                    </label>

                    <input
                      type="date"
                      value={endDate}
                      min={startDate || undefined}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </>
            )}

            {/* <label className="mb-2 block text-sm font-semibold text-slate-600">
              Bulan
            </label>

            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            /> */}
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

          {errorMessage && (
            <p role="alert" className="text-sm text-red-600">
              Gagal menyimpan budget: {errorMessage}
            </p>
          )}

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
