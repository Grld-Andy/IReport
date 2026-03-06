import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../custom/Sidebar";
import Navbar from "../custom/Navbar";
import type { User } from "@/types/User";
import axios from "axios";
import { apiUrl } from "@/constants";

const Layout: React.FC = () => {
  const storedUser = localStorage.getItem("__safezone_user");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!storedUser);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const setUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}auth/me`, {
          withCredentials: true,
        });

        if (!response.data) {
          localStorage.removeItem("__safezone_user");
          setIsLoggedIn(false);
        } else {
          const user: User = response.data;
          localStorage.setItem("__safezone_user", JSON.stringify(user));
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error(e);
        localStorage.removeItem("__safezone_user");
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    setUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

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
};

export default Layout;