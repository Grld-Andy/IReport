import React from "react";
import { HiOutlineUserAdd } from "react-icons/hi";
import { LuShield, LuUsers, LuUserCheck, LuUserX } from "react-icons/lu";
import PageHeader from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import OldUsersTable from "@/components/custom/UsersPage/OldUsersTable";
import StatCard from "@/components/custom/UsersPage/StatCard";

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
        <Button className="bg-green-500 hover:bg-green-600 text-white">
          <HiOutlineUserAdd size={16} />
          Add User
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
      <OldUsersTable />
    </div>
  );
};

export default UsersPage;
