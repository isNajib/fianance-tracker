import { WalletCards, PlusCircle } from "lucide-react";

function ActionButtons({ onAddBudget, onAddExpense }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <button
        onClick={onAddBudget}
        className="
          flex items-center justify-center gap-1.5
          rounded-xl
          bg-gradient-to-r
          from-blue-400
          to-cyan-400
          px-2.5 py-2.5
          text-[11px]
          font-semibold
          text-white
          shadow-sm
          transition
          hover:-translate-y-0.5
        "
      >
        <WalletCards size={14} />
        Tambah Budget
      </button>

      <button
        onClick={onAddExpense}
        className="
          flex items-center justify-center gap-1.5
          rounded-xl
          bg-gradient-to-r
          from-fuchsia-400
          to-violet-400
          px-2.5 py-2.5
          text-[11px]
          font-semibold
          text-white
          shadow-sm
          transition
          hover:-translate-y-0.5
        "
      >
        <PlusCircle size={14} />
        Tambah Pengeluaran
      </button>
    </div>
  );
}

export default ActionButtons;
