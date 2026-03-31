import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { useState, type ReactNode } from "react";
import type { Incident } from "@/types/Incident";
import LocationPicker from "./LocationPicker";

interface Props {
  incident: Incident;
  trigger: ReactNode;
}

export default function ViewIncidentModal({ incident, trigger }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      {isOpen && (
        <DialogContent className="p-0 overflow-hidden">
          <DialogHeader className="bg-gray-50 p-5 border-b-[1px] border-black/50">
            <DialogTitle>Incident Details</DialogTitle>
            <DialogDescription>
              Reported by {incident.reporter.name}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="p-5 overflow-y-scroll max-h-[350px] hide-scrollbar">
            <Field>
              <div className="flex text-sm justify-between items-center gap-3">
                <Label>Subject</Label>
              </div>
              <p className="text-gray-700 font-medium">{incident.subject}</p>
            </Field>

            <Field>
              <Label>Description</Label>
              <p className="text-gray-700">{incident.description}</p>
            </Field>

            <div className="flex gap-2">
              <Field>
                <Label>Status</Label>
                <p className="text-gray-800">{incident.status}</p>
              </Field>

              <Field>
                <Label>Assigned To</Label>
                <p className="text-gray-800">
                  {incident.assignedTo?.name || "Unassigned"}
                </p>
              </Field>
            </div>

            <div className="flex gap-2">
              <Field>
                <Label>Category</Label>
                <p className="text-gray-800">{incident.category}</p>
              </Field>

              <Field>
                <Label>Severity</Label>
                <p className="text-gray-800">{incident.severity}</p>
              </Field>
            </div>

            <Field>
              <div className="flex gap-5 justify-between">
                <div className="flex flex-col gap-2">
                  <Label>Location</Label>

                  <p className="text-xs text-gray-500 h-[18px]">
                    {incident.latitude && incident.longitude
                      ? `Coordinates: ${incident.latitude.toFixed(5)}, ${incident.longitude.toFixed(5)}`
                      : "No location provided"}
                  </p>
                </div>
              </div>

              <div className="border rounded-md overflow-hidden">
                <LocationPicker
                  latitude={incident.latitude}
                  longitude={incident.longitude}
                  onLocationSelect={() => {}}
                />
              </div>
            </Field>

            <Field>
              <Label>Location Details</Label>
              <p className="text-gray-700">
                {incident.locationDetails || "No details provided"}
              </p>
            </Field>
          </FieldGroup>

          <DialogFooter className="p-5 grid grid-cols-2 gap-2 bg-gray-50 border-t-[1px] border-black/50">
            <div></div>
            <DialogClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
