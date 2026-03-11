import DashboardChart from "@/components/custom/Dashboard/Charts";
import DashboardActivityFeed from "@/components/custom/Dashboard/DashboardActivityFeed";
import StatsCard from "@/components/custom/Dashboard/StatsCard";
import PageHeader from "@/components/custom/PageHeader";
import { activityFeeds } from "@/constants/activityFeeds";
import { generateDashboardCards } from "@/constants/incidentAnalyticsFunc";
import { useAppSelector } from "@/redux/app/hooks";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { incidents } = useAppSelector((state) => state.incidents);
  const user = useAppSelector((state) => state.auth.user);
  const [cardsData, setCardsData] = useState(generateDashboardCards(incidents));

  useEffect(() => {
    setCardsData(generateDashboardCards(incidents));
  }, [incidents]);

  return (
    <div>
      <div className="flex justify-between gap-5">
        <div>
          <PageHeader
            title="Welcome Back"
            subtitle="Plan, prioritize, and accomplish task with ease"
          />
        </div>

        <div>
          {/* <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full">
            + Add Project
          </Button> */}
        </div>
      </div>

      {/* stats cards */}
      <div className="flex gap-3 overflow-x-scroll hide-scrollbar py-3 px-1">
        <StatsCard
          cardDetails={{
            title: "Total Incidents",
            count: incidents.length,
            percentage: 0,
            color: "yellow",
            isIncrese: true,
          }}
        />
        {cardsData.slice(0, 4).map((item) => (
          <StatsCard cardDetails={item} key={item.title} />
        ))}
      </div>

      {/* show stats thing on left, show live feed on right */}
      <div className="flex flex-col gap-10 md:gap-5 mt-5 md:mt-0 md:flex-row">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-[18px]">Weekly Analytics</h1>
            {user?.role == "admin" && (
              <p className="text-blue-700 font-semibold cursor-pointer">
                <Link to="/reports">See More</Link>
              </p>
            )}
          </div>
          <div className="bg-gray-50 p-5 flex flex-col gap-5 rounded-2xl border-[1px] border-black/10 shadow-sm">
            <DashboardChart />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-[18px]">Activity Feed</h1>
          </div>
          <div className="bg-gray-50 p-5 flex flex-col gap-5 rounded-2xl border-[1px] border-black/10 shadow-sm">
            {activityFeeds.map((item, index) => (
              <DashboardActivityFeed key={index} activity={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
