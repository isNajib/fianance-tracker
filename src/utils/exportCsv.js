export function exportExpensesToCsv(
  expenses,
  selectedMonth,
  budgetAmount,
  totalExpense,
  remainingBudget,
) {
  if (!expenses.length) {
    alert("Belum ada transaksi untuk diexport.");
    return;
  }

  const rows = [
    ["Ringkasan"],
    ["Bulan", selectedMonth],
    ["Budget", budgetAmount],
    ["Total Pengeluaran", totalExpense],
    ["Sisa Budget", remainingBudget],
    [],
    ["No", "Tanggal", "Keterangan", "Metode Pembayaran", "Jumlah"],
    ...expenses.map((expense, index) => [
      index + 1,
      expense.date,
      expense.description,
      expense.paymentMethod,
      expense.amount,
    ]),
  ];

  const csvContent = rows
    .map((row) =>
      row
        .map((value) => {
          const text = String(value ?? "").replace(/"/g, '""');
          return `"${text}"`;
        })
        .join(","),
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `finance-${selectedMonth}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
