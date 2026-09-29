import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function ExpenseChart({ dailyTotals }) {
  const chartData = Object.entries(dailyTotals)
    .map(([date, total]) => ({
      date,
      total,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section className="mb-4 rounded-3xl bg-white/70 p-4 shadow-lg backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Grafik Pengeluaran Harian
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Total pengeluaran berdasarkan tanggal
          </p>
        </div>

        <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
          Bulan Aktif
        </span>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-2xl bg-slate-50/70">
          <p className="text-sm text-slate-400">Belum ada data pengeluaran.</p>
        </div>
      ) : (
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickFormatter={(date) => {
                  const [, month, day] = date.split("-");
                  return `${day}/${month}`;
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${value / 1000000}jt`;
                  }

                  if (value >= 1000) {
                    return `${value / 1000}k`;
                  }

                  return value;
                }}
              />

              <Tooltip
                cursor={{
                  fill: "rgba(99, 102, 241, 0.05)",
                }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                }}
                formatter={(value) => [
                  `Rp${Number(value).toLocaleString("id-ID")}`,
                  "Pengeluaran",
                ]}
              />

              <Bar
                dataKey="total"
                fill="#8b5cf6"
                radius={[10, 10, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default ExpenseChart;
