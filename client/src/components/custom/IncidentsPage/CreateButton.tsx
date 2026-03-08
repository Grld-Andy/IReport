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
} from "@/components/ui/select"
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { severityOptions } from "@/types/SeverityEnum";
import { categoryOptions } from "@/types/CategoryEnum";

function CreateIncidentButton() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            + Create New
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 overflow-hidden">
          <DialogHeader className="bg-gray-100 p-5 border-b-[1px] border-black/50">
            <DialogTitle>Report Incident</DialogTitle>
            <DialogDescription>
              Report a new Incident
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="p-5 overflow-y-scroll max-h-[350px] hide-scrollbar">
            <Field>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" placeholder="Brief summary of the incident" />
            </Field>
            <Field>
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" placeholder="Provide as much detail as possible of the incident..." />
            </Field>
            <div className="flex gap-2">
              <Field>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      {
                        categoryOptions.map(([label, value], index) => (
                          <SelectItem key={index} value={value.toString()}>{label}</SelectItem>
                        ))
                      }
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <Label htmlFor="severity">Severity</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Severity</SelectLabel>
                      {
                        severityOptions.map(([label, value], index) => (
                          <SelectItem key={index} value={value.toString()}>{label}</SelectItem>
                        ))
                      }
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field>
              <Label htmlFor="locationDetials">Location Details</Label>
              <Textarea id="locationDetials" name="locationDetials" placeholder="First floor of the main persol building" />
            </Field>
          </FieldGroup>
          <DialogFooter className="p-5 flex gap-2 bg-gray-100 border-t-[1px] border-black/50">
            <DialogClose asChild>
              <Button variant="outline" className="w-full">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default CreateIncidentButton;
