import React, { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../custom/Sidebar";
import Navbar from "../custom/Navbar";
import axios from "axios";
import { apiUrl } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import type { User } from "@/types/User";
import { loginSuccess, logout } from "@/redux/features/auth/authSlice";
import { getAllIncidents } from "@/services/getIncidents";
import { getAllUsers } from "@/services/getUsers";
import { saveIncidentsState } from "@/redux/features/incidents/incidentsSlice";
import { saveUsers } from "@/redux/features/users/usersSlice";
import { useIncidentHub } from "@/hooks/useIncidentHook";

const Layout: React.FC = () => {
  const dispatch = useAppDispatch()
  const user : User|null = useAppSelector((state) => state.auth.user)
  useIncidentHub()

  useEffect(() => {
    const setUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}auth/me`, {
          withCredentials: true,
        });

        if (!response.data) {
          dispatch(logout());
        } else {
          dispatch(loginSuccess(response.data))

          const incidentsResult = await getAllIncidents()
          const usersResult = await getAllUsers()
          dispatch(saveIncidentsState(incidentsResult))
          dispatch(saveUsers(usersResult))
        }
      } catch (e) {
        console.error(e);
          dispatch(logout());
      }
    };

    setUser();
  }, [dispatch]);

  if (!user) {
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