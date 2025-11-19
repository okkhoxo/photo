"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/capture");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur">
        <CardContent className="p-12 text-center space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">
              원본 / 원본
            </h1>
            <p className="text-lg text-muted-foreground">
              原本 / 遠本
            </p>
            <p className="text-base text-muted-foreground">
              The Original / The Distant
            </p>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground max-w-md mx-auto">
            <p className="text-xs leading-relaxed">
              Interactive installation<br />
              Real-time camera capture, AI image generation<br />
              Web-based interface, Database<br />
              2025
            </p>
          </div>

          <div className="pt-8">
            <Button
              size="lg"
              className="text-lg px-12 py-6 h-auto"
              onClick={handleStart}
            >
              촬영 시작하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
