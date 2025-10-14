"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import EmptyState from "./EmptyState";
import CreateInterviewDialog from "../_components/CreateInterviewDialog";
import { useConvex, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUserDetailContext } from "@/app/Provider";
import ListInterviews from "./ListInterviews";
import Show from "./Show";

export type Interview = {
  _id: Id<"InterviewSessionTable">;
  _creationTime: number;
  interviewQuestions: any;
  resumeUrl: string | null;
  userId: Id<"UserTable">;
  status: string;
  jobTitle: string | null;
  jobDescription: string | null;
  videoData?: {
    videoId?: string;
    createdAt: string | number;
    question: string;
    videoUrl: string;
  }[];
};

function Dashboard() {
  const { user } = useUser();
  const { userDetail } = useUserDetailContext();
  // if (!userDetail) {
  //   return <p>Loading user details...</p>;
  // }
  console.log("use", userDetail);
  const uid = userDetail?._id as Id<"UserTable">;
  const convex = useConvex();
  // const [interviewList, setInterviewList] = useState<Interview[]>([]);

  const interviewList: Interview[] | undefined = useQuery(
    api.Interview.getInterviewByUserId,
    {
      userID: uid,
    }
  );

  if (!interviewList) return <p>Loading interviews...</p>;

  return (
    <div className="py-20 px-10 md:px-28 lg:px-44 xl:px-56">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg text-gray-500">My Dashboard</h2>
          <h2 className="text-3xl font-bold">Welcome,{user?.fullName}</h2>
        </div>
        <div>
          <CreateInterviewDialog />
        </div>
      </div>
      {interviewList.length == 0 ? (
        <EmptyState />
      ) : (
        <Show interviews={interviewList} />
      )}
    </div>
  );
}

export default Dashboard;
