import React from "react";
import { SiGoogleauthenticator } from "react-icons/si";
import { CiLogout } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { adminSidebarItems, sidebarItems } from "@/constants/sidebarItems";
import { apiUrl } from "@/constants";
import axios from "axios";
import { useAppSelector } from "@/redux/app/hooks";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const sidebarNaivgation = user?.role != 'admin' ? sidebarItems : [...sidebarItems, ...adminSidebarItems]

  const logout = async () => {
    await axios.post(`${apiUrl}auth/logout`, {}, { withCredentials: true });
    localStorage.removeItem("__safezone_user");
    navigate("/auth/login");
  };

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-full h-full py-3 px-5">
      {/* upper */}
      <div className="flex flex-col gap-8">
        {/* logo */}
        <div className="flex items-center justify-center gap-2 py-5">
          <SiGoogleauthenticator size={25} />
          {/* <span className="text-[20px] font-bold font-serif hidden md:block">
            SafeZone
          </span> */}
        </div>

        {/* navitems */}
        <div className="flex flex-col gap-3">
          {
          sidebarNaivgation.map((item, index) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`);
            const Icon = isActive ? item.activeIcon : item.icon;

            return (
              <Button
                key={index}
                onClick={() => navigate(item.path)}
                className={`
          flex items-center justify-start gap-3 shadow-none py-5
          ${
            isActive
              ? "bg-green-500 text-white hover:bg-green-500"
              : "bg-transparent text-gray-800 hover:bg-green-400"
          }
        `}
              >
                <Icon className={`scale-125 ${isActive ? "text-white" : ""}`} />
                <p className="hidden md:block">{item.name}</p>
              </Button>
            );
          })}
        </div>
      </div>

      {/* lower: logout button */}
      <Button
        onClick={logout}
        className="flex items-center justify-start hover:bg-green-400 gap-3 bg-transparent shadow-none"
      >
        <CiLogout className="text-gray-800" />
        <p className="text-gray-800 hidden md:block">Logout</p>
      </Button>
    </div>
  );
};

export default Sidebar;
