"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Repeat } from "lucide-react";
import { AiFillMuted } from "react-icons/ai";
import { AiOutlineMuted } from "react-icons/ai";

export type InterviewData = {
  jobTitle: string | null;
  jobDescription: string | null;
  interviewQuestions: InterviewQuestions[];
  userId: string | null;
  _id: string | null;
  videoData?: VideoData[];
  _creationTime?: number;
};

export type InterviewQuestions = {
  answer: string;
  question: string;
};
export type VideoData = {
  videoId?: string | null;
  createdAt: string | number;
  question: string;
  videoUrl: string;
};

function Start() {
  const { interviewId } = useParams();
  const sessionId = interviewId as Id<"InterviewSessionTable">;
  const convex = useConvex();

  const [interviewData, setInterviewData] = useState<InterviewData>();

  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [showAnswer, setShowAnswer] = useState(false);

  const saveVideo = useMutation(api.Interview.saveVideoData);

  const playerRef = useRef<HTMLVideoElement | null>(null);
  // const [videoEnded, setEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const GetInterviewQuestions = async () => {
    try {
      const result = await convex.query(api.Interview.GetInterviewQuestions, {
        // @ts-ignore
        interviewRecordId: interviewId,
      });
      console.log("The interviewData response", result);
      setInterviewData(result);
    } catch (error) {
      console.log(error);
    }
  };

  const generateVideo = async (text: string) => {
    setLoading(true);
    try {
      console.log("Calling generate video");
      const { data } = await axios.post("/api/heygen", {
        text,
      });
      console.log("The video generate response", data);
      setVideoId(data.video_id);
      console.log(data.video_id);
    } catch (error) {
      console.log("error from generate video", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Next button
  const handleNext = () => {
    if (!interviewData?.interviewQuestions) return;

    const nextIndex = currentIndex + 1;
    if (nextIndex < interviewData.interviewQuestions.length) {
      setCurrentIndex(nextIndex);
      const question = interviewData.interviewQuestions[nextIndex].question;
      generateVideo(question);
    }
  };

  const handleRepeat = () => {
    if (playerRef.current) {
      playerRef.current.currentTime = 0;
      playerRef.current.play();
      // setEnded(false);
    }
  };
  const handlePlayWithSound = () => {
    if (isMuted && playerRef.current) {
      // This must be triggered by user interaction
      playerRef.current.muted = false;
      setIsMuted(false);
    } else if (!isMuted && playerRef.current) {
      playerRef.current.muted = true;
      setIsMuted(true);
    }
  };

  useEffect(() => {
    GetInterviewQuestions();
  }, [interviewId]);

  useEffect(() => {
    console.log("interviewData", interviewData);
    // Generate video for first question automatically
    if (interviewData?.interviewQuestions?.length) {
      const question = interviewData.interviewQuestions[currentIndex].question;
      const videoDataExists = interviewData?.videoData?.find((item) => {
        return item.question == question && item;
      });

      if (videoDataExists?.videoId) {
        setVideoId(videoDataExists.videoId);
      } else {
        generateVideo(question);
      }
    }
  }, [interviewData]);

  useEffect(() => {
    if (!videoId) return;

    let interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`/api/heygen?video_id=${videoId}`);
        console.log("Video Status:", data);
        if (data.data.video_url) {
          setVideoUrl(data.data.video_url);
          clearInterval(interval); // stop polling when ready
          const result = await saveVideo({
            question:
              interviewData?.interviewQuestions[currentIndex]?.question || "",
            videoUrl: data.data.video_url,
            sessionId,
            videoId,
          });
          console.log("Data store", result);
        }
      } catch (error) {
        console.log(error);
      }
    }, 3000); // check every 3 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [videoId]);
  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      {interviewData?._id && (
        <>
          <h1 className="text-xl font-semibold">
            The interview code: {interviewData?._id}
          </h1>
        </>
      )}

      {interviewData?.interviewQuestions && (
        <>
          <div className="w-full max-w-3xl flex mt-4 space-y-4">
            {videoUrl && (
              <>
                <div className="flex flex-col gap-4 justify-center mt-4 ">
                  <video
                    src={videoUrl}
                    autoPlay={true}
                    ref={playerRef}
                    playsInline
                    muted={true}
                    width="640px"
                    height="360px"
                    onEnded={() => {
                      // setEnded(true);
                      setShowAnswer(true);
                    }}
                  />
                  <div>
                    <Button
                      onClick={handleRepeat}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                      <Repeat />
                    </Button>
                    <Button
                      onClick={handlePlayWithSound}
                      // disabled={isMuted}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition ml-2"
                    >
                      {isMuted ? <AiOutlineMuted /> : <AiFillMuted />}
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-100 p-4 rounded shadow">
                  <p className="text-lg font-medium">
                    <span className="font-bold">Q:</span>{" "}
                    {interviewData.interviewQuestions[currentIndex].question}
                  </p>
                </div>
              </>
            )}
          </div>
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="w-full border-2 max-w-3xl flex mt-4 space-y-4 bg-gray-100 p-4 rounded shadow "
            >
              <p className="text-gray-700">
                <span className="font-bold">A:</span>{" "}
                {interviewData?.interviewQuestions?.[currentIndex]?.answer}
              </p>
              <div>
                <button
                  onClick={() => {
                    handleNext();
                    setShowAnswer(false); // hide answer for next question
                  }}
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 mt-2"
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}

      <div className="flex justify-end items-center mt-2">
        {loading && <p className="text-gray-500 ml-2">Generating video...</p>}
      </div>
    </div>
  );
}

export default Start;
