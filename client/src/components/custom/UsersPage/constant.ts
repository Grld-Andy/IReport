export type Role = "Admin" | "Manager" | "Responder" | "Viewer";
export type Status = "Active" | "Inactive" | "Pending";
export const roleConfig: Record<string, { className: string }> = {
  "admin": { className: "bg-violet-50 text-violet-700 ring-1 ring-violet-200" },
  "supervisor": { className: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
  "responder": { className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  "user": { className: "bg-gray-100 text-gray-600 ring-1 ring-gray-200" },
};

export const statusConfig: Record<string, { dot: string; className: string }> = {
  "Active": {
    dot: "bg-emerald-400",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  "Inactive": {
    dot: "bg-gray-300",
    className: "bg-gray-100 text-gray-500 ring-1 ring-gray-200",
  },
  "Pending": {
    dot: "bg-amber-400",
    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
};

export function avatarHue(name: string) {
  return `hsl(${(name.charCodeAt(0) * 17) % 360}, 52%, 50%)`;
}

export function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}