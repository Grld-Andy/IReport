import { z } from "zod";
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
  severityArray,
  severityOptions,
} from "@/types/SeverityEnum";
import {
  categoryArray,
  categoryOptions,
  IncidentCategory,
} from "@/types/CategoryEnum";
import { IncidentStatus, statusArray, statusOptions } from "@/types/StatusEnum";
import { incidentSchema, type Incident } from "@/types/Incident";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, type ReactNode } from "react";
import { useAppSelector } from "@/redux/app/hooks";
import UserCombobox from "./UserCombobox";
import { toast } from "sonner";
import { updateIncident } from "@/services/updateIncident";
import LocationPicker from "./LocationPicker";
import axios from "axios";

export type IncidentForm = z.infer<typeof incidentSchema>;

interface IncidentUpdateModalProps {
  incident: Incident;
  trigger: ReactNode;
  onUpdate?: (incident: Incident) => void;
}

export default function UpdateIncidentModal({
  incident,
  trigger,
  onUpdate,
}: IncidentUpdateModalProps) {
  const [latitude, setLatitude] = useState<number | null>(
    incident.latitude ?? null,
  );
  const [longitude, setLongitude] = useState<number | null>(
    incident.longitude ?? null,
  );
  const users = useAppSelector((state) => state.users.users);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IncidentForm>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      subject: "",
      description: "",
      category: 0,
      severity: 0,
      status: 0,
      assignedTo: "",
      locationDetails: "",
    },
  });

  const handleLocationSelect = (lat: number, lng: number, name?: string) => {
    setLatitude(lat);
    setLongitude(lng);

    if (name) {
      setValue("locationDetails", name);
    }
  };

  const getMyLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setLatitude(lat);
      setLongitude(lng);

      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );

      setValue("locationDetails", res.data.display_name);
    });
  };

  // Prefill form with incident data
  useEffect(() => {
    reset({
      subject: incident.subject || "",
      description: incident.description || "",
      category:
        IncidentCategory[
          incident.category as unknown as keyof typeof IncidentCategory
        ] || 0,
      severity:
        IncidentSeverity[
          incident.severity as unknown as keyof typeof IncidentSeverity
        ] || 0,
      status:
        IncidentStatus[
          incident.status as unknown as keyof typeof IncidentStatus
        ] || 0,
      assignedTo: incident.assignedTo?.id || "",
      locationDetails: incident.locationDetails || "",
    });
  }, [incident, reset]);

  const onError = (errors: unknown) => {
    console.error("Validation errors:", errors);
    const currentData = getValues();
    console.log("Current form data:", currentData);
  };

  const onSubmit = async (data: IncidentForm) => {
    console.log("form data to submit: ", {
      ...data,
      latitude,
      longitude,
    });
    const response = await updateIncident(
      {
        ...data,
        latitude,
        longitude,
      },
      incident.id,
    );
    console.log(response);

    if (response.success) {
      // update for kanban board
      if (onUpdate) {
        const updatedIncident = {
          ...incident,
          ...data,
          assignedTo: users.find((u) => u.id === data.assignedTo) || null,
        };

        console.log("updated incident =============== ", updatedIncident);
        onUpdate?.({
          ...updatedIncident,
          status: statusArray[Number(updatedIncident.status) - 1],
          category: categoryArray[updatedIncident.category - 1],
          severity: severityArray[updatedIncident.severity - 1],
          assignedTo: {
            email: updatedIncident.assignedTo?.email ?? "",
            name: updatedIncident.assignedTo?.name ?? "",
            id: updatedIncident.assignedTo?.id ?? "",
          },
        });
        setIsOpen(false);
      } else {
        toast.error(response.message, { position: "top-center" });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      {isOpen && (
        <DialogContent className="p-0 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <DialogHeader className="bg-gray-50 p-5 border-b-[1px] border-black/50">
              <DialogTitle>Edit Incident</DialogTitle>
              <DialogDescription>Update incident details</DialogDescription>
            </DialogHeader>

            <FieldGroup className="p-5 overflow-y-scroll max-h-[350px] hide-scrollbar">
              <Field>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" {...register("subject")} />
                {errors.subject && (
                  <p className="text-red-500 text-xs">
                    {errors.subject.message}
                  </p>
                )}
              </Field>

              <Field>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} />
                {errors.description && (
                  <p className="text-red-500 text-xs">
                    {errors.description.message}
                  </p>
                )}
              </Field>

              <div className="flex gap-2">
                <Field>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    defaultValue={IncidentCategory[
                      incident?.category as unknown as keyof typeof IncidentCategory
                    ]?.toString()}
                    onValueChange={(val) => setValue("category", Number(val))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
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
                  {errors.category && (
                    <p className="text-red-500 text-xs">
                      {errors.category.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="severity">Severity</Label>
                  <Select
                    defaultValue={IncidentSeverity[
                      incident?.severity as unknown as keyof typeof IncidentSeverity
                    ]?.toString()}
                    onValueChange={(val) => setValue("severity", Number(val))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select severity" />
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
                  {errors.severity && (
                    <p className="text-red-500 text-xs">
                      {errors.severity.message}
                    </p>
                  )}
                </Field>
              </div>

              <div className="flex gap-2">
                <Field>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    defaultValue={IncidentStatus[
                      incident.status as unknown as keyof typeof IncidentStatus
                    ].toString()}
                    onValueChange={(val) => setValue("status", Number(val))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
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
                  {errors.status && (
                    <p className="text-red-500 text-xs">
                      {errors.status.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="assignedTo">Assigned To</Label>

                  <UserCombobox
                    users={users}
                    value={getValues("assignedTo")}
                    initialUser={incident.assignedTo}
                    onChange={(id) => setValue("assignedTo", id)}
                  />

                  {errors.assignedTo && (
                    <p className="text-red-500 text-xs">
                      {errors.assignedTo.message}
                    </p>
                  )}
                </Field>
              </div>

              <Field>
                <div className="flex gap-5 justify-between">
                  <div className="flex flex-col gap-2">
                    <Label>Select Location on Map</Label>

                    {latitude && longitude ? (
                      <p className="text-xs text-gray-500 h-[18px]">
                        Selected: {latitude.toFixed(5)}, {longitude.toFixed(5)}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 h-[18px]">
                        Please select location
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={getMyLocation}
                  >
                    Use My Location
                  </Button>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <LocationPicker
                    latitude={latitude}
                    longitude={longitude}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>
              </Field>

              <Field>
                <Label htmlFor="locationDetails">Location Details</Label>
                <Textarea
                  id="locationDetails"
                  {...register("locationDetails")}
                />
              </Field>
            </FieldGroup>

            <DialogFooter className="p-5 flex gap-2 bg-gray-50 border-t-[1px] border-black/50">
              <DialogClose asChild>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="loader"></div>
                ) : (
                  "Update Incident"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
