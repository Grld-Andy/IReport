import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { activateAccount } from "@/services/auth/activateAccount";
import { activateAccountSchema } from "@/types/User";

const ActivateAccount: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const name = searchParams.get("name") || "User";
  const email = searchParams.get("email") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  type ActivateUser = z.infer<typeof activateAccountSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivateUser>({
    resolver: zodResolver(activateAccountSchema),
  });

  const onSubmit = async (data: ActivateUser) => {
    setApiError("");
    setIsSubmitting(true);

    const payload = {
      email,
      passwordConfirm: data.passwordConfirm,
      password: data.password,
      otp: data.otp,
    };

    const response = await activateAccount(payload);

    if (response.success) {
      toast.success("Account activated successfully!", {
        position: "top-center",
      });
      navigate("/auth/login");
    } else {
      setApiError(response.message);
      toast.error(response.message, { position: "top-center" });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="grid md:grid-cols-2 h-screen">
      {/* Left Image */}
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

      {/* Right Form */}
      <div className="flex flex-col justify-center items-center h-full p-8 gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2.5}
              className="w-4 h-4"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span
            className="font-black text-4xl tracking-tight text-gray-900"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Safe<span className="text-lime-500">Zone</span>
          </span>
        </div>

        {/* Form container */}
        <div
          className={`w-full max-w-md flex flex-col gap-4 ${
            isSubmitting ? "pointer-events-none" : ""
          }`}
        >
          <div className="text-center">
            <h1
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              className="text-[32px] font-extrabold text-black font-serif"
            >
              Welcome {name}
            </h1>
            <p className="text-gray-700">
              Activate your account for <strong>{email}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Password */}
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                  type="password"
                  className="bg-white"
                  placeholder="Enter password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </Field>

              {/* Confirm Password */}
              <Field>
                <FieldLabel>Confirm Password</FieldLabel>
                <Input
                  type="password"
                  className="bg-white"
                  placeholder="Confirm password"
                  {...register("passwordConfirm")}
                />
                {errors.passwordConfirm && (
                  <p className="text-red-500 text-sm">
                    {errors.passwordConfirm.message}
                  </p>
                )}
              </Field>

              {/* OTP */}
              <Field>
                <FieldLabel>OTP Code</FieldLabel>
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  className="bg-white"
                  {...register("otp")}
                />
                {errors.otp && (
                  <p className="text-red-500 text-sm">{errors.otp.message}</p>
                )}
              </Field>

              {/* API Error */}
              {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

              {/* Submit */}
              <Field>
                <Button type="submit" className="w-full h-10">
                  {isSubmitting ? (
                    <div className="loader bg-white w-[25px]"></div>
                  ) : (
                    <span>Activate Account</span>
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ActivateAccount;
