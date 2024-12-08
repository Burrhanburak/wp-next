"use client";

import { Suspense, useEffect } from "react";
import { VerifyForm } from "@/components/auth/form/verify-form";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const createdAt = searchParams.get("createdAt");


  useEffect(() => {
    if (!email || !createdAt) {
      router.push("/auth/login");
    }
  }, [email, createdAt, router]);

  const handleVerification = async (token: string) => {
    try {
    
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Email verified successfully!");
        router.push(data.redirectUrl);
      } else {
        toast.error(data.error || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Something went wrong during verification");
    }
    
  };

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="mr-2"
          />
          WhatsApp Bulk
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This messaging platform has revolutionized how we connect with our customers, making bulk communication effortless and effective.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Email Doğrulama
            </h1>
            <p className="text-sm text-muted-foreground">
              {email} adresine gönderilen doğrulama kodunu girin
            </p>
          </div>

          <Suspense fallback={<div>Loading verification form...</div>}>
            <VerifyForm 
              email={email} 
              createdAt={createdAt} 
              onVerify={handleVerification} 
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}