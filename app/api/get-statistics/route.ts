import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { Statistics } from "@/lib/types";

export async function GET() {
  try {
    const statsRef = doc(db, "statistics", "global");
    const statsDoc = await getDoc(statsRef);

    if (!statsDoc.exists()) {
      const defaultStats: Statistics = {
        totalParticipants: 0,
        selectedAI: 0,
        confirmedAsReal: 0,
      };
      return NextResponse.json(defaultStats);
    }

    const data = statsDoc.data() as Statistics;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics", details: String(error) },
      { status: 500 }
    );
  }
}
