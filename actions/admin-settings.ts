"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { hash } from "bcryptjs"

export async function addAdmin(values: {
  name: string
  email: string
  phone: string
}) {
  try {
    const session = await auth()

    // Check if user is authenticated and is admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" }
    }

    const { name, email, phone } = values

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "Email already exists" }
    }

    // Generate a random password (they'll need to reset it)
    const tempPassword = Math.random().toString(36).slice(-8)
    const hashedPassword = await hash(tempPassword, 12)

    // Create new admin user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: "ADMIN",
      },
    })

    // TODO: Send email with temporary password

    return { success: true }
  } catch (error) {
    console.error("[ADD_ADMIN_ERROR]", error)
    return { error: "Something went wrong!" }
  }
}
