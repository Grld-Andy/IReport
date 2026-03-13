import React, { useEffect, useState } from "react";
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
import { BsThreeDots } from "react-icons/bs";
import type { User } from "@/types/User";
import { avatarHue, roleConfig, statusConfig } from "./constant";
import { getUsers } from "@/services/getUsers";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector } from "@/redux/app/hooks";

const OldUsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const stateUsers = useAppSelector((state) => state.users.users)

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await getUsers(1);
      console.log("fetched users: ", result)
      setUsers(result.users ?? []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [stateUsers]);

  return (
    <div className="flex flex-col gap-5">
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.06), 0 4px 6px -1px rgba(0,0,0,0.04), 0 12px 32px -4px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-base font-bold text-gray-900">All Users</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              <span className="font-semibold text-gray-700">
                {users.length}
              </span>{" "}
              users
            </p>
          </div>

          {/* Controls (UI only) */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <CiSearch
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="Search users…"
                className="pl-8 h-9 text-sm bg-gray-50 border-gray-200 rounded-lg w-52"
              />
            </div>

            <Select>
              <SelectTrigger className="h-9 px-3 w-min text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Roles</SelectLabel>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="responder">Responder</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="h-9 px-3 w-min text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Statuses</SelectLabel>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 border-b border-gray-100">
                {["User", "Role", "Team", "Status", "Joined", ""].map((col) => (
                  <TableHead
                    key={col}
                    className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest py-3"
                  >
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    Loading users...
                  </TableCell>
                </TableRow>
              )}

              {!loading && users.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-gray-500"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              )}

              {loading || users.map((user, index) => {
                const sc = statusConfig[user.status];
                const rc = roleConfig[user.role];

                return (
                  <TableRow
                    key={index}
                    className="group border-b border-gray-50 hover:bg-blue-50/20"
                  >
                    {/* User */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{
                            background: avatarHue(user.name),
                          }}
                        >
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${rc.className}`}
                      >
                        {user.role}
                      </span>
                    </TableCell>

                    <TableCell className="text-sm text-gray-400 text-nowrap min-w-[100px]">
                      {user.team}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${sc.className}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                        />
                        {user.status}
                      </span>
                    </TableCell>

                    {/* Joined */}
                    <TableCell className="text-sm text-gray-400 text-nowrap">
                      {new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline"
                            className="w-7 h-7 bg-transparent border-transparent shadow-none rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100">
                            <BsThreeDots size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuGroup>
                            <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                            <DropdownMenuItem>Suspend</DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-600">{users.length}</span>{" "}
            users
          </p>

          <div className="flex gap-1">
            <button className="text-xs px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-200">
              ← Prev
            </button>
            <button className="text-xs px-3 py-1.5 rounded-lg bg-gray-900 text-white font-semibold">
              1
            </button>
            <button className="text-xs px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-200">
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OldUsersTable;
