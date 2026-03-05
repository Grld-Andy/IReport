import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";
import { HiOutlineUserAdd } from "react-icons/hi";
import { LuShield, LuUsers, LuUserCheck, LuUserX } from "react-icons/lu";
import { BsThreeDots } from "react-icons/bs";

// ─── Mock Data ────────────────────────────────────────────────────────────────
type Role = "Admin" | "Manager" | "Responder" | "Viewer";
type Status = "Active" | "Inactive" | "Pending";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  team: string;
  incidentsAssigned: number;
  incidentsResolved: number;
  lastActive: Date;
  joinedAt: Date;
}

const users: User[] = [
  { id: "USR-001", name: "Adriana Reyes",    email: "a.reyes@ops.io",     role: "Admin",     status: "Active",   team: "Alpha",   incidentsAssigned: 42, incidentsResolved: 39, lastActive: new Date("2026-03-05T09:12:00"), joinedAt: new Date("2024-01-10") },
  { id: "USR-002", name: "Marcus Webb",      email: "m.webb@ops.io",      role: "Manager",   status: "Active",   team: "Beta",    incidentsAssigned: 31, incidentsResolved: 28, lastActive: new Date("2026-03-05T08:45:00"), joinedAt: new Date("2024-02-14") },
  { id: "USR-003", name: "Priya Nair",       email: "p.nair@ops.io",      role: "Responder", status: "Active",   team: "Alpha",   incidentsAssigned: 18, incidentsResolved: 16, lastActive: new Date("2026-03-04T17:30:00"), joinedAt: new Date("2024-03-22") },
  { id: "USR-004", name: "Jordan Cole",      email: "j.cole@ops.io",      role: "Responder", status: "Inactive", team: "Gamma",   incidentsAssigned: 9,  incidentsResolved: 9,  lastActive: new Date("2026-02-18T11:00:00"), joinedAt: new Date("2024-04-05") },
  { id: "USR-005", name: "Simone Lefebvre",  email: "s.lefebvre@ops.io",  role: "Manager",   status: "Active",   team: "Gamma",   incidentsAssigned: 27, incidentsResolved: 24, lastActive: new Date("2026-03-05T07:55:00"), joinedAt: new Date("2024-01-28") },
  { id: "USR-006", name: "Tariq Hassan",     email: "t.hassan@ops.io",    role: "Viewer",    status: "Pending",  team: "Delta",   incidentsAssigned: 0,  incidentsResolved: 0,  lastActive: new Date("2026-03-01T10:00:00"), joinedAt: new Date("2026-03-01") },
  { id: "USR-007", name: "Elena Morozova",   email: "e.morozova@ops.io",  role: "Responder", status: "Active",   team: "Beta",    incidentsAssigned: 22, incidentsResolved: 19, lastActive: new Date("2026-03-05T06:20:00"), joinedAt: new Date("2024-06-11") },
  { id: "USR-008", name: "David Osei",       email: "d.osei@ops.io",      role: "Responder", status: "Active",   team: "Epsilon", incidentsAssigned: 15, incidentsResolved: 13, lastActive: new Date("2026-03-04T14:10:00"), joinedAt: new Date("2024-07-30") },
  { id: "USR-009", name: "Fiona Gallagher",  email: "f.gallagher@ops.io", role: "Admin",     status: "Active",   team: "Epsilon", incidentsAssigned: 38, incidentsResolved: 36, lastActive: new Date("2026-03-05T09:01:00"), joinedAt: new Date("2023-11-15") },
  { id: "USR-010", name: "Kenji Watanabe",   email: "k.watanabe@ops.io",  role: "Viewer",    status: "Inactive", team: "Delta",   incidentsAssigned: 2,  incidentsResolved: 2,  lastActive: new Date("2026-01-20T09:00:00"), joinedAt: new Date("2024-09-03") },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const roleConfig: Record<Role, { className: string }> = {
  Admin:     { className: "bg-violet-50 text-violet-700 ring-1 ring-violet-200" },
  Manager:   { className: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
  Responder: { className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  Viewer:    { className: "bg-gray-100 text-gray-600 ring-1 ring-gray-200" },
};

const statusConfig: Record<Status, { dot: string; className: string }> = {
  Active:   { dot: "bg-emerald-400", className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  Inactive: { dot: "bg-gray-300",    className: "bg-gray-100 text-gray-500 ring-1 ring-gray-200" },
  Pending:  { dot: "bg-amber-400",   className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
};

const teamColors: Record<string, string> = {
  Alpha:   "bg-blue-100 text-blue-700",
  Beta:    "bg-rose-100 text-rose-700",
  Gamma:   "bg-violet-100 text-violet-700",
  Delta:   "bg-orange-100 text-orange-700",
  Epsilon: "bg-teal-100 text-teal-700",
};

function avatarHue(name: string) {
  return `hsl(${name.charCodeAt(0) * 17 % 360}, 52%, 50%)`;
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string | number; sub: string; color: string;
}) {
  return (
    <div
      className="bg-white rounded-xl border border-gray-100 p-5 relative overflow-hidden"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)" }}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: color }} />
      <div className="absolute bottom-[-20px] right-[-20px] w-20 h-20 rounded-full opacity-50"
        style={{ background: color + "18" }} />
      <div className="text-2xl mb-3" style={{ color }}>{icon}</div>
      <div className="text-3xl font-bold text-gray-900 leading-none" style={{ fontFamily: "'DM Mono', monospace" }}>
        {value}
      </div>
      <div className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mt-1">{label}</div>
      <div className="text-[11px] font-semibold mt-2" style={{ color }}>{sub}</div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
const UsersPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "All">("All");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.team.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const activeCount   = users.filter(u => u.status === "Active").length;
  const inactiveCount = users.filter(u => u.status === "Inactive").length;
  const pendingCount  = users.filter(u => u.status === "Pending").length;

  return (
    <div
      className="min-h-screen p-8"
      style={{
        background: "#f8fafc",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=DM+Mono:wght@400;500&display=swap');
      `}</style>

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">
            User Management
          </h1>
          <p className="text-sm text-gray-400 mt-1.5">
            Manage access, roles, and team assignments across your incident response org.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{ background: "#2563eb", boxShadow: "0 2px 8px rgba(37,99,235,0.35)" }}
        >
          <HiOutlineUserAdd size={16} />
          Invite User
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={<LuUsers />}     label="Total Users"    value={users.length}  sub="Across all teams"         color="#2563eb" />
        <StatCard icon={<LuUserCheck />} label="Active"         value={activeCount}   sub={`${Math.round(activeCount/users.length*100)}% of workforce`} color="#059669" />
        <StatCard icon={<LuUserX />}     label="Inactive"       value={inactiveCount} sub="Access suspended"         color="#94a3b8" />
        <StatCard icon={<LuShield />}    label="Pending Invite" value={pendingCount}  sub="Awaiting first login"     color="#d97706" />
      </div>

      {/* ── Table Card ── */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 4px 6px -1px rgba(0,0,0,0.04), 0 12px 32px -4px rgba(0,0,0,0.08)" }}
      >
        {/* Table Header Controls */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-base font-bold text-gray-900">All Users</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              <span className="font-semibold text-gray-700">{filtered.length}</span> of {users.length} users
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <CiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search users…"
                className="pl-8 h-9 text-sm bg-gray-50 border-gray-200 rounded-lg w-52 focus-visible:ring-1 focus-visible:ring-gray-300 placeholder:text-gray-400"
              />
            </div>

            {/* Role filter */}
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as Role | "All")}
              className="h-9 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-300"
            >
              <option value="All">All Roles</option>
              {(["Admin","Manager","Responder","Viewer"] as Role[]).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as Status | "All")}
              className="h-9 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-300"
            >
              <option value="All">All Statuses</option>
              {(["Active","Inactive","Pending"] as Status[]).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-100">
                {["User", "Role", "Status", "Team", "Incidents", "Resolution Rate", "Last Active", "Joined", ""].map((col) => (
                  <TableHead key={col} className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest py-3 whitespace-nowrap">
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => {
                const resRate = user.incidentsAssigned > 0
                  ? Math.round((user.incidentsResolved / user.incidentsAssigned) * 100)
                  : 0;
                const sc = statusConfig[user.status];
                const rc = roleConfig[user.role];

                return (
                  <TableRow
                    key={user.id}
                    className="group border-b border-gray-50 hover:bg-blue-50/20 transition-colors duration-150"
                  >
                    {/* User */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ring-2 ring-white"
                          style={{
                            background: avatarHue(user.name),
                            boxShadow: "0 1px 4px rgba(0,0,0,0.12)"
                          }}
                        >
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm leading-tight">{user.name}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${rc.className}`}>
                        {user.role}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${sc.className}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {user.status}
                      </span>
                    </TableCell>

                    {/* Team */}
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${teamColors[user.team] ?? "bg-gray-100 text-gray-600"}`}>
                        {user.team}
                      </span>
                    </TableCell>

                    {/* Incidents */}
                    <TableCell>
                      <div className="text-sm font-semibold text-gray-900">{user.incidentsAssigned}</div>
                      <div className="text-[11px] text-gray-400">{user.incidentsResolved} resolved</div>
                    </TableCell>

                    {/* Resolution Rate */}
                    <TableCell className="min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${resRate}%`,
                              background: resRate >= 80 ? "#059669" : resRate >= 50 ? "#d97706" : "#e11d48",
                            }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-gray-600 tabular-nums w-8 text-right">
                          {resRate}%
                        </span>
                      </div>
                    </TableCell>

                    {/* Last Active */}
                    <TableCell className="text-sm text-gray-500 tabular-nums whitespace-nowrap">
                      {timeAgo(user.lastActive)}
                    </TableCell>

                    {/* Joined */}
                    <TableCell className="text-sm text-gray-400 tabular-nums whitespace-nowrap">
                      {user.joinedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <BsThreeDots size={14} />
                        </button>
                        {menuOpen === user.id && (
                          <div
                            className="absolute right-0 top-8 z-10 bg-white rounded-xl border border-gray-100 py-1 w-40"
                            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}
                          >
                            {[
                              { label: "View Profile",   color: "text-gray-700" },
                              { label: "Edit Role",      color: "text-gray-700" },
                              { label: "Reset Password", color: "text-gray-700" },
                              { label: "Deactivate",     color: "text-rose-600" },
                            ].map(({ label, color }) => (
                              <button
                                key={label}
                                onClick={() => setMenuOpen(null)}
                                className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors ${color}`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-16 text-gray-400 text-sm">
                    No users match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of{" "}
            <span className="font-semibold text-gray-600">{users.length}</span> users
          </p>
          <div className="flex gap-1">
            <button className="text-xs px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">← Prev</button>
            <button className="text-xs px-3 py-1.5 rounded-lg bg-gray-900 text-white font-semibold">1</button>
            <button className="text-xs px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;