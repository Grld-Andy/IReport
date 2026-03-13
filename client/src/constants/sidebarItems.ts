import type { NavItem } from "@/types/NavItem";
import { HiOutlineUsers, HiUsers } from "react-icons/hi2";
import { IoMapOutline, IoMap } from "react-icons/io5";
import { MdOutlineDashboard, MdDashboard, MdOutlineViewKanban, MdViewKanban } from "react-icons/md";
import { RiErrorWarningLine, RiErrorWarningFill } from "react-icons/ri";

export const sidebarItems: Array<NavItem> = [
    {
      icon: MdOutlineDashboard,
      activeIcon: MdDashboard,
      name: "Dashboard",
      path: "/",
    },
    {
      icon: RiErrorWarningLine,
      activeIcon: RiErrorWarningFill,
      name: "Incidents",
      path: "/incidents",
    },
    { icon: IoMapOutline, activeIcon: IoMap, name: "Live Map", path: "/map" },
  ];


export const supervisorSidebarItems = [
    {
      icon: MdOutlineViewKanban,
      activeIcon: MdViewKanban,
      name: "Kanban Board",
      path: "/kanban",
    },
]

export const adminSidebarItems: Array<NavItem> = [
  
    // {
    //   icon: IoBarChartOutline,
    //   activeIcon: IoBarChartSharp,
    //   name: "Reports",
    //   path: "/reports",
    // },
    {
      icon: HiOutlineUsers,
      activeIcon: HiUsers,
      name: "User Management",
      path: "/users",
    },
]