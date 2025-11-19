export interface PhotoSession {
  id: string;
  originalImage: string; // base64
  generatedImages: string[]; // 3 AI generated images (base64)
  selectedImageIndex: number | null;
  userConfirmed: boolean | null; // "예" or "아니오"
  timestamp: number;
  revealed: boolean;
}

export interface Statistics {
  totalParticipants: number;
  selectedAI: number; // Always 100% in this project since all are AI
  confirmedAsReal: number; // How many said "예"
}
