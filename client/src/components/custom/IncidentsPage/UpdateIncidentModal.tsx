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
import { statusArray, statusOptions } from "@/types/StatusEnum";
import { apiUrl } from "@/constants";
import { type Incident } from "@/types/Incident";
import { useEffect, useState } from "react";
import axios from "axios";

interface IncidentUpdateModalProps {
  incident: Incident;
}

export default function UpdateIncidentModal({ incident }: IncidentUpdateModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: 0,
    severity: 0,
    status: 0,
    assignedTo: "",
    locationDetails: "",
  });

  useEffect(() => {
    if (incident) {
      setFormData({
        subject: incident.subject || "",
        description: incident.description || "",
        category: incident.category || 0,
        severity: incident.severity || 0,
        status: incident.status || 0,
        assignedTo: incident.assignedTo?.name || "",
        locationDetails: incident.locationDetails || "",
      });
    }
  }, [incident]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation not supported"));
        } else {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      });

      const { latitude, longitude } = position.coords;

      const response = await axios.patch(
        `${apiUrl}incidents/${incident.id}`,
        { ...formData, latitude, longitude },
        { withCredentials: true }
      );

      console.log("Updated incident:", response.data);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update incident", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          Edit Incident
        </Button>
      </DialogTrigger>

      {isOpen && (
        <DialogContent className="p-0 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <DialogHeader className="bg-gray-50 p-5 border-b-[1px] border-black/50">
              <DialogTitle>Edit Incident</DialogTitle>
              <DialogDescription>
                Update incident details
              </DialogDescription>
            </DialogHeader>

            <FieldGroup className="p-5 overflow-y-scroll max-h-[350px] hide-scrollbar">
              <Field>
                <Label>Subject</Label>
                <Input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <Label>Description</Label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Field>

              <div className="flex gap-2">
                <Field>
                  <Label>Category</Label>
                  <Select
                    defaultValue={formData.category.toString()}
                    onValueChange={(val) =>
                      handleSelectChange("category", val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        {categoryOptions.map((category, idx) => (
                          <SelectItem
                            key={idx}
                            value={category[1].toString()}
                          >
                            {category[0]}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <Label>Severity</Label>
                  <Select
                    defaultValue={formData.severity.toString()}
                    onValueChange={(val) =>
                      handleSelectChange("severity", val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Severity</SelectLabel>
                        {severityOptions.map((severity, idx) => (
                          <SelectItem
                            key={idx}
                            value={severity[1].toString()}
                          >
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
                    defaultValue={statusArray[incident.status]}
                    value={statusArray[incident.status]}
                    onValueChange={(val) =>
                      handleSelectChange("status", val)
                    }
                  >
                    <SelectTrigger>
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
                </Field>

                <Field>
                  <Label>Assigned To</Label>
                  <Input
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    placeholder="Not Assigned"
                  />
                </Field>
              </div>

              <Field>
                <Label>Location Details</Label>
                <Textarea
                  name="locationDetails"
                  value={formData.locationDetails}
                  onChange={handleChange}
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
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
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