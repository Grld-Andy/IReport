function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  color: string;
}) {
  return (
    <div
      className="bg-white rounded-xl border border-gray-100 p-5 relative overflow-hidden"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl"
        style={{ background: color }}
      />
      <div
        className="absolute bottom-[-20px] right-[-20px] w-20 h-20 rounded-full opacity-50"
        style={{ background: color + "18" }}
      />
      <div className="text-2xl mb-3" style={{ color }}>
        {icon}
      </div>
      <div
        className="text-3xl font-bold text-gray-900 leading-none"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        {value}
      </div>
      <div className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mt-1">
        {label}
      </div>
      <div className="text-[11px] font-semibold mt-2" style={{ color }}>
        {sub}
      </div>
    </div>
  );
}

export default StatCard;