import ActivitiesListView from "@/components/custom/ActivitiesListView";
import PageHeader from "@/components/custom/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { getActivities } from "@/services/getActivities";
import type { ActivityFeed } from "@/types/ActivityFeed";
import React, { useEffect, useState } from "react";

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Array<ActivityFeed>>([]);

  // switch to use memo or callback for better performance/caching
  useEffect(() => {
    const fetchActivities = async () => {
      const activitiesResult = await getActivities();
      setActivities(activitiesResult);
    };
    fetchActivities();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <PageHeader title="Activities Feed" subtitle="all activities" />
      </div>

      {activities ? (
        activities.map((activity, index) => (
          <ActivitiesListView key={index} activity={activity} />
        ))
      ) : (
        <Skeleton />
      )}
    </div>
  );
};

export default Activities;
