import React from "react";
import { HiOutlineUserAdd } from "react-icons/hi";
import { LuShield, LuUsers, LuUserCheck, LuUserX } from "react-icons/lu";
import PageHeader from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import OldUsersTable from "@/components/custom/UsersPage/OldUsersTable";
import StatCard from "@/components/custom/UsersPage/StatCard";
import { useAppSelector } from "@/redux/app/hooks";

const UsersPage: React.FC = () => {
  const {users, totalUsers} = useAppSelector((state) => state.users)
  const activeUsers = users.filter(u => u.status == 'Active').length
  const inactiveUsers = users.filter(u => u.status == 'Inactive').length
  const suspendedUsers = users.filter(u => u.status == 'Suspended').length

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
          value={users.length}
          sub="Across all teams"
          color="#2563eb"
        />
        <StatCard
          icon={<LuUserCheck />}
          label="Active"
          value={activeUsers}
          sub={`${Math.round((activeUsers / totalUsers) * 100)}% of workforce`}
          color="#059669"
        />
        <StatCard
          icon={<LuUserX />}
          label="Suspended"
          value={suspendedUsers}
          sub="Access suspended"
          color="#94a3b8"
        />
        <StatCard
          icon={<LuShield />}
          label="Pending Invite"
          value={inactiveUsers}
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
