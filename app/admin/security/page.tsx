import { Metadata } from "next"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { AdminSecurityService } from "@/services/admin/adminSecurityService"
// import { DataTable } from "@/components/ui/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Security Dashboard",
  description: "Admin security dashboard and settings",
}

export default async function SecurityPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/auth/login")
  }

  // Get security logs
  const securityLogs = await prisma.adminSecurityLog.findMany({
    where: {
      adminId: session.user.id
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 50
  })

  // Get active sessions
  const activeSessions = await prisma.adminSession.findMany({
    where: {
      userId: session.user.id,
      revoked: false,
      expiresAt: {
        gt: new Date()
      }
    }
  })

  // Get blocked IPs
  const blockedIPs = await prisma.blockedIP.findMany({
    where: {
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="blocked">Blocked IPs</TabsTrigger>
          <TabsTrigger value="logs">Security Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Currently active admin sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{activeSessions.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Blocked IPs</CardTitle>
                <CardDescription>Currently blocked IP addresses</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{blockedIPs.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>Security events in last 24h</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {securityLogs.filter((log: any) => 
                    new Date(log.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                  ).length}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                All your current active sessions across devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSessions.map((session) => {
                  const deviceInfo = JSON.parse(session.deviceInfo)
                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{deviceInfo.userAgent}</p>
                        <p className="text-sm text-muted-foreground">
                          IP: {deviceInfo.ip}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expires: {new Date(session.expiresAt).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {/* Add revoke handler */}}
                      >
                        Revoke
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blocked IP Addresses</CardTitle>
              <CardDescription>
                IP addresses that are currently blocked from accessing the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blockedIPs.map((ip: any) => (
                  <div
                    key={ip.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{ip.ip}</p>
                      <p className="text-sm text-muted-foreground">
                        Reason: {ip.reason || "N/A"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires: {ip.expiresAt ? new Date(ip.expiresAt).toLocaleString() : "Never"}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {/* Add unblock handler */}}
                    >
                      Unblock
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Logs</CardTitle>
              <CardDescription>
                Recent security events and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{log.action}</p>
                        <Badge variant={
                          log.action.includes("FAILED") ? "destructive" :
                          log.action.includes("SUCCESS") ? "success" :
                          "secondary"
                        }>
                          {log.action.includes("FAILED") ? "Failed" :
                           log.action.includes("SUCCESS") ? "Success" :
                           "Info"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        IP: {log.ip}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                      {log.details && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {log.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}