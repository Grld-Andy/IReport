import MapComponent from "@/components/custom/MapComponent";
import PageHeader from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { getAllIncidents } from "@/services/getIncidents";
import type { Incident } from "@/types/Incident";
import React, { useEffect, useState } from "react";

const LiveMap: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      const result = await getAllIncidents();
      setIncidents(result.incidents);
    };
    fetchIncidents();
  }, []);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMyLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Live Map"
          subtitle="Track incidents and respondents in real time"
        />
        <Button
          className="bg-green-500 hover:bg-green-600"
          onClick={handleGetLocation}
        >
          My Location
        </Button>
      </div>

      <div className="border rounded-2xl shadow-md overflow-hidden h-full">
        <MapComponent incidents={incidents} myLocation={myLocation} />
      </div>
    </div>
  );
};

export default LiveMap;