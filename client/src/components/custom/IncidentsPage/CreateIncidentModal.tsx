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

export type IncidentForm = z.infer<typeof incidentSchema>;

export default function CreateIncidentModal() {
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

  const onError = (errors: unknown) => {
    console.error("Validation errors:", errors);
  };

  const onSubmit = async (data: IncidentForm) => {
    try {
      const response = await createIncidentService(data);

      console.log("Created incident successfully", response);
      reset();
    } catch (err) {
      console.error("Failed to create incident", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600 text-white">
          <IoAddCircleOutline size={16}/>
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
                {isSubmitting ? <div className='loader'></div> : "Create Incident"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
