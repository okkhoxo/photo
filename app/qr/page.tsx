"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import QRCode from "react-qr-code";
import type { PhotoSession } from "@/lib/types";

export default function QRPage() {
  const router = useRouter();
  const [session, setSession] = useState<PhotoSession | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("photoSession");
    if (!sessionData) {
      router.push("/");
      return;
    }

    const parsedSession: PhotoSession = JSON.parse(sessionData);
    setSession(parsedSession);

    // Save session to Firebase
    saveSession(parsedSession);
  }, [router]);

  const saveSession = async (session: PhotoSession) => {
    try {
      const response = await fetch("/api/save-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      });

      if (!response.ok) {
        throw new Error("Failed to save session");
      }

      const data = await response.json();
      setSessionId(data.sessionId);
      setLoading(false);
    } catch (error) {
      console.error("Error saving session:", error);
      // Use timestamp as fallback ID
      setSessionId(session.id);
      setLoading(false);
    }
  };

  if (!session || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p>저장 중...</p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Always use the current deployment URL (not localhost in production)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const resultUrl = `${baseUrl}/result/${sessionId}`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur">
        <CardContent className="p-12">
          <div className="space-y-8 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">QR 코드를 스캔하세요</h1>
              <p className="text-muted-foreground">
                당신의 선택과 진실을 확인할 수 있습니다
              </p>
            </div>

            <div className="flex justify-center py-8">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <QRCode value={resultUrl} size={256} />
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>모바일 기기로 QR 코드를 스캔하거나</p>
              <p className="font-mono text-xs break-all">{resultUrl}</p>
              <p>위 링크를 방문하세요</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
