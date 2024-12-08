// app/dashboard/layout.tsx
"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<any | null>(null);

  useEffect(() => {
    const fetchAuth = async () => {
      const sessionData = await auth();
      if (!sessionData?.user) {
        redirect("/auth/login");
      } else {
        setSession(sessionData);
      }
    };

    fetchAuth();
  }, []);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-layout">
      <aside>Sidebar content</aside>
      <header>Dashboard Header</header>
      <main>{children}</main>
    </div>
  );
}
