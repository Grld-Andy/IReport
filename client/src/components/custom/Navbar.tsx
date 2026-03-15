import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { MdOutlineEmail } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/types/User";
import { useAppSelector } from "@/redux/app/hooks";
import { SiGoogleauthenticator } from "react-icons/si";
import ResetPasswordModal from "./ResetPasswordModal";
import { apiUrl } from "@/constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar: React.FC = () => {
  const user: User | null = useAppSelector((state) => state.auth.user);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    await axios.post(`${apiUrl}auth/logout`, {}, { withCredentials: true });
    localStorage.removeItem("__safezone_user");
    navigate("/auth/login");
  };

  return (
    <>
      <nav className="px-5 py-3 bg-gray-100 rounded-lg w-full flex justify-between items-center gap-5">
        <div className="flex items-center gap-2 py-5">
          <SiGoogleauthenticator size={25} />
          <span className="text-[20px] font-bold font-serif">SafeZone</span>
        </div>

        <div className="flex gap-2 items-center">
          <div className="grid place-content-center h-[35px] w-[35px] rounded-full bg-white">
            <MdOutlineEmail size={17} />
          </div>

          <div className="grid relative place-content-center h-[35px] w-[35px] rounded-full bg-white">
            <GoBell size={17} />
            <div className="absolute top-0 right-0 bg-red-600 w-3 h-3 rounded-full"></div>
          </div>

          <div className="flex gap-2 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="grid place-content-center cursor-pointer h-[35px] w-[35px] rounded-full bg-green-500">
                  <FaUser size={17} color="white" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>

                  <h1 className="px-2 py-1 text-sm select-none">
                    {user?.role[0].toUpperCase()}
                    {user?.role.slice(1)}
                  </h1>

                  {user?.team != "Admin" && (
                    <h1 className="px-2 py-1 text-sm select-none">
                      {user?.team}
                    </h1>
                  )}

                  <DropdownMenuItem
                    onClick={() => setIsResetModalOpen(true)}
                  >
                    Reset Password
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                </DropdownMenuGroup>

                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex flex-col py-1">
              <h3 className="text-black text-[1em]">{user?.name}</h3>
              <p className="text-gray-800 text-[0.8em]">{user?.email}</p>
            </div>
          </div>
        </div>
      </nav>

      <ResetPasswordModal
        open={isResetModalOpen}
        onOpenChange={setIsResetModalOpen}
      />
    </>
  );
};

export default Navbar;