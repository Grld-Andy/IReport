import DashboardNavbar from "@/components/custom/Dashboard/DashboardNavbar";
import StatsCard from "@/components/custom/Dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import type { DashboardTitleCards } from "@/types/DashboardTitleCards";
import React from "react";

const Dashboard: React.FC = () => {
  const dashboardCards : Array<DashboardTitleCards> = [
    {title: "Days Since Last Incident", count: 1, percentage: 10, color: "blue", isIncrese: true},
    {title: "Open Incidents", count: 25, percentage: 20, color: "green", isIncrese: true},
    {title: "Critical Incidents", count: 5, percentage: 2, color: "red", isIncrese: false},
    {title: "Closed Incidents", count: 25, percentage: 20, color: "purple", isIncrese: false},
    {title: "Resolved Today", count: 25, percentage: 20, color: "orange", isIncrese: true},
  ]

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
        <div className="flex gap-3 overflow-x-scroll hide-scrollbar py-3 px-1">
          {
            dashboardCards.map((_, index) => (
              <StatsCard cardDetails={dashboardCards[index]} key={index}/>
            ))
          }
        </div>
    </div>
  );
};

export default Dashboard;
