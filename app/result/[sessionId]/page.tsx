"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { PhotoSession } from "@/lib/types";

// AI analysis data generator
const generateAnalysisData = () => {
  const r = Math.floor(Math.random() * 30 + 235);
  const g = Math.floor(Math.random() * 30 + 210);
  const b = Math.floor(Math.random() * 30 + 195);

  const neutralEmotion = Math.floor(Math.random() * 15 + 75);
  const positiveEmotion = Math.floor(Math.random() * (100 - neutralEmotion - 5) + 5);
  const negativeEmotion = 100 - neutralEmotion - positiveEmotion;

  return [
    {
      category: "기본 분석",
      items: [
        { label: "얼굴 대칭도", value: `${(Math.random() * 8 + 90).toFixed(1)}%` },
        { label: "얼굴 검출 신뢰도", value: `${(Math.random() * 3 + 97).toFixed(1)}%` },
        { label: "이미지 해상도", value: `${600 + Math.floor(Math.random() * 200)}×${800 + Math.floor(Math.random() * 200)}px` },
      ]
    },
    {
      category: "표정 및 감정 분석",
      items: [
        { label: "중립", value: `${neutralEmotion}%` },
        { label: "긍정", value: `${positiveEmotion}%` },
        { label: "부정", value: `${negativeEmotion}%` },
      ]
    },
    {
      category: "시선 및 각도",
      items: [
        { label: "시선 방향", value: `${Math.random() > 0.5 ? '좌' : '우'}측 ${(Math.random() * 8 + 2).toFixed(1)}°` },
        { label: "머리 기울기", value: `${Math.random() > 0.5 ? '좌' : '우'}측 ${(Math.random() * 4 + 1).toFixed(1)}°` },
        { label: "얼굴 각도", value: `정면 기준 ${(Math.random() * 10 + 2).toFixed(1)}°` },
      ]
    },
    {
      category: "색상 및 조명",
      items: [
        { label: "평균 피부톤", value: `RGB(${r}, ${g}, ${b})` },
        { label: "조명 방향", value: `${['상단 좌측', '상단 우측', '정면 상단'][Math.floor(Math.random() * 3)]} ${Math.floor(Math.random() * 20 + 35)}°` },
        { label: "밝기 레벨", value: `${Math.floor(Math.random() * 20 + 65)}%` },
      ]
    },
  ];
};

export default function ResultPage({ params }: { params: { sessionId: string } }) {
  const [session, setSession] = useState<PhotoSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      // First try sessionStorage (for same device/browser)
      const sessionData = sessionStorage.getItem("photoSession");
      if (sessionData) {
        const parsedSession: PhotoSession = JSON.parse(sessionData);
        setSession(parsedSession);
        setLoading(false);
        return;
      }

      // If not in sessionStorage, fetch from Firestore (for QR code access)
      try {
        const response = await fetch(`/api/get-session/${params.sessionId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch session");
        }
        const data = await response.json();
        setSession(data);
      } catch (error) {
        console.error("Error loading session:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [params.sessionId]);

  if (loading || !session || session.selectedImageIndex === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-12">
            <div className="text-center">
              <p>Loading...</p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  const analysisData = generateAnalysisData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur">
        <CardContent className="p-8 md:p-12">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">AI 이미지 분석 보고서</h1>
              <p className="text-xs text-muted-foreground">
                생성 일시: {new Date(session.timestamp).toLocaleString("ko-KR")}
              </p>
            </div>

            {/* Selected Image - Small */}
            <div className="flex justify-center">
              <div className="relative w-48 aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={session.generatedImages[session.selectedImageIndex]}
                  alt="Selected photo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* AI Analysis Report */}
            <div className="border-t pt-6 space-y-6">
              {analysisData.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h2 className="text-base font-semibold mb-3 text-slate-700">{section.category}</h2>
                  <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                    {section.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex justify-between items-start">
                        <span className="text-sm text-slate-600 min-w-[120px]">{item.label}</span>
                        <span className="text-sm font-medium text-right flex-1">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Conclusion */}
            <div className="border-t pt-6">
              <div className="bg-slate-900 text-white p-6 rounded-lg space-y-3 text-center">
                <p className="text-lg font-semibold">결론</p>
                <p className="text-sm leading-relaxed">
                  이 이미지는 실제로 촬영되지 않은
                  <br />
                  AI가 생성한 가상의 순간입니다.
                </p>
                <p className="text-xs text-slate-300 pt-2">
                  존재하지 않은 것을 선택했습니다.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-6 text-center text-sm text-muted-foreground space-y-1">
              <p className="font-semibold">원본 / 원본</p>
              <p className="text-xs">原本 / 遠本</p>
              <p className="text-xs">The Original / The Distant</p>
              <p className="text-xs pt-1">An experimental art installation, 2025</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
