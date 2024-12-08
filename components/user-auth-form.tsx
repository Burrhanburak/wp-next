"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "login" | "register"
}

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type FormData = z.infer<typeof formSchema>

export function UserAuthForm({ className, type, ...props }: UserAuthFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    try {
      if (type === "register") {
        // Store password temporarily for auto-login after verification
        sessionStorage.setItem("tempPassword", data.password)

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        const responseData = await response.json()

        if (!response.ok) {
          throw new Error(responseData.error || "Registration failed")
        }

        toast.success("Verification code sent to your email")
        router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`)
      } else {
        // Login
        const result = await signIn("credentials", {
          email: data.email.toLowerCase(),
          password: data.password,
          redirect: false,
        })

        if (result?.error) {
          throw new Error(result.error)
        }

        toast.success("Logged in successfully")
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error(type === "login" ? "Login error:" : "Registration error:", error)
      toast.error(error.message || `Failed to ${type}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={type === "register" ? "new-password" : "current-password"}
              disabled={isLoading}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {type === "login" ? "Signing in..." : "Creating account..."}
              </div>
            ) : type === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
