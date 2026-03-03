import { Button } from '@/components/ui/button';
import { SiGoogleauthenticator } from "react-icons/si";
import React from 'react';
import { FcGoogle } from "react-icons/fc";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div className='grid md:grid-cols-2 h-screen'>

      <div className='relative p-1 hidden md:block'>
        <div className='overflow-hidden rounded-3xl h-full'>
          <img src="/images/auth_bg.jpg" className='object-cover h-full w-full' />
        </div>
        <div className="absolute bottom-0 left-0 px-10 py-7">
          <h2 className='text-white font-bold text-[30px]'>SafeZone</h2>
        </div>
      </div>

      <div className='flex flex-col justify-center items-center h-full p-8 gap-8'>

        {/* Logo */}
        <div className='flex items-center gap-3'>
          <SiGoogleauthenticator size={50} />
          <span className='text-[30px] font-bold'>SafeZone</span>
        </div>

        {/* Form container */}
        <div className='w-full max-w-md flex flex-col gap-6'>

          <div className='text-center'>
            <h1 className='text-[40px] font-extrabold text-black'>Welcome Back</h1>
            <p className='text-gray-700 mt-2'>Enter your email and password to access your account</p>
          </div>

          {/* Actual form */}
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
              <Input type='email' id="fieldgroup-email" placeholder="Enter your email" />
            </Field>
            <Field>
              <FieldLabel htmlFor="fieldgroup-password">Password</FieldLabel>
              <Input
                id="fieldgroup-password"
                type="password"
                placeholder="***************"
              />
            </Field>
            <Field>
              <Button type="submit" className='w-full'>
                Sign In
              </Button>
            </Field>
          </FieldGroup>

          {/* Horizontal line */}
          <div className='relative my-4'>
            <div className='bg-black w-full h-[1px]'></div>
            <div className='absolute w-full flex items-center justify-center top-1/2 -translate-y-1/2'>
              <span className='bg-white px-3 text-gray-500'>OR</span>
            </div>
          </div>

          {/* Social login */}
          <div className='flex gap-4'>
            {[<FcGoogle size={25} />].map((item, index) => (
              <div key={index} className='flex justify-center items-center border-2 border-black/50 p-3 rounded-lg w-full cursor-pointer hover:bg-gray-100 transition'>
                {item}
              </div>
            ))}
          </div>

          {/* Signup link */}
          <div className='text-center text-gray-700 mt-2'>
            Don't have an account? <Link to={'/auth/register'} className='font-bold text-black cursor-pointer'>Register Now</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;