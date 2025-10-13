import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const SaveInterviewQuestions = mutation({
  args: {
    questions: v.any(),
    uid: v.id("UserTable"),
    resumeUrl: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const result_id = ctx.db.insert("InterviewSessionTable", {
      interviewQuestions: args.questions,
      resumeUrl: args?.resumeUrl ?? null,
      userId: args.uid,
      status: "draft",
      jobTitle: args?.jobTitle ?? null,
      jobDescription: args?.jobDescription ?? null,
    });
    return result_id;
  },
});

export const GetInterviewQuestions = query({
  args: {
    interviewRecordId: v.id("InterviewSessionTable"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("InterviewSessionTable")
      .filter((q) => q.eq(q.field("_id"), args.interviewRecordId))
      .collect();

    return result[0];
  },
});

export const saveVideoData = mutation({
  args: {
    sessionId: v.id("InterviewSessionTable"),
    question: v.string(),
    videoUrl: v.string(),
    videoId: v.string(),
  },
  handler: async (ctx, { sessionId, question, videoUrl, videoId }) => {
    const session = await ctx.db.get(sessionId);
    if (!session) throw new Error("Session not found");

    // Push new video data
    const videoData = session.videoData || [];
    videoData.push({
      question,
      videoUrl,
      createdAt: Date.now().toLocaleString(),
      videoId,
    });

    // Update the session
    await ctx.db.patch(sessionId, { videoData });

    return { success: true };
  },
});
