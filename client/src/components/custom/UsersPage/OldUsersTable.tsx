import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
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
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";

import type { User } from "@/types/User";
import { avatarHue, roleConfig, statusConfig } from "./constant";
import { getUsers } from "@/services/getUsers";
import { useDebounce } from "@/hooks/useDebounce";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/redux/app/hooks";

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const stateUsers = useAppSelector((state) => state.users.users);
  const debouncedSearch = useDebounce(search, 500);

  const { page } = useParams();
  const navigate = useNavigate();
  const currentPage = Math.max(1, Number(page) || 1);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getUsers(
        currentPage,
        debouncedSearch,
        roleFilter,
        statusFilter,
      );

      setUsers(result.users ?? []);
      setTotalUsers(result.totalUsers ?? 0);
      setTotalPages(result.totalPages ?? 1);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, roleFilter, statusFilter]);

  useEffect(() => {
    if(!stateUsers && stateUsers != 0) return;
    fetchUsers();
  }, [fetchUsers, stateUsers]);

  const changePage = (pageTo: number) => {
    if (pageTo < 1 || pageTo > totalPages) return;
    navigate(`/users/${pageTo}`);
  };

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b flex md:items-center justify-between flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">{totalUsers} total user{totalUsers > 1 && "s"}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <CiSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-8 h-9 w-52 bg-white"
            />
          </div>

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-9 w-[140px] bg-gray-50">
              <SelectValue placeholder="Role" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="responder">Responder</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[140px] bg-gray-50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {["User", "Role", "Team", "Status", "Joined", ""].map((col) => (
                <TableHead
                  key={col}
                  className="text-xs text-gray-500 font-medium"
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Loading */}
            {loading &&
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-24 rounded-md" />
                        <Skeleton className="h-2 w-32 rounded-md" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3 w-20 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3 w-20 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </TableCell>
                </TableRow>
              ))}

            {/* Empty */}
            {!loading && users.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-gray-500"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}

            {/* Data */}
            {!loading &&
              users.map((user) => {
                const rc = roleConfig[user.role];
                const sc = statusConfig[user.status];

                return (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    {/* User */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                          style={{ background: avatarHue(user.name) }}
                        >
                          {user.name.charAt(0)}
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${rc.className}`}
                      >
                        {user.role}
                      </span>
                    </TableCell>

                    {/* Team */}
                    <TableCell className="text-sm text-gray-700">
                      {user.team}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${sc.className}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                        />
                        {user.status}
                      </span>
                    </TableCell>

                    {/* Joined */}
                    <TableCell className="text-sm text-gray-500 whitespace-nowrap">
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
                          <Button
                            variant="ghost"
                            className="w-8 h-8 flex items-center justify-center"
                          >
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
      <div className="px-6 py-3 border-t flex items-center justify-between text-sm text-gray-500">
        <p>
          Page {currentPage} of {totalPages}
        </p>

        <div className="flex gap-2">
          <Button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Prev
          </Button>

          <Button variant="outline">{currentPage}</Button>

          <Button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
