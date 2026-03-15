import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { resetPassword } from "@/services/resetPassword";
import { useNavigate } from "react-router-dom";

type ResetPasswordForm = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ResetPasswordModal: React.FC<Props> = ({ open, onOpenChange }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordForm>({
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });
  const navigate = useNavigate();

  const onSubmit = async (data: ResetPasswordForm) => {
    const response = await resetPassword(data);

    if (response.success) {
      toast.success("Password updated successfully", {
        position: "top-center",
      });

      reset();
      navigate("/auth/login")
      onOpenChange(false);
    } else {
      toast.error(response.message, {
        position: "top-center",
      });
    }
  };

  const onError = (errors: unknown) => {
    console.error(errors);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <DialogContent className="p-0 overflow-hidden max-w-md">
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <DialogHeader className="bg-gray-50 p-5 border-b border-black/10">
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Update your account password securely
              </DialogDescription>
            </DialogHeader>

            <FieldGroup className="p-5 flex flex-col gap-4">
              <Field>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...register("currentPassword", {
                    required: "Current password is required",
                  })}
                />
                {errors.currentPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.currentPassword.message}
                  </p>
                )}
              </Field>

              <Field>
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "New password is required",
                    minLength: {
                      value: 5,
                      message: "Password must be at least 5 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </Field>

              <Field>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </Field>
            </FieldGroup>

            <DialogFooter className="p-5 flex gap-2 bg-gray-50 border-t border-black/10">
              <DialogClose asChild>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                {isSubmitting ? (
                  <div className="loader"></div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ResetPasswordModal;
