import React, { useState } from "react";
import { SiGoogleauthenticator } from "react-icons/si";
import { CiLogout } from "react-icons/ci";
import { MdDashboard, MdOutlineDashboard, MdViewKanban } from "react-icons/md";
import { Button } from "../ui/button";
import { IoMap, IoMapOutline } from "react-icons/io5";
import type { NavItem } from "@/types/NavItem";
import { MdOutlineViewKanban } from "react-icons/md";
import { RiErrorWarningLine, RiErrorWarningFill } from "react-icons/ri";
import { IoBarChartOutline, IoBarChartSharp } from "react-icons/io5";
import { HiOutlineUsers, HiUsers  } from "react-icons/hi2";

const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Dashboard");

  const navItems : Array<NavItem> = [
    {icon: MdOutlineDashboard, activeIcon: MdDashboard, name: "Dashboard"},
    {icon: RiErrorWarningLine, activeIcon: RiErrorWarningFill, name: "Incidents"},
    {icon: IoMapOutline, activeIcon: IoMap, name: "Live Map"},
    {icon: MdOutlineViewKanban, activeIcon: MdViewKanban, name: "Kanban Board"},
    {icon: IoBarChartOutline, activeIcon: IoBarChartSharp, name: "Reports"},
    {icon: HiOutlineUsers, activeIcon: HiUsers, name: "User Management"},
  ]

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-full h-full py-3 px-5">
      {/* upper */}
      <div className="flex flex-col gap-8">

        {/* logo */}
        <div className="flex items-center justify-center gap-2 py-5">
          <SiGoogleauthenticator size={25} />
          <span className="text-[20px] font-bold font-serif hidden md:block">SafeZone</span>
        </div>

        {/* navitems */}
        <div className="flex flex-col gap-3">
          {
            navItems.map((item, index) => {
              return(
                <Button onClick={() => setActiveTab(item.name)} key={index} className={
                    `${activeTab != item.name ? "hover:bg-green-400 bg-transparent text-gray-800" : "bg-green-500 hover:bg-green-500 text-white"}
                    flex items-center justify-start gap-3 shadow-none py-5
                    `
                  }>
                  {
                    activeTab != item.name ?
                    <item.icon className="scale-125"/>
                    : <item.activeIcon className="scale-125 text-white"/>
                  }
                  <p className="hidden md:block">{item.name}</p>
                </Button>
              )
            })
          }
        </div>
      </div>

      {/* lower: logout button */}
      <Button className="flex items-center justify-start hover:bg-green-400 gap-3 bg-transparent shadow-none">
        <CiLogout className="text-gray-800"/>
        <p className="text-gray-800 hidden md:block">Logout</p>
      </Button>
    </div>
  );
};

export default Sidebar;
