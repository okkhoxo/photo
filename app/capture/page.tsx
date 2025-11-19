"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Helper function to compress image
const compressImage = async (base64Image: string, maxWidth = 500, quality = 0.5): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Image);
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = base64Image;
  });
};

export default function CapturePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [capturing, setCapturing] = useState(false);
  const [generatingImages, setGeneratingImages] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    startCamera();
    // Auto-capture after 3 seconds
    const captureTimer = setTimeout(() => {
      capturePhoto();
    }, 3000);

    return () => {
      clearTimeout(captureTimer);
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 640, facingMode: "user" }, // 3:4 ratio (portrait)
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("카메라 접근 권한이 필요합니다.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setCapturing(true);

    // Play camera shutter sound
    const audio = new Audio("/shutter.mp3");
    audio.play().catch(() => {
      // Fallback if sound doesn't play
      console.log("Shutter sound not available");
    });

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Reduce image size to save storage space
    // Max width: 600px (maintains aspect ratio) - reduced for sessionStorage
    const maxWidth = 600;
    const scale = Math.min(1, maxWidth / video.videoWidth);

    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Use JPEG with strong compression to reduce file size
    const imageData = canvas.toDataURL("image/jpeg", 0.6);

    // Stop camera
    stopCamera();

    // Show generating message
    setGeneratingImages(true);
    setProgress(0);

    // Simulate progress - slower to match AI generation time (~30 seconds)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 3;
      });
    }, 1000);

    try {
      // Generate 3 AI variations
      const response = await fetch("/api/generate-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalImage: imageData }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate images");
      }

      const data = await response.json();

      clearInterval(progressInterval);
      setProgress(100);

      // Compress all generated images to save sessionStorage space
      const compressedImages = await Promise.all(
        data.images.map((img: string) => compressImage(img, 500, 0.5))
      );

      // Store session data in sessionStorage
      // Don't store original image to save space (we only show AI generated ones)
      const sessionId = Date.now().toString();
      sessionStorage.setItem(
        "photoSession",
        JSON.stringify({
          id: sessionId,
          originalImage: "", // Empty to save storage space
          generatedImages: compressedImages,
          selectedImageIndex: null,
          userConfirmed: null,
          timestamp: Date.now(),
          revealed: false,
        })
      );

      // Navigate to selection page
      setTimeout(() => {
        router.push("/select");
      }, 500);
    } catch (error) {
      console.error("Error generating images:", error);
      alert("이미지 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      router.push("/");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-4xl bg-white/95 backdrop-blur">
        <CardContent className="p-8">
          {!generatingImages ? (
            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <p className="text-white">카메라 준비 중...</p>
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>
          ) : (
            <div className="space-y-6 py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
                </div>
                <h2 className="text-2xl font-semibold">
                  이미지 준비 중입니다...
                </h2>
                <p className="text-muted-foreground">
                  잠시만 기다려주세요
                </p>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
