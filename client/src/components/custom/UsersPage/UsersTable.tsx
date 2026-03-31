import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "@/types/User";
import { getUsers } from "@/services/users/getUsers";
import { useDebounce } from "@/hooks/useDebounce";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/redux/app/hooks";
import { changeUserStatus } from "@/services/users/changeUserStatus";
import { toast } from "sonner";
import UserRow from "./TableUI/UserRow";
import UsersTableFooter from "../PaginationFooter";
import UsersTableHeader from "./TableUI/UsersTableHeader";
import UsersTableColumns from "./TableUI/UsersTableColumns";
import EmptyRow from "../EmptyRow";

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const stateUsers = useAppSelector((state) => state.users.users);
  const stateUsersIsSet = useAppSelector((state) => state.users.isSet);
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
    setLoading(true);
    if(!stateUsersIsSet) {
      setLoading(true);
      return
    };
    fetchUsers();
  }, [fetchUsers, stateUsers, stateUsersIsSet]);

  const changePage = (pageTo: number) => {
    if (pageTo < 1 || pageTo > totalPages) return;
    navigate(`/users/${pageTo}`);
  };

  const updateUserStatus = async (id: string, status: string) => {
    const {success, message} = await changeUserStatus(id, status)
    if(success){
      toast.message(`${message} to ${status}`, {position: 'top-center'})
    }else{
      toast.error(message, {position: 'top-center'})
    }
  }

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <UsersTableHeader
        totalUsers={totalUsers}
        search={search} setSearch={setSearch}
        roleFilter={roleFilter} setRoleFilter={setRoleFilter}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
      />

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
            {loading &&
              Array.from({ length: 5 }).map((_, idx) => (
                <UsersTableColumns key={idx}/>
              ))}

            {(!loading && users.length === 0) && (
              <EmptyRow text={"No users found"}/>
            )}

            {/* Data */}
            {!loading &&
              users.map((user) => (
                <UserRow key={user.id} user={user} updateUserStatus={updateUserStatus}/>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <UsersTableFooter currentPage={currentPage} totalPages={totalPages} changePage={changePage}/>
    </div>
  );
};

export default UsersTable;
