import React, { useState, type ReactNode } from "react";
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
import { Button } from "@/components/ui/button";
import { deleteIncident as deleteIncidentService } from "@/services/deleteIncident";
import { toast } from "sonner";

interface Props {
  id: string;
  deleteFunc?: (id: string) => void;
  trigger: ReactNode;
}

const DeleteIncidentModal: React.FC<Props> = ({
  id,
  deleteFunc,
  trigger,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const submitDelete = async () => {
    setIsSubmitting(true);
    const { success, message } = await deleteIncidentService(id);
    if (success) {
      if (deleteFunc) {
        deleteFunc(id);
      }
    } else {
      toast.error(message, { position: "top-center" });
    }
    setIsSubmitting(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="overflow-hidden p-0">
        <DialogHeader className="bg-gray-50 p-5 border-b-[1px] border-black/50">
          <DialogTitle>Delete Incident</DialogTitle>
        </DialogHeader>
        <DialogDescription className="px-5 font-semibold">
          Are you sure you want to{" "}
          <span className="font-bold text-red-500">delete</span> this incident?
        </DialogDescription>
        <DialogFooter className="p-5 flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={submitDelete}
            className="w-full"
            variant={"destructive"}
            disabled={isSubmitting}
          >
            {isSubmitting ? <div className="loader"></div> : "Update Incident"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteIncidentModal;
