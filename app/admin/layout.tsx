import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = await headersList.get("x-invoke-path") || "";
  
  console.log("Admin Root Layout - Path:", pathname);
  
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}