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
import NotFound from "@/pages/NotFound";
import { getActivities } from "@/services/getActivities";
import { saveActivitiesState } from "@/redux/features/activities/activitiesSlice";
import { useActivityHub } from "@/hooks/useActivitiesHook";

const Layout: React.FC = () => {
  const dispatch = useAppDispatch()
  const user : User|null = useAppSelector((state) => state.auth.user)
  useIncidentHub()
  useActivityHub()

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

          const incidentsResult = await getAllIncidents(user?.team)
          dispatch(saveIncidentsState(incidentsResult))

          const usersResult = await getAllUsers()
          dispatch(saveUsers(usersResult))
          
          const activitiesResult = await getActivities()
          dispatch(saveActivitiesState(activitiesResult))
        }
      } catch (e) {
        console.error(e);
          dispatch(logout());
      }
    };

    setUser();
  }, [dispatch, user?.team]);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if(user.role == 'responder' && (location.pathname.includes("/kanban"))){
    return <NotFound/>
  }
  if(user.role != 'admin' && (location.pathname.includes("/users") || location.pathname.includes("/reports"))){
    return <NotFound/>
  }

  return (
    <div className="h-screen flex flex-row">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=DM+Mono:wght@400;500&display=swap');
      `}</style>
      
      <div className="w-[90px] md:w-[230px] h-full">
        <Sidebar />
      </div>

      <div style={{fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif"}} className="p-3 w-[calc(100%-90px)] md:w-[calc(100%-230px)] h-full overflow-y-scroll hide-scrollbar flex flex-col gap-5">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;