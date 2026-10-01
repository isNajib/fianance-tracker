import { Pencil } from "lucide-react";

function SummaryCard({ title, subtitle, amount, onEdit }) {
  return (
    <div className="border-r border-slate-200/60 px-3 py-4 last:border-r-0">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-medium leading-tight text-slate-500">
          {title}
        </p>

        {onEdit && (
          <button
            onClick={onEdit}
            className="
              flex shrink-0 items-center gap-1
              rounded-lg
              px-2 py-1
              text-[10px] font-semibold
              text-indigo-500
              transition
              hover:bg-indigo-50
              hover:text-indigo-700
            "
          >
            <Pencil size={11} />
          </button>
        )}
      </div>

      {subtitle && (
        <p className="mt-0.5 text-[10px] text-slate-400">{subtitle}</p>
      )}

      <h2 className="mt-2 whitespace-nowrap text-sm font-bold text-slate-800">
        {amount}
      </h2>
    </div>
  );
}

export default SummaryCard;
