import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { originalImage } = await request.json();

    if (!originalImage) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Remove data:image prefix if present
    const base64Image = originalImage.replace(/^data:image\/\w+;base64,/, "");

    // Detect MIME type from original image
    const mimeType = originalImage.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";

    // Generate 3 variations with subtle differences
    const variations = [
      "Using the provided portrait photo, create a nearly identical image with these subtle changes: the person's lips are slightly curved upward (subtle smile, about 2-3 degrees), maintaining the exact same pose, lighting, background, and overall composition. The smile should be barely noticeable but present.",
      "Using the provided portrait photo, create a nearly identical image with these subtle changes: the person's gaze is directed 5 degrees to the left, maintaining the exact same facial expression, pose, lighting, background, and overall composition.",
      "Using the provided portrait photo, create a nearly identical image with these subtle changes: the person's chin is tilted 2 degrees upward, maintaining the exact same facial expression, gaze direction, lighting, background, and overall composition.",
    ];

    const generatedImages: string[] = [];

    for (const variation of variations) {
      const prompt = [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Image,
          },
        },
        { text: variation },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
        config: {
          responseModalities: ["Image"],
        },
      });

      // Extract image from response
      // Check if response has candidates structure
      if (response.candidates && response.candidates[0]) {
        const parts = response.candidates[0].content.parts;
        for (const part of parts) {
          if (part.inlineData) {
            const imageData = part.inlineData.data;
            const responseMimeType = part.inlineData.mimeType || "image/jpeg";
            generatedImages.push(`data:${responseMimeType};base64,${imageData}`);
            break;
          }
        }
      } else {
        console.error("Unexpected response structure:", JSON.stringify(response));
        throw new Error("Invalid response structure from Gemini API");
      }

      // Small delay between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (generatedImages.length !== 3) {
      return NextResponse.json(
        { error: "Failed to generate all images" },
        { status: 500 }
      );
    }

    return NextResponse.json({ images: generatedImages });
  } catch (error) {
    console.error("Error generating images:", error);
    return NextResponse.json(
      { error: "Failed to generate images", details: String(error) },
      { status: 500 }
    );
  }
}
