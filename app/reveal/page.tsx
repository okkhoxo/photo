"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PhotoSession } from "@/lib/types";

export default function RevealPage() {
  const router = useRouter();
  const [session, setSession] = useState<PhotoSession | null>(null);
  const [showReveal, setShowReveal] = useState(false);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("photoSession");
    if (!sessionData) {
      router.push("/");
      return;
    }

    const parsedSession: PhotoSession = JSON.parse(sessionData);
    if (
      parsedSession.selectedImageIndex === null ||
      parsedSession.userConfirmed === null
    ) {
      router.push("/");
      return;
    }

    setSession(parsedSession);

    // Show reveal after 1 second
    const timer = setTimeout(() => {
      setShowReveal(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleContinue = async () => {
    if (!session) return;

    // Mark as revealed
    const updatedSession = {
      ...session,
      revealed: true,
    };

    sessionStorage.setItem("photoSession", JSON.stringify(updatedSession));

    // Navigate to QR page
    router.push("/qr");
  };

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <Card
        className={`w-full max-w-3xl bg-white/95 backdrop-blur transition-opacity duration-1000 ${
          showReveal ? "opacity-100" : "opacity-0"
        }`}
      >
        <CardContent className="p-12">
          <div className="space-y-8 text-center">
            <div className="space-y-8">
              <h1 className="text-4xl font-bold leading-tight">
                이 순간은
                <br />
                존재하지 않았습니다
              </h1>

              <div className="py-4">
                <div className="w-16 h-0.5 bg-border mx-auto" />
              </div>

              <div className="space-y-3 text-xl text-muted-foreground">
                <p>3장 모두</p>
                <p>AI가 생성한 이미지입니다</p>
              </div>

              <div className="py-4">
                <div className="w-16 h-0.5 bg-border mx-auto" />
              </div>

              <div className="space-y-4 text-2xl leading-relaxed">
                <p>존재하지 않은 것을</p>
                <p>선택했습니다</p>
              </div>
            </div>

            <div className="pt-8">
              <Button
                size="lg"
                onClick={handleContinue}
                className="px-12 text-lg h-14"
              >
                계속하기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
