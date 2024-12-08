
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") ?? "1");
      const limit = parseInt(searchParams.get("limit") ?? "10");
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");
  
      const logs = await prisma.auditLog.findMany({
        where: {
          createdAt: {
            gte: startDate ? new Date(startDate) : undefined,
            lte: endDate ? new Date(endDate) : undefined,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      });
  
      return NextResponse.json({ logs });
    } catch (error) {
      return new NextResponse("Internal Error", { status: 500 });
    }
  }