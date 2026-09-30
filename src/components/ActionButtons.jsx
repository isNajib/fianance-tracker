import { WalletCards, PlusCircle } from "lucide-react";

function ActionButtons({ onAddIncome, onAddBudget, onAddExpense }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        onClick={onAddIncome}
        className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-3 py-4 text-sm font-medium text-white shadow-md transition hover:brightness-95"
      >
        Tambah
        <br />
        Income
      </button>

      <button
        onClick={onAddBudget}
        className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-3 py-4 text-sm font-medium text-white shadow-md transition hover:brightness-95"
      >
        Tambah
        <br />
        Budget
      </button>

      <button
        onClick={onAddExpense}
        className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-3 py-4 text-sm font-medium text-white shadow-md transition hover:brightness-95"
      >
        Tambah
        <br />
        Pengeluaran
      </button>
    </div>
  );
}

export default ActionButtons;
