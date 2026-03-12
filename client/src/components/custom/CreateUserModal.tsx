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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { userCreateSchema } from "@/types/User";
import { createUserService } from "@/services/createUser";
import { HiOutlineUserAdd } from "react-icons/hi";
import { toast } from "sonner";

export type UserForm = z.infer<typeof userCreateSchema>;

export default function CreateUserModal() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserForm>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      team: "",
    },
  });

  const onSubmit = async (data: UserForm) => {
      const response = await createUserService(data);
      console.log("User created", response);

      if(response.success){
      reset();
      setIsOpen(false);}else{
        toast.error(response.message)
      }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600 text-white">
          <HiOutlineUserAdd size={16} />
          Add User
        </Button>
      </DialogTrigger>

      {isOpen && (
        <DialogContent className="p-0 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader className="bg-gray-50 p-5 border-b-[1px] border-black/50">
              <DialogTitle>Create User</DialogTitle>
              <DialogDescription>
                Register a new response team member
              </DialogDescription>
            </DialogHeader>

            <FieldGroup className="p-5 overflow-y-scroll max-h-[350px] hide-scrollbar">
              <Field>
                <Label>Name</Label>
                <Input {...register("name")} placeholder="Full name" />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name.message}</p>
                )}
              </Field>

              <Field>
                <Label>Email</Label>
                <Input {...register("email")} placeholder="user@email.com" />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </Field>

              <Field>
                <Label>Password</Label>
                <Input type="password" {...register("password")} />
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </Field>

              <Field>
                <Label>Confirm Password</Label>
                <Input type="password" {...register("confirmPassword")} />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </Field>

              <div className="flex gap-2">
                {/* ROLE SELECT */}
                <Field>
                  <Label>Role</Label>
                  <Select onValueChange={(val) => setValue("role", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>

                        <SelectItem value="admin">Administrator</SelectItem>

                        <SelectItem value="supervisor">
                          Incident Supervisor
                        </SelectItem>

                        <SelectItem value="responder">
                          Field Responder
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {errors.role && (
                    <p className="text-red-500 text-xs">
                      {errors.role.message}
                    </p>
                  )}
                </Field>

                {/* TEAM SELECT */}
                <Field>
                  <Label>Team</Label>
                  <Select onValueChange={(val) => setValue("team", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Response Teams</SelectLabel>

                        <SelectItem value="marine_operations">
                          Marine Operations
                        </SelectItem>

                        <SelectItem value="port_security">
                          Port Security
                        </SelectItem>

                        <SelectItem value="emergency_response">
                          Emergency Response
                        </SelectItem>

                        <SelectItem value="environmental_safety">
                          Environmental Safety
                        </SelectItem>

                        <SelectItem value="logistics_control">
                          Logistics & Cargo Control
                        </SelectItem>

                        <SelectItem value="vessel_traffic_control">
                          Vessel Traffic Control
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {errors.team && (
                    <p className="text-red-500 text-xs">
                      {errors.team.message}
                    </p>
                  )}
                </Field>
              </div>
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
                {isSubmitting ? <div className="loader"></div> : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
