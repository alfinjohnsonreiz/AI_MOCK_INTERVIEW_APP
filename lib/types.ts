export interface VideoStatus {
  id: string;
  status: "processing" | "completed" | "failed" | "pending";
  video_url: string | null;
  thumbnail_url: string | null;
  duration?: number;
  error?: any;
  [key: string]: any;
}
