function CategoryExpenseChart({ data, totalExpense }) {
  if (!data.length) {
    return null;
  }

  return (
    <div className="mb-4 rounded-3xl border border-white/70 bg-white/70 p-4 shadow-lg backdrop-blur-xl">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-700">
          Pengeluaran per Kategori
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          Distribusi pengeluaran bulan ini
        </p>
      </div>

      <div className="space-y-4">
        {data.map((item) => {
          const percentage =
            totalExpense > 0 ? (item.amount / totalExpense) * 100 : 0;

          return (
            <div key={item.category}>
              <div className="mb-1.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {item.category}
                  </p>

                  <p className="text-xs text-slate-400">
                    Rp{item.amount.toLocaleString("id-ID")}
                  </p>
                </div>

                <span className="text-xs font-semibold text-slate-500">
                  {percentage.toFixed(1)}%
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryExpenseChart;
