import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SESSION_COOKIE_NAME, TEMP_EMAIL_COOKIE_NAME } from "@/lib/constants";
import { getSession } from "@/lib/session";

interface SessionData {
  success: boolean;
  error?: string;
  user?: {
    email?: string;
    uid?: string;
  };
}

export default async function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const tempEmail = cookieStore.get(TEMP_EMAIL_COOKIE_NAME);
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || "";

  // Debug logging
  console.log("Verify Layout - Path:", pathname);
  console.log("Verify Layout - Session Cookie:", sessionCookie ? "Present" : "Missing");
  console.log("Verify Layout - Temp Email:", tempEmail ? {
    name: tempEmail.name,
    value: tempEmail.value,
    path: tempEmail.path,
    expires: tempEmail.expires
  } : "Missing");

  try {
    // Check if already verified
    const session: SessionData = await getSession();
    console.log("Verify Layout - Session Data:", session);

    if (session.success && session.user?.uid && session.user?.email) {
      console.log("Verify Layout - Valid session found, redirecting to dashboard");
      return redirect("/admin/dashboard");
    }

    // Check if we have a temporary email for verification
    if (!tempEmail?.value) {
      console.log("Verify Layout - No temp email found, redirecting to login");
      return redirect("/admin/auth/login");
    }

    // Validate temp email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(tempEmail.value)) {
      console.log("Verify Layout - Invalid temp email format");

      cookieStore.delete(TEMP_EMAIL_COOKIE_NAME);
      return redirect("/admin/auth/login");
    }

    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    );

  } catch (error) {
    console.error("Verify Layout - Error:", error);
    
    // Clear invalid cookies
    cookieStore.delete(TEMP_EMAIL_COOKIE_NAME);
    cookieStore.delete(SESSION_COOKIE_NAME);
    
    return redirect("/admin/auth/login");
  }
}