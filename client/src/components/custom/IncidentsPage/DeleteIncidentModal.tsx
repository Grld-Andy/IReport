import React, { useState } from 'react'
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
import { Button } from '@/components/ui/button';
import { MdOutlineDelete } from 'react-icons/md';
import { deleteIncident } from '@/services/deleteIncident';

interface Props{
    id: string
}

const DeleteIncidentModal: React.FC<Props> = ({id}) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const submitDelete = () => {
        setIsSubmitting(true)
        deleteIncident(id)
        setIsSubmitting(false)
        setIsOpen(false)
    }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button variant={"destructive"}>
                <MdOutlineDelete/>
            </Button>
        </DialogTrigger>
        <DialogContent className='overflow-hidden p-0'>
            <DialogHeader className="bg-gray-50 p-5 border-b-[1px] border-black/50">
              <DialogTitle>Delete Incident</DialogTitle>
            </DialogHeader>
            <DialogDescription className='px-5'>
                <h1 className='font-semibold'>Are you sure you want to <span className='font-bold text-red-500'>delete</span> this incident?</h1>
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
                {isSubmitting ? "Saving..." : "Update Incident"}
              </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteIncidentModal