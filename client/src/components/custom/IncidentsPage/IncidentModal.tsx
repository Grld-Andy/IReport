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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  IncidentSeverity,
  severityOptions,
} from "@/types/SeverityEnum";

import {
  categoryOptions,
  IncidentCategory,
} from "@/types/CategoryEnum";

import { IncidentStatus, statusOptions } from "@/types/StatusEnum";

import { useState, type ReactNode } from "react";
import { useAppSelector } from "@/redux/app/hooks";
import UserCombobox from "./UserCombobox";
import LocationPicker from "./LocationPicker";
import type { Incident } from "@/types/Incident";

interface IncidentModalProps {
  incident: Incident;
  trigger: ReactNode;
}

export default function IncidentModal({ incident, trigger }: IncidentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const users = useAppSelector((state) => state.users.users);

  const latitude = incident.latitude;
  const longitude = incident.longitude;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      {isOpen && (
        <DialogContent className="p-0 overflow-hidden">
          <DialogHeader className="bg-gray-50 p-5 border-b-[1px] border-black/50">
            <DialogTitle>Incident Details</DialogTitle>
            <DialogDescription>View incident information</DialogDescription>
          </DialogHeader>

          <FieldGroup className="p-5 overflow-y-scroll max-h-[350px] hide-scrollbar">
            <Field>
              <Label>Subject</Label>
              <Input value={incident.subject} readOnly />
            </Field>

            <Field>
              <Label>Description</Label>
              <Textarea value={incident.description} readOnly />
            </Field>

            <div className="flex gap-2">
              <Field>
                <Label>Category</Label>
                <Select disabled value={IncidentCategory[
                  incident.category as unknown as keyof typeof IncidentCategory
                ]?.toString()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      {categoryOptions.map((category, idx) => (
                        <SelectItem key={idx} value={category[1].toString()}>
                          {category[0]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <Label>Severity</Label>
                <Select disabled value={IncidentSeverity[
                  incident.severity as unknown as keyof typeof IncidentSeverity
                ]?.toString()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Severity</SelectLabel>
                      {severityOptions.map((severity, idx) => (
                        <SelectItem key={idx} value={severity[1].toString()}>
                          {severity[0]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="flex gap-2">
              <Field>
                <Label>Status</Label>
                <Select
                  disabled
                  value={IncidentStatus[
                    incident.status as unknown as keyof typeof IncidentStatus
                  ]?.toString()}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      {statusOptions.map((status, idx) => (
                        <SelectItem key={idx} value={status[1].toString()}>
                          {status[0]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <Label>Assigned To</Label>

                <UserCombobox
                  users={users}
                  value={incident.assignedTo?.id ?? ""}
                  initialUser={incident.assignedTo}
                  onChange={() => {}}
                />
              </Field>
            </div>

            <Field>
              <div className="flex flex-col gap-2">
                <Label>Location</Label>

                {latitude && longitude ? (
                  <p className="text-xs text-gray-500">
                    {latitude.toFixed(5)}, {longitude.toFixed(5)}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">No location selected</p>
                )}
              </div>

              <div className="border rounded-md overflow-hidden pointer-events-none">
                <LocationPicker
                  latitude={latitude}
                  longitude={longitude}
                  onLocationSelect={() => {}}
                />
              </div>
            </Field>

            <Field>
              <Label>Location Details</Label>
              <Textarea value={incident.locationDetails ?? ""} readOnly />
            </Field>
          </FieldGroup>

          <DialogFooter className="p-5 bg-gray-50 border-t-[1px] border-black/50">
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