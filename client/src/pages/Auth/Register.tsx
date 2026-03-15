import { Button } from "@/components/ui/button";
import { SiGoogleauthenticator } from "react-icons/si";
import React, { useState } from "react";
import { useForm, type SubmitErrorHandler } from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { userRegisterSchema } from "@/types/User";
import { zodResolver } from "@hookform/resolvers/zod";
import {  z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerUser } from "@/services/register";
import { toast } from "sonner";

export type RegisterUser = z.infer<typeof userRegisterSchema>;

const Register: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterUser>({
    resolver: zodResolver(userRegisterSchema),
  });

  const onSubmit = async (data: RegisterUser) => {
    setIsSubmitting(true);
    const response = await registerUser(data);
    if (response.success) {
      navigate("/auth/login");
    } else {
      toast.error(response.message, { position: "top-center" });
    }
    setIsSubmitting(false);
  };

  const onError: SubmitErrorHandler<RegisterUser> = (errors) => {
    console.error("Validation errors:", errors);
  };

  return (
    <div className="grid md:grid-cols-2 h-screen">
      <div className="flex flex-col justify-center items-center h-full gap-5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <SiGoogleauthenticator size={50} />
          <span className="text-[30px] font-bold font-serif">SafeZone</span>
        </div>

        <div
          className={`w-full max-w-md flex flex-col ${isSubmitting ? "pointer-events-none transition-all duration-100" : ""}`}
        >
          <div className="text-center">
            {/* <h1 className="text-[40px] font-extrabold text-black font-serif">
              Welcome!
            </h1> */}
            <p className="text-gray-700 mb-5">
              Join us today and start your journey with SafeZone.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit, onError)} className="py-2">
            <FieldGroup>
              <div className="flex flex-row gap-3">
                <Field>
                  <FieldLabel>User Name</FieldLabel>
                  <Input
                    className="h-10 bg-white"
                    placeholder="Enter your name"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    className="h-10 bg-white"
                    placeholder="Enter your email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </Field>
              </div>

              <Field>
                <FieldLabel>Team</FieldLabel>

                <Select onValueChange={(val) => setValue("team", val)}>
                  <SelectTrigger className="h-10 bg-white">
                    <SelectValue placeholder="Select your team" />
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
                  <p className="text-red-500 text-sm">{errors.team.message}</p>
                )}
              </Field>

              <div className="flex flex-row gap-3">
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    type="password"
                    className="h-10 bg-white"
                    placeholder="***************"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Confirm Password</FieldLabel>
                  <Input
                    type="password"
                    className="h-10 bg-white"
                    placeholder="***************"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </Field>
              </div>

              <Field>
                <Button type="submit" className="w-full h-10">
                  {isSubmitting ? (
                    <div className="loader bg-white w-[25px]"></div>
                  ) : (
                    <span>Sign Up</span>
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>

          {/* Login Link */}
          <div className="text-center text-gray-700 mt-2">
            Already have an account?{" "}
            <Link
              to={"/auth/login"}
              className="font-bold text-black cursor-pointer"
            >
              Login Now
            </Link>
          </div>
        </div>
      </div>

      {/* Side Image */}
      <div className="relative p-1 hidden md:block">
        <div className="overflow-hidden rounded-3xl h-full">
          <img
            src="/images/auth_bg.jpg"
            className="object-cover h-full w-full"
          />
        </div>
        <div className="absolute bottom-0 left-0 px-10 py-7">
          <h2 className="text-white font-bold text-[30px]">SafeZone</h2>
        </div>
      </div>
    </div>
  );
};

export default Register;
