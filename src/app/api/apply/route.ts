import { NextResponse } from "next/server";
export async function POST(request: Request, { params }: { params: { jobId: string } }) {
  const { jobId } = params;
  const body = await request.json();

  try {
    const res = await fetch(
      `https://testdns.artizence.com/api/v1/applications/public/${jobId}/apply`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    let data: any;
    try {
      data = await res.json(); 
    } catch {
      const text = await res.text(); 
      return NextResponse.json(
        { success: false, message: "Invalid JSON response", raw: text },
        { status: 500 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data.detail || "Application failed" },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
