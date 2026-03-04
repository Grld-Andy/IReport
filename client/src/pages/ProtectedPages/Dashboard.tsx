import DashboardChart from "@/components/custom/Dashboard/Charts";
import DashboardActivityFeed from "@/components/custom/Dashboard/DashboardActivityFeed";
import DashboardNavbar from "@/components/custom/Dashboard/DashboardNavbar";
import StatsCard from "@/components/custom/Dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { activityFeeds } from "@/constants/activityFeeds";
import { dashboardCardDetails } from "@/constants/dashboardCardDetails";
import React from "react";

const Dashboard: React.FC = () => {

  return (
    <div className="flex flex-col gap-5 w-full">
      <DashboardNavbar />

      <div className="flex justify-between gap-5">
        <div>
          <h1 className="text-[40px] font-bold">Welcome Back</h1>
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
        {dashboardCardDetails.map((item, index) => (
          <StatsCard cardDetails={item} key={index} />
        ))}
      </div>

      {/* show stats thing on right show live feed on right */}
      <div className="flex flex-col gap-10 md:gap-3 md:flex-row">
        <div className="flex flex-col gap-2 w-full">
          <h1 className="font-bold text-[18px]">Weekly Analytics</h1>
          <div className="bg-gray-50 p-5 flex flex-col gap-5 rounded-2xl border-[1px] border-black/10 shadow-sm">
            <DashboardChart/>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-[18px]">Activity Feed</h1>
          <div className="bg-gray-50 p-5 flex flex-col gap-5 rounded-2xl border-[1px] border-black/10 shadow-sm">
            {
              activityFeeds.map((item, index) => (
                <DashboardActivityFeed key={index} activity={item}/>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
