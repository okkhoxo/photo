"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { PhotoSession } from "@/lib/types";

export default function SelectPage() {
  const router = useRouter();
  const [session, setSession] = useState<PhotoSession | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("photoSession");
    if (!sessionData) {
      router.push("/");
      return;
    }

    const parsedSession: PhotoSession = JSON.parse(sessionData);
    setSession(parsedSession);
  }, [router]);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
  };

  const handleConfirm = () => {
    if (selectedIndex === null || !session) return;

    const updatedSession = {
      ...session,
      selectedImageIndex: selectedIndex,
    };

    sessionStorage.setItem("photoSession", JSON.stringify(updatedSession));
    router.push("/confirm");
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
      <Card className="w-full max-w-6xl bg-white/95 backdrop-blur">
        <CardContent className="p-8">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">당신의 사진을 선택하세요</h1>
              <p className="text-muted-foreground">
                가장 마음에 드는 사진을 선택해주세요
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {session.generatedImages.map((image, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer transition-all duration-200 ${
                    selectedIndex === index
                      ? "ring-4 ring-blue-500 scale-105"
                      : "hover:scale-102"
                  }`}
                  onClick={() => handleSelect(index)}
                >
                  <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={image}
                      alt={`Photo ${String.fromCharCode(65 + index)}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute top-2 left-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                    사진 {String.fromCharCode(65 + index)}
                  </div>
                  {selectedIndex === index && (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 rounded-lg">
                      <div className="bg-blue-500 text-white rounded-full p-3">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={handleConfirm}
                disabled={selectedIndex === null}
                className="px-12"
              >
                이 사진으로 선택
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
