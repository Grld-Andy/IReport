import React from "react";
import { HiOutlineUserAdd } from "react-icons/hi";
import { LuShield, LuUsers, LuUserCheck, LuUserX } from "react-icons/lu";
import PageHeader from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import OldUsersTable from "@/components/custom/UsersPage/OldUsersTable";

// ─── Stat Card ────────────────────────────────────────────────────────────────
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

const UsersPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-5">
      {/* ── Page Header ── */}

      <div className="flex justify-between items-center">
        <PageHeader
          title="User Management"
          subtitle="Manage access, roles, and team assignments across your incident
            response org"
        />
        <Button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{
            background: "#2563eb",
            boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
          }}
        >
          <HiOutlineUserAdd size={16} />
          Invite User
        </Button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<LuUsers />}
          label="Total Users"
          value={10}
          sub="Across all teams"
          color="#2563eb"
        />
        <StatCard
          icon={<LuUserCheck />}
          label="Active"
          value={7}
          sub={`${Math.round((7 / 10) * 100)}% of workforce`}
          color="#059669"
        />
        <StatCard
          icon={<LuUserX />}
          label="Inactive"
          value={2}
          sub="Access suspended"
          color="#94a3b8"
        />
        <StatCard
          icon={<LuShield />}
          label="Pending Invite"
          value={1}
          sub="Awaiting first login"
          color="#d97706"
        />
      </div>

      {/* ── Table Card ── */}
      <OldUsersTable/>
    </div>
  );
};

export default UsersPage;
