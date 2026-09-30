import { Pencil, Trash2 } from "lucide-react";
function ExpenseTable({ expenses, onEdit, onDelete }) {
  return (
    <section className="mb-6 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Daftar Pengeluaran
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Riwayat pengeluaran pada bulan aktif
          </p>
        </div>

        <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
          {expenses.length} transaksi
        </span>
      </div>

      {expenses.length === 0 ? (
        <div className="flex min-h-40 items-center justify-center rounded-2xl bg-slate-50/70">
          <p className="text-sm text-slate-400">Belum ada pengeluaran.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200/70">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Tanggal
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Kategori
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Nominal
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Keterangan
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Metode
                </th>

                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50/70"
                >
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {expense.date}
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-800">
                      {expense.category}
                    </p>
                  </td>

                  <td className="px-4 py-4 font-semibold text-slate-800">
                    Rp{expense.amount.toLocaleString("id-ID")}
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-800">
                      {expense.description}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                      {expense.paymentMethod}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(expense)}
                        className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(expense.id)}
                        className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                      >
                        <Trash2 size={14} />
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default ExpenseTable;
