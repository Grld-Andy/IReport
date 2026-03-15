import MapComponent from "@/components/custom/MapComponent";
import PageHeader from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { toggleLocationSharing } from "@/redux/features/location/locationSlice";
import React, { useState } from "react";
import { toast } from "sonner";

const LiveMap: React.FC = () => {
  const dispatch = useAppDispatch();

  const { incidents } = useAppSelector((state) => state.incidents);
  const shouldSend = useAppSelector((state) => state.location.shouldSend);

  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMyLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Unable to get your location. Please allow location access.");
      }
    );
  };

  const handleToggleSharing = () => {
    handleGetLocation()

    dispatch(toggleLocationSharing(!shouldSend));

    if (!shouldSend) {
      toast.success("Location sharing started");
    } else {
      toast.info("Location sharing stopped");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Live Map"
          subtitle="Track incidents and respondents in real time"
        />

        <div className="flex gap-3">
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={handleGetLocation}
          >
            My Location
          </Button>

          <Button
            onClick={handleToggleSharing}
            className={
              shouldSend
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }
          >
            {shouldSend ? "Stop Sharing" : "Share Location"}
          </Button>
        </div>
      </div>

      <div className="border rounded-2xl shadow-md overflow-hidden h-full">
        <MapComponent incidents={incidents} myLocation={myLocation} />
      </div>
    </div>
  );
};

export default LiveMap;