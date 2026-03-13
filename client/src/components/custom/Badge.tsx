import React from "react";

interface Props {
  value: string;
  config: Record<string, { label: string; className: string; dot?: string }>;
}

const Badge: React.FC<Props> = ({ value, config }) => {
  const key = value?.toLowerCase().replace(" ", "_");
  const cfg = config[key] ?? {
    label: value,
    className: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide whitespace-nowrap ${cfg.className}`}
    >
      {"dot" in cfg && cfg.dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      )}
      {cfg.label}
    </span>
  );
};

export default Badge;
