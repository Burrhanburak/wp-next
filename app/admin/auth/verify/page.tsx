"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { verifyAdminCode } from "@/actions/admin-auth";

const formSchema = z.object({
  code: z.string().min(1, {
    message: "Verification code is required.",
  }),
  type: z.enum(["totp", "backup"])
});

export default function AdminVerifyPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [verifyType, setVerifyType] = useState<"totp" | "backup">("totp");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      type: verifyType
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsPending(true);
      
      // Format code based on type
      const formattedCode = values.code.replace(/\s/g, '');
      
      console.log('Submitting verification:', { 
        code: formattedCode, 
        type: verifyType 
      });

      const result = await verifyAdminCode({
        code: formattedCode,
        type: verifyType,
      });

      console.log('Verification result:', result);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.success) {
        toast.success("Verification successful");
        router.push(result.redirectTo || "/admin/dashboard");
        router.refresh();
        return;
      }

    } catch (error) {
      console.error('Verification error:', error);
      toast.error("An error occurred during verification");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            {verifyType === "totp" 
              ? "Enter the code from your authenticator app"
              : "Enter one of your backup codes"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder={verifyType === "totp" ? "Enter 6-digit code" : "Enter backup code"}
                        autoComplete="one-time-code"
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isPending}
                  onClick={() => setVerifyType(verifyType === "totp" ? "backup" : "totp")}
                >
                  {verifyType === "totp" ? "Use backup code" : "Use authenticator"}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>Verifying...</>
                  ) : (
                    <>Verify</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
