import { Crown } from "lucide-react";

function HighestExpenseCard({ data }) {
  if (!data) return null;

  const [date, amount] = data;

  const formattedDate = new Date(`${date}T00:00:00`).toLocaleDateString(
    "id-ID",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  return (
    <div className="mb-4 flex items-center gap-3 rounded-3xl bg-white/70 p-4 shadow-lg backdrop-blur-xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-300 via-pink-400 to-fuchsia-400 text-white">
        <Crown size={22} />
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500">
          Pengeluaran Terbesar
        </p>

        <h2 className="text-xl font-bold text-slate-800">
          Rp{amount.toLocaleString("id-ID")}
        </h2>

        <p className="text-xs text-slate-500">{formattedDate}</p>
      </div>
    </div>
  );
}

export default HighestExpenseCard;
