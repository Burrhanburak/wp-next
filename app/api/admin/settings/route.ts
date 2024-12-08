
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      const session = await auth();
      
      if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      
      return NextResponse.json({
        settings: {},
        status: "success"
      });
    } catch (error) {
      return new NextResponse("Internal Error", { status: 500 });
    }
  }