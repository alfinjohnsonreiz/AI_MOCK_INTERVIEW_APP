import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { VideoStatus } from "@/lib/types";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    console.log("Call hitted on the Post method generateing video");
    const { text } = await req.json();
    const payload = {
      video_inputs: [
        {
          character: {
            type: "talking_photo",
            talking_photo_id: "6013fc758b5446a2ba17d8c459538bb4", // Veronica
            scale: 1.0,
            talking_photo_style: "square", // or "circle"
            talking_style: "stable", // stable or expressive
          },
          voice: {
            type: "text",
            voice_id: "73c0b6a2e29d4d38aca41454bf58c955", // ✅ valid voice ID
            input_text: text,
            speed: 1.0,
            pitch: 0,
            emotion: "Friendly",
          },
          background: {
            type: "color",
            value: "#f6f6fc",
          },
        },
      ],
      caption: false,
      title: "Interview Question Video",
      dimension: { width: 720, height: 720 },
    };

    const response = await axios.post(
      "https://api.heygen.com/v2/video/generate",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.HEYGEN_API!,
        },
      }
    );
    console.log("The response from generate video ", response);
    return NextResponse.json({ video_id: response.data.data.video_id });
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to generate video" },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    console.log("Call hitted on the GET Method");
    // Get video_id from query params: /api/video-status?video_id=123
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("video_id");

    if (!videoId) {
      return NextResponse.json({ error: "Missing video_id" }, { status: 400 });
    }

    const response = await axios.get(
      "https://api.heygen.com/v1/video_status.get",
      {
        headers: {
          "x-api-key": process.env.HEYGEN_API!,
        },
        params: { video_id: videoId },
      }
    );

    const data: VideoStatus = response.data.data;
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching video status:", error);
    return NextResponse.json(
      { error: "Failed to fetch video status" },
      { status: 500 }
    );
  }
};
