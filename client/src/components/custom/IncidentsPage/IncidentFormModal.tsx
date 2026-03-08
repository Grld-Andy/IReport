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
import { severityOptions } from "@/types/SeverityEnum";
import { categoryOptions } from "@/types/CategoryEnum";
import { statusOptions } from "@/types/StatusEnum";
import { apiUrl } from "@/constants";
import { incidentSchema, type Incident } from "@/types/Incident";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Edit3 } from "lucide-react";
import axios from "axios";

export type IncidentForm = z.infer<typeof incidentSchema>;

interface IncidentFormModalProps {
  isEditing?: boolean;
  incident?: Incident;
}

export default function IncidentFormModal({
  isEditing = false,
  incident,
}: IncidentFormModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
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

  // Prefill if editing
  useEffect(() => {
    if (isEditing && incident) {
      console.log(incident.category);
      reset({
        subject: incident.subject || "",
        description: incident.description || "",
        category: incident.category || "",
        severity: incident.severity || "",
        status: incident.status || "",
        assignedTo: incident.assignedTo?.name || "",
        locationDetails: incident.locationDetails || "",
      });
    }
  }, [isEditing, incident, reset]);

  const onError = (errors: unknown) => {
    console.error("Validation errors:", errors);
  };

  const onSubmit = async (data: IncidentForm) => {
    console.log("submitting form");
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
          } else {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          }
        },
      );
      const { latitude, longitude } = position.coords;

      console.log("submitting data: ", data);

      if (isEditing) {
        const response = await axios.patch(
          `${apiUrl}incidents/${incident?.id}`,
          { ...data, longitude, latitude },
          { withCredentials: true },
        );

        console.log("received response : ", response);
      } else {
        const response = await axios.post(
          `${apiUrl}incidents`,
          { ...data, longitude, latitude },
          { withCredentials: true },
        );

        console.log("received response : ", response);
      }

      console.log(`${isEditing ? "Updated" : "Created"} incident successfully`);
      reset();
    } catch (err) {
      console.error("Failed to save incident", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            <Edit3 />
          </Button>
        ) : (
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            Create New
          </Button>
        )}
      </DialogTrigger>

      {isOpen && (
        <DialogContent className="p-0 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <DialogHeader className="bg-gray-50 p-5 border-b-[1px] border-black/50">
              <DialogTitle>
                {isEditing ? "Edit Incident" : "Report Incident"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update incident details"
                  : "Report a new incident"}
              </DialogDescription>
            </DialogHeader>

            <FieldGroup className="p-5 overflow-y-scroll max-h-[350px] hide-scrollbar">
              <Field>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  {...register("subject")}
                  placeholder="Brief summary of the incident"
                />
                {errors.subject && (
                  <p className="text-red-500 text-xs">
                    {errors.subject.message}
                  </p>
                )}
              </Field>

              <Field>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Provide as much detail as possible"
                />
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
                    value={String(incident?.category ?? 0)}
                    onValueChange={(val) => {
                      const numericVal = val === "" ? 0 : Number(val);
                      setValue("category", numericVal);
                    }}
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
                    defaultValue={incident?.severity.toString()}
                    onValueChange={(val) => {
                      const numericVal = val === "" ? 0 : Number(val);
                      setValue("severity", numericVal);
                    }}
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

              {isEditing && (
                <div className="flex gap-2">
                  <Field>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      defaultValue={incident?.status.toString()}
                      onValueChange={(val) => {
                        const numericVal = val === "" ? 0 : Number(val);
                        setValue("status", numericVal);
                      }}
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
                    <Input
                      id="assignedTo"
                      defaultValue={incident?.assignedTo?.name}
                      {...register("assignedTo")}
                      placeholder="Assign to (optional)"
                    />
                  </Field>
                </div>
              )}
              <Field>
                <Label htmlFor="locationDetails">Location Details</Label>
                <Textarea
                  id="locationDetails"
                  {...register("locationDetails")}
                  placeholder="First floor of the main building"
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
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
