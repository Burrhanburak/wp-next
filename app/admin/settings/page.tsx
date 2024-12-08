import { Metadata } from "next"
import { AdminSettingsForm } from "@/components/admin/settings/admin-settings-form"

export const metadata: Metadata = {
  title: "Admin Settings",
  description: "Manage admin users and settings",
}

export default async function AdminSettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">
          Manage admin users and their access
        </p>
      </div>
      <div className="space-y-8">
        <AdminSettingsForm />
      </div>
    </div>
  )
}