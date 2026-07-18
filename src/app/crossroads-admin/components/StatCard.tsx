const ACCENT_CLASSES = {
  teal: "bg-teal",
  mango: "bg-mango",
  ink: "bg-ink",
};

export default function StatCard({
  label,
  value,
  hint,
  accent = "teal",
}: Readonly<{
  label: string;
  value: string | number;
  hint?: string;
  accent?: keyof typeof ACCENT_CLASSES;
}>) {
  return (
    <div className="hover-elevate relative overflow-hidden rounded-2xl border border-ink/10 bg-white p-6">
      <div className={`absolute inset-x-0 top-0 h-1 ${ACCENT_CLASSES[accent]}`} />
      <div className="font-sans text-xs font-bold uppercase tracking-wide text-ink/50">{label}</div>
      <div className="mt-2 truncate font-serif text-3xl text-ink">{value}</div>
      {hint && <div className="mt-1 truncate font-sans text-xs text-ink/45">{hint}</div>}
    </div>
  );
}
