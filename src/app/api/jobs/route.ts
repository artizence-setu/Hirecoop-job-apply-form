// src/app/api/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: "jobId is required" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://testdns.artizence.com/api/v1/jobs/public/${jobId}/`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch job details" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
