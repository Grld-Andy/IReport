import type { IncidentUser } from "@/types/Incident";
import type { User } from "@/types/User";
import { Input } from "@base-ui/react";
import React, { useState } from "react";

interface Props {
  users: Array<User>;
  value?: string
  onChange?: (userId: string) => void;
  initialUser?: IncidentUser|null;
}

const UserCombobox: React.FC<Props> = ({ users, initialUser, onChange }) => {
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<IncidentUser | null>(initialUser ?? null);
  const [open, setOpen] = useState(false);
  console.log("initial user in combobox: ", initialUser)

  const filteredUsers =
    query === ""
      ? users
      : users.filter((user) =>
          user.name.toLowerCase().includes(query.toLowerCase())
        );

  const selectUser = (user: User) => {
    setSelectedUser(user);
    setQuery("");
    setOpen(false);

    if (onChange) {
      onChange(user.id);
    }
  };

  return (
    <div className="w-72 relative">
      <Input
        type="text"
        value={selectedUser ? selectedUser.name : query}
        defaultValue={initialUser ? initialUser.name : ""}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedUser(null);
          setOpen(true);

          if (onChange) onChange("");
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        placeholder="Select a user..."
        className="w-full border rounded-md shadow-sm py-1 px-2 text-sm h-[36px]"
      />

      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white p-2 border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredUsers.length === 0 ? (
            <li className="px-2 py-1 text-sm text-gray-500">No users found</li>
          ) : (
            <>
              <li className="font-semibold px-1">User</li>

              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  onMouseDown={() => selectUser(user)}
                  className="py-2 text-sm cursor-pointer px-1 hover:bg-gray-100 rounded-md"
                >
                  {user.name}
                </li>
              ))}
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default UserCombobox;