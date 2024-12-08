import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = await headersList.get("x-invoke-path") || "";
  
  console.log("Dashboard Layout - Path:", pathname);

  // Verify session
  const session = await getSession();
  console.log("Dashboard Layout - Full Session Data:", JSON.stringify(session, null, 2));

  if (!session) {
    console.log("Dashboard Layout - No session found");
    return redirect("/admin/auth/login");
  }

  // Check for required fields
  const { email, uid } = session;
  console.log("Dashboard Layout - Session Info:", { email, uid });

  if (!email || !uid) {
    console.log("Dashboard Layout - Missing required session data");
    return redirect("/admin/auth/login");
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
