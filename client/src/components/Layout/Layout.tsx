import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../custom/Sidebar";
import Navbar from "../custom/Navbar";
import type { User } from "@/types/User";
import axios from "axios";
import { apiUrl } from "@/constants";

const Layout: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const setUser = async () => {
      const response = await axios.get(`${apiUrl}auth/me`, {
        withCredentials: true,
      });
      console.log(response.data);
      if (response == null) {
        return;
      }
      const user : User = response.data;
      localStorage.setItem("__safezone_user", JSON.stringify(user))
      setCurrentUser(user);
    };

    setUser();
  }, []);

  if(currentUser == undefined){
    return;
  }

  if (currentUser) {
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
    return <Navigate to="/auth/login" replace />;
  }
};

export default Layout;
