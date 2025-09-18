// src/app/api/jobs/[jobId]/route.ts
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;

  try {
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
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
