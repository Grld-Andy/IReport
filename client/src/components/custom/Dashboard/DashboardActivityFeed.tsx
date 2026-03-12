import type { ActivityFeed } from '@/types/ActivityFeed'
import React from 'react'
import { format } from 'date-fns' // optional, for better formatting

interface Props {
  activity: ActivityFeed
}

const DashboardActivityFeed: React.FC<Props> = ({ activity }) => {
  return (
    <div className="border-l-2 mt-3 relative border-gray-700/70 pl-3">
      <div className="absolute w-[10px] h-[10px] top-[-13px] left-[-5.5px] rounded-full bg-gray-700/70"></div>

      <div className="flex flex-col relative bottom-[20px]">
        <p className="text-black">
          <span className="font-semibold">{activity.actorName}</span> performed 
          <span className="font-semibold"> {activity.action}</span>
        </p>
        <p className="text-gray-800 text-sm">{activity.details}</p>
        <p className="text-gray-600 text-sm">
          {format(new Date(activity.createdAt), 'EEEE, MMM dd yyyy, hh:mm a')}
        </p>
      </div>
    </div>
  )
}

export default DashboardActivityFeed