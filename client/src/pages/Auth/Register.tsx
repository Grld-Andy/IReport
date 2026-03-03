import { Button } from "@/components/ui/button";
import { SiGoogleauthenticator } from "react-icons/si";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  return (
    <div className="grid md:grid-cols-2 h-screen">
      <div className="flex flex-col justify-center items-center h-full p-8 gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <SiGoogleauthenticator size={50} />
          <span className="text-[30px] font-bold font-serif">SafeZone</span>
        </div>

        {/* Form container */}
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-[40px] font-extrabold text-black font-serif">
              Welcome!
            </h1>
            <p className="text-gray-700 mt-2">
              Join us today and start your journey with SafeZone.
            </p>
          </div>

          {/* Actual form */}
          <FieldGroup>
            <div className="flex flex-row gap-3">
              <Field>
                <FieldLabel htmlFor="fieldgroup-name">UserName</FieldLabel>
                <Input
                  className="h-10"
                  id="fieldgroup-name"
                  placeholder="Enter your username"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
                <Input
                  type="email"
                  className="h-10"
                  id="fieldgroup-email"
                  placeholder="Enter your email"
                />
              </Field>
            </div>
            <div className="flex flex-row gap-3">
              <Field>
                <FieldLabel htmlFor="fieldgroup-password">Password</FieldLabel>
                <Input
                  id="fieldgroup-password"
                  type="password"
                  className="h-10"
                  placeholder="***************"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="fieldgroup-passwordConfirm">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="fieldgroup-passwordConfirm"
                  type="password"
                  className="h-10"
                  placeholder="***************"
                />
              </Field>
            </div>
            <Field>
              <Button type="submit" className="w-full h-10">
                Sign In
              </Button>
            </Field>
          </FieldGroup>

          {/* Horizontal line */}
          <div className="relative my-4">
            <div className="bg-black w-full h-[1px]"></div>
            <div className="absolute w-full flex items-center justify-center top-1/2 -translate-y-1/2">
              <span className="bg-white px-3 text-gray-500">OR</span>
            </div>
          </div>

          {/* Social login */}
          <div className="flex gap-4">
            {[<FcGoogle size={25} />].map((item, index) => (
              <div
                key={index}
                className="flex justify-center h-10 items-center border-2 border-black/50 p-3 rounded-lg w-full cursor-pointer hover:bg-gray-100 transition"
              >
                {item}
              </div>
            ))}
          </div>

          {/* Signup link */}
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

      {/* side image */}
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
