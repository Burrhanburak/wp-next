import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardShell } from "@/components/admin/dashboard/shell"
import { AdminOverview } from "@/components/admin/dashboard/overview"
import { AdminStats } from "@/components/admin/dashboard/stats"
import { RecentActivity } from "@/components/admin/dashboard/recent-activity"
import { QuickActions } from "@/components/admin/dashboard/quick-actions"
import { prisma } from "@/lib/db"

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for WhatsApp Bulk",
}

export default async function AdminDashboard() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/auth/login")
  }

  // Fetch admin info
  const admin = await prisma.user.findUnique({
    where: {
      id: session.user.id,
      role: "ADMIN"
    },
    select: {
      name: true,
      email: true,
      phone: true,
      emailVerified: true,
    }
  })

  if (!admin) {
    redirect("/admin/auth/login")
  }

  // Fetch basic stats
  const stats = await prisma.$transaction([
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({ where: { role: "USER" } }),
    // Add other stats as needed
  ])

  // Fetch recent activity
  const recentActivity = await prisma.user.findMany({
    where: {
      role: "USER",
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    }
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome to your admin dashboard"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdminOverview admin={admin} />
        <AdminStats stats={stats} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentActivity
          activity={recentActivity}
          className="col-span-4"
        />
        <QuickActions
          className="col-span-3"
        />
      </div>
    </DashboardShell>
  )
}