import type { ActivityFeed } from '@/types/ActivityFeed'
import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { format } from 'date-fns'

interface Props {
  activity: ActivityFeed
}

const ActivitiesListView: React.FC<Props> = ({ activity }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-900 leading-snug">
            <span className="font-semibold">{activity.actorName}</span>{" "}
            {activity.action}
          </p>

          <p className="text-sm text-gray-600">
            {activity.details}
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span className="bg-gray-100 px-2 py-0.5 rounded-md text-gray-600">
              {activity.module}
            </span>
            <span>•</span>
            <span>
              {format(new Date(activity.createdAt), 'MMM dd, yyyy • hh:mm a')}
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}


export const ActivityCardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        
        <div className="flex flex-col gap-2 w-full">
          
          <div className="flex gap-2 items-center">
            <Skeleton className="h-4 w-24" /> 
            <Skeleton className="h-4 w-32" />
          </div>

          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />

          <div className="flex items-center gap-2 mt-1">
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <Skeleton className="w-8 h-8 rounded-full" />

      </div>
    </div>
  )
}

export default ActivitiesListView