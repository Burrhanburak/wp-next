import Image from "next/image";
import { Suspense } from "react";
import  Logo from '@/public/images/logo.png';

import { RegisterForm } from "@/components/auth/form/register-form";

export default function RegisterPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-black" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src={Logo}
            alt="Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          WhatsApp Bulk
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This messaging platform has revolutionized how we communicate with our customers. It's simple, efficient, and incredibly powerful.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Image
              src={Logo}
              alt="Logo"
              width={80}
              height={80}
              className="rounded-full bg-black p-2"
            />
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your information below to create your account
            </p>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
