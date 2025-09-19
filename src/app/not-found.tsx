// src/app/not-found.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <h1 className="text-6xl font-bold mb-4 text-red-600">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 text-center">
        Sorry, the page you are looking for does not exist.
      </p>
      <Button onClick={() => router.push("/")} className="px-6 py-3">
        Go to Home
      </Button>
    </div>
  );
}
