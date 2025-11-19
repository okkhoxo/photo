import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

    const sessionRef = doc(db, "sessions", sessionId);
    const sessionDoc = await getDoc(sessionRef);

    if (!sessionDoc.exists()) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const data = sessionDoc.data();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Failed to fetch session", details: String(error) },
      { status: 500 }
    );
  }
}
