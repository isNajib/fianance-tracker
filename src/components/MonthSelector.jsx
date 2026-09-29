function MonthSelector({ selectedMonth, onChange }) {
  return (
    <div className="w-full md:w-auto">
      <input
        type="month"
        value={selectedMonth}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-2xl
          border border-slate-200/70
          bg-white/70
          px-4 py-3
          text-sm
          text-slate-700
          shadow-sm
          backdrop-blur-md
          outline-none
          transition
          focus:border-indigo-300
          focus:ring-4
          focus:ring-indigo-100
          md:w-auto
        "
      />
    </div>
  );
}

export default MonthSelector;
