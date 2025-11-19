"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { PhotoSession } from "@/lib/types";

export default function ConfirmPage() {
  const router = useRouter();
  const [session, setSession] = useState<PhotoSession | null>(null);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("photoSession");
    if (!sessionData) {
      router.push("/");
      return;
    }

    const parsedSession: PhotoSession = JSON.parse(sessionData);
    if (parsedSession.selectedImageIndex === null) {
      router.push("/select");
      return;
    }

    setSession(parsedSession);
  }, [router]);

  const handleAnswer = (answer: boolean) => {
    if (!session) return;

    const updatedSession = {
      ...session,
      userConfirmed: answer,
    };

    sessionStorage.setItem("photoSession", JSON.stringify(updatedSession));
    router.push("/reveal");
  };

  if (!session || session.selectedImageIndex === null) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  const selectedImage = session.generatedImages[session.selectedImageIndex];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-3xl bg-white/95 backdrop-blur">
        <CardContent className="p-12">
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="relative w-80 aspect-[3/4] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={selectedImage}
                  alt="Selected photo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="text-center space-y-6">
              <h1 className="text-3xl font-bold">
                이 모습이 당신이 마음에 드는 사진인가요?
              </h1>

              <div className="flex gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleAnswer(false)}
                  className="px-12 text-lg h-14"
                >
                  아니오
                </Button>
                <Button
                  size="lg"
                  onClick={() => handleAnswer(true)}
                  className="px-12 text-lg h-14"
                >
                  예
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
