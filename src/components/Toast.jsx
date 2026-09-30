function Toast({ message, type = "success" }) {
  if (!message) return null;

  const style = type === "success" ? "bg-emerald-600" : "bg-red-600";

  return (
    <div
      className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${style}`}
    >
      {message}
    </div>
  );
}

export default Toast;
