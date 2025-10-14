"use client";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Interview } from "../../dashboard/page";
import { InterviewData } from "../../interview/[interviewId]/start/page";
import InterviewQuestions from "../../dashboard/InterviewQuestions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function InterviewDetail() {
  const params = useParams();
  const { interviewId } = params;
  console.log(interviewId);
  const convex = useConvex();
  const [interviewData, setInterviewData] = useState<InterviewData>();

  // Mock function to fetch interview by ID (replace with API call)
  const GetInterviewQuestions = async (id: any) => {
    try {
      const result = await convex.query(api.Interview.GetInterviewQuestions, {
        // @ts-ignore
        interviewRecordId: id,
      });
      console.log("The interviewData response", result);
      setInterviewData(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (interviewId) {
      GetInterviewQuestions(interviewId);
    }
  }, [interviewId]);

  if (!interviewData) {
    return (
      <div className="flex flex-col items-center mt-20">
        <p className="text-gray-500">Loading interview details...</p>
      </div>
    );
  }
  return (
    <div className="mt-14 flex flex-col items-center gap-5 max-w-4xl mx-auto p-10 bg-gray-100 rounded-2xl">
      <div className="flex  w-full justify-between">
        <Link href={"/dashboard"}>
          {" "}
          <Button> Go back</Button>
        </Link>
        <h1 className="text-2xl font-bold mb-4 ">
          {interviewData?.jobTitle ? interviewData?.jobTitle : "Interview"}
        </h1>
      </div>
      <div className="flex">
        <p className="text-gray-700 mb-2">{interviewData?.jobDescription}</p>
        <p className="text-gray-400 text-sm mb-4">
          {interviewData?._creationTime
            ? new Date(interviewData._creationTime).toLocaleString()
            : "No date available"}
        </p>
      </div>

      {interviewData.interviewQuestions && (
        <InterviewQuestions data={interviewData?.interviewQuestions!} />
      )}
    </div>
  );
}
