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
import { IncidentSeverity, severityOptions } from "@/types/SeverityEnum";
import { categoryOptions, IncidentCategory } from "@/types/CategoryEnum";
import { IncidentStatus, statusOptions } from "@/types/StatusEnum";
import { apiUrl } from "@/constants";
import { incidentSchema, type Incident } from "@/types/Incident";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import axios from "axios";
import { CiEdit } from "react-icons/ci";

export type IncidentForm = z.infer<typeof incidentSchema>;

interface IncidentUpdateModalProps {
  incident: Incident;
}

export default function UpdateIncidentModal({ incident }: IncidentUpdateModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,getValues,
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

  // Prefill form with incident data
  useEffect(() => {
    reset({
      subject: incident.subject || "",
      description: incident.description || "",
      category: IncidentCategory[incident.category as unknown as keyof typeof IncidentCategory] || 0,
      severity: IncidentSeverity[incident.severity as unknown as keyof typeof IncidentSeverity] || 0,
      status: IncidentStatus[incident.status as unknown as keyof typeof IncidentStatus] || 0,
      assignedTo: incident.assignedTo?.name || "",
      locationDetails: incident.locationDetails || "",
    });
  }, [incident, reset]);

  const onError = (errors: unknown) => {
    console.error("Validation errors:", errors);
  const currentData = getValues();
  console.log("Current form data:", currentData);
  };

  const onSubmit = async (data: IncidentForm) => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported by your browser"));
        } else {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      });

      const { latitude, longitude } = position.coords;

      const response = await axios.put(
        `${apiUrl}incidents/${incident.id}`,
        { ...data, latitude, longitude },
        { withCredentials: true }
      );

      console.log("Updated incident successfully", response);
      reset();
    } catch (err) {
      console.error("Failed to update incident", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white">
          <CiEdit/>
        </Button>
      </DialogTrigger>

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
                {errors.subject && <p className="text-red-500 text-xs">{errors.subject.message}</p>}
              </Field>

              <Field>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} />
                {errors.description && (
                  <p className="text-red-500 text-xs">{errors.description.message}</p>
                )}
              </Field>

              <div className="flex gap-2">
                <Field>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    defaultValue={IncidentCategory[incident.category as unknown as keyof typeof IncidentCategory].toString()}
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
                {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
                </Field>

                <Field>
                  <Label htmlFor="severity">Severity</Label>
                  <Select
                    defaultValue={IncidentSeverity[incident.severity as unknown as keyof typeof IncidentSeverity].toString()}
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
                {errors.severity && <p className="text-red-500 text-xs">{errors.severity.message}</p>}
                </Field>
              </div>

              <div className="flex gap-2">
                <Field>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    defaultValue={IncidentStatus[incident.status as unknown as keyof typeof IncidentStatus].toString()}
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
                {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
                </Field>

                <Field>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input id="assignedTo" {...register("assignedTo")} placeholder="Not Assigned"/>
                {errors.assignedTo && <p className="text-red-500 text-xs">{errors.assignedTo.message}</p>}
                </Field>
              </div>

              <Field>
                <Label htmlFor="locationDetails">Location Details</Label>
                <Textarea id="locationDetails" {...register("locationDetails")} />
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
                {isSubmitting ? "Saving..." : "Update Incident"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}