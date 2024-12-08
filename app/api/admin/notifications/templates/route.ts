import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
    try {
      const { type, subject, content, variables } = await request.json();
      
      const template = await prisma.notificationTemplate.create({
        data: {
          type,
          subject,
          content,
          variables,
        },
      });
  
      return NextResponse.json({ template });
    } catch (error) {
      return new NextResponse("Internal Error", { status: 500 });
    }
  }