import { Button } from "@/components/ui/button";
import { SiGoogleauthenticator } from "react-icons/si";
import React, { useState } from "react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import type z from "zod";
import { userLoginSchema } from "@/types/User";
import { useForm, type SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RegisterUser } from "./Register";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  loginStart,
  loginSuccess,
  loginStop,
} from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { login } from "@/services/login";

const Login: React.FC = () => {
  const isSubmitting: boolean = useAppSelector((state) => state.auth.isLoading);
  const dispatch = useAppDispatch();
  const [apiError, setApiError] = useState<string>("");
  const navigate = useNavigate();

  type LoginUser = z.infer<typeof userLoginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUser>({
    resolver: zodResolver(userLoginSchema),
  });

  const onSubmit = async (data: LoginUser) => {
    setApiError("");
    dispatch(loginStart());
    const response = await login(data);

    if (response.success) {
      dispatch(loginSuccess(response.message));
      navigate("/");
    } else {
      setApiError(response.message);
      toast.error(apiError, { position: "top-center" });
    }
    dispatch(loginStop());
  };

  const onError: SubmitErrorHandler<RegisterUser> = (errors) => {
    console.error("Validation errors:", errors);
  };

  return (
    <div className="grid md:grid-cols-2 h-screen">
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

      <div className="flex flex-col justify-center items-center h-full p-8 gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <SiGoogleauthenticator size={50} />
          <span className="text-[30px] font-bold font-serif">SafeZone</span>
        </div>

        {/* Form container */}
        <div
          className={`w-full max-w-md flex flex-col gap-4 ${isSubmitting ? "pointer-events-none transition-all duration-100" : ""}`}
        >
          <div className="text-center">
            <h1 className="text-[40px] font-extrabold text-black font-serif">
              Welcome Back
            </h1>
            <p className="text-gray-700">
              Enter your email and password to access your account
            </p>
          </div>

          {/* Actual form */}
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
                <Input
                  type="email"
                  className="h-10 bg-white"
                  id="fieldgroup-email"
                  disabled={isSubmitting}
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="fieldgroup-password">Password</FieldLabel>
                <Input
                  id="fieldgroup-password"
                  type="password"
                  disabled={isSubmitting}
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
              {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
              <Field>
                <Button type="submit" className="w-full h-10">
                  {isSubmitting ? (
                    <div className="loader bg-white w-[25px]"></div>
                  ) : (
                    <span>Sign In</span>
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          {/* Signup link */}
          <div className="text-center text-gray-700 mt-2">
            Don't have an account?{" "}
            <Link
              to={"/auth/register"}
              className="font-bold text-black cursor-pointer"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
