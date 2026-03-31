import type { ActivityFeed } from '@/types/ActivityFeed'
import React from 'react'

interface Props{
    activity: ActivityFeed
}

// complete this to match my dashboard or make it better
const ActivitiesListView: React.FC<Props> = ({activity}) => {
  return (
    <div>{activity.details}</div>
  )
}

export default ActivitiesListView