import { TableCell, TableRow } from "@/components/ui/table";
import type { User } from "@/types/User";
import React from "react";
import { avatarHue, roleConfig, statusConfig } from "../constant";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BsThreeDots } from "react-icons/bs";

interface Props {
  user: User;
  updateUserStatus: (id: string, status: string) => Promise<void>;
}

const UserRow: React.FC<Props> = ({ user, updateUserStatus }) => {
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
            <p className="font-medium text-gray-900">{user.name}</p>
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
      <TableCell className="text-sm text-gray-700">{user.team}</TableCell>

      {/* Status */}
      <TableCell>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${sc.className}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
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
            {/* <DropdownMenuGroup>
                            <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                          </DropdownMenuGroup> */}
            <DropdownMenuGroup>
              {["Active", "Suspended"]
                .filter((s) => s != user.status)
                .map((s, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => {
                      updateUserStatus(user.id, s);
                    }}
                  >
                    {s == "Suspended" ? "Suspend" : s}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
