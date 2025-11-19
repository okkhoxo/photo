import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, increment, setDoc } from "firebase/firestore";
import type { PhotoSession } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const session: PhotoSession = await request.json();

    // Save session to Firestore
    const sessionsRef = collection(db, "sessions");
    const docRef = await addDoc(sessionsRef, {
      selectedImageIndex: session.selectedImageIndex,
      userConfirmed: session.userConfirmed,
      timestamp: session.timestamp,
      revealed: session.revealed,
      generatedImages: session.generatedImages, // Store images for QR code access
    });

    // Update statistics
    const statsRef = doc(db, "statistics", "global");
    await updateDoc(statsRef, {
      totalParticipants: increment(1),
      selectedAI: increment(1), // Always increment since all are AI
      confirmedAsReal: increment(session.userConfirmed ? 1 : 0),
    }).catch(async () => {
      // If document doesn't exist, create it with ID "global"
      await setDoc(statsRef, {
        totalParticipants: 1,
        selectedAI: 1,
        confirmedAsReal: session.userConfirmed ? 1 : 0,
      });
    });

    return NextResponse.json({ sessionId: docRef.id });
  } catch (error) {
    console.error("Error saving session:", error);
    return NextResponse.json(
      { error: "Failed to save session", details: String(error) },
      { status: 500 }
    );
  }
}
