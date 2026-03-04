import DashboardNavbar from "@/components/custom/Dashboard/DashboardNavbar";
import StatsCard from "@/components/custom/Dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <DashboardNavbar />

      <div className="flex justify-between gap-5">
        <div>
          <h1>Welcome Back</h1>
          <p>Plan, prioritize, and accomplish task with ease</p>
        </div>

        <div>
          <Button className="bg-green-500 text-white rounded-full">
            + Add Project
          </Button>
        </div>
      </div>

      {/* stats cards */}
        <div className="flex gap-3 overflow-x-scroll hide-scrollbar">
          {
            Array.from({ length: 4 }).map((_, index) => (
              <StatsCard key={index}/>
            ))
          }
        </div>
    </div>
  );
};

export default Dashboard;
