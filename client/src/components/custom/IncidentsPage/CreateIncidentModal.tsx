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
import { IoAddCircleOutline } from "react-icons/io5";
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
import { incidentSchema } from "@/types/Incident";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createIncidentService } from "@/services/createInicident";
import { toast } from "sonner";
import LocationPicker from "./LocationPicker";
import axios from "axios";

export type IncidentForm = z.infer<typeof incidentSchema>;

export default function CreateIncidentModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

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

  const onError = (errors: unknown) => {
    console.error("Validation errors:", errors);
  };

  const onSubmit = async (data: IncidentForm) => {
    const response = await createIncidentService({
      ...data,
      longitude,
      latitude,
    });
    if (response.success) {
      console.log("Created incident successfully", response);
      reset();
    } else {
      toast.error(response.message, { position: "top-center" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600 text-white">
          <IoAddCircleOutline size={16} />
          Report Incident
        </Button>
      </DialogTrigger>

      {isOpen && (
        <DialogContent className="p-0 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <DialogHeader className="bg-gray-50 p-5 border-b-[1px] border-black/50">
              <DialogTitle>Report Incident</DialogTitle>
              <DialogDescription>Report a new incident</DialogDescription>
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
                    defaultValue="0"
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
                    defaultValue="0"
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

                <div
                  className="border rounded-md overflow-hidden
                "
                >
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
                  rows={5}
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
                {isSubmitting ? (
                  <div className="loader"></div>
                ) : (
                  "Create Incident"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
