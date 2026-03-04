import MapComponent from "@/components/custom/MapComponent";
import PageHeader from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import React from "react";

const LiveMap: React.FC = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Live Map"
          subtitle="Track incidents and respondants in real time"
        />
        <Button className="bg-green-500 hover:bg-green-600">My Location</Button>
      </div>

      <div className="border rounded-2xl shadow-md overflow-hidden h-full">
        <MapComponent />
      </div>
    </div>
  );
};

export default LiveMap;
