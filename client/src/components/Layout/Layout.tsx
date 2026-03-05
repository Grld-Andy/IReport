import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../custom/Sidebar";
import Navbar from "../custom/Navbar";
import type { User } from "@/types/User";

const Layout: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const setUser = async () => {
      const userString = localStorage.getItem("__safezoneCurrentUser");
      if (userString == null) {
        return;
      }
      const user: User = JSON.parse(userString);
      setCurrentUser(user);
    };

    setUser();
  }, []);

  if (currentUser != null) {
    return (
      <div className="h-screen flex flex-row">
        <div className="w-[90px] md:w-[230px] h-full">
          <Sidebar />
        </div>
        <div className="p-3 w-[calc(100%-90px)] md:w-[calc(100%-230px)] h-full overflow-y-scroll hide-scrollbar flex flex-col gap-5">
          <Navbar />
          <Outlet />
        </div>
      </div>
    );
  } else {
    Navigate({to:"/auth/login"});
  }
};

export default Layout;
