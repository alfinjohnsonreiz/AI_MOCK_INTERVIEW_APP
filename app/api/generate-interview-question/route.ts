import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import axios from "axios";

var imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_URL_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_URL_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});
export const POST = async (req: NextRequest) => {
  console.log("hitted");
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const jobTitle = formData.get("jobTitle");
  const jobDescription = formData.get("jobDescription");

  try {
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadPDFResponse = await imagekit.upload({
        file: buffer,
        fileName: Date.now().toString() + ".pdf",
        isPublished: true,
      });

      // call the webhook n8n hook
      const result = await axios.post(
        "http://localhost:5678/webhook-test/generate-interview-qtn",
        { resumeUrl: uploadPDFResponse?.url }
      );
      console.log("from route.ts ", result);
      const questions =
        result.data?.message?.content?.questions ||
        result.data?.message?.content?.interview_questions;
      return NextResponse.json({
        questions: questions,
        resumeUrl: uploadPDFResponse.url,
      });
    } else {
      // call the webhook n8n hook
      console.log("The things are", jobDescription, jobTitle);
      const result = await axios.post(
        "http://localhost:5678/webhook-test/generate-interview-qtn",
        { resumeUrl: null, jobTitle, jobDescription }
      );
      console.log("from route.ts ", result);
      const questions =
        result.data?.message?.content?.questions ||
        result.data?.message?.content?.interview_questions;
      console.log("the questions ", questions);
      return NextResponse.json({
        questions: questions,
        resumeUrl: null,
      });
    }
  } catch (error) {
    console.log("Error in routes.ts ", error);
  }
};
