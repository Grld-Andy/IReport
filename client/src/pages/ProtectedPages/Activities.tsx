import ActivitiesListView, {
  ActivityCardSkeleton,
} from "@/components/custom/ActivitiesListView";
import PageHeader from "@/components/custom/PageHeader";
import { useAppSelector } from "@/redux/app/hooks";
import React from "react";

const Activities: React.FC = () => {
  const activities = useAppSelector((state) => state.activities);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Activity Feed"
          subtitle="Track recent actions and updates across your system"
        />
      </div>

      <div className="rounded-md flex flex-col gap-2">
        {activities.isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <ActivityCardSkeleton key={index} />
          ))
        ) : activities.activities.length > 0 ? (
          activities.activities.map((activity, index) => (
            <ActivitiesListView key={index} activity={activity} />
          ))
        ) : (
          <h1 className="w-full text-gray-600 rounded-md h-[200px] text-lg p-2 grid place-content-center">
            No Activities Yet
          </h1>
        )}
      </div>
    </div>
  );
};

export default Activities;
