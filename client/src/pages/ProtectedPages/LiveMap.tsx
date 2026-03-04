import MapComponent from '@/components/custom/MapComponent'
import PageHeader from '@/components/custom/PageHeader'
import React from 'react'

const LiveMap : React.FC = () => {
  return (
    <div>
        <PageHeader title='Live Map'/>
        <MapComponent/>
    </div>
  )
}

export default LiveMap