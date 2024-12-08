// AuthLayout.tsx
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/session";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = await headersList.get("x-invoke-path") || "";
  
  console.log("Auth Layout - Path:", pathname);

  // Only check session for login and verify pages
  if (pathname === "/admin/auth/login" || pathname === "/admin/auth/verify") {
    const session = await getSession();
    if (session) {
      console.log("Auth Layout - Already authenticated, redirecting to dashboard");
      return redirect("/admin/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
