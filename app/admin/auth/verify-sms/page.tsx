"use client"

import { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AdminVerifyForm } from "@/components/admin/auth/admin-verify-form"

export default function VerifySMSPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Verify SMS Code</CardTitle>
          <CardDescription className="text-center">
            Enter the verification code sent to your phone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminVerifyForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            Didn&apos;t receive the code?{" "}
            <Button variant="link" className="px-0">
              Resend Code
            </Button>
          </div>
          <div className="text-sm text-muted-foreground text-center">
            <Link href="/admin/auth/login">
              <Button variant="link" className="px-0">
                Back to Login
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
