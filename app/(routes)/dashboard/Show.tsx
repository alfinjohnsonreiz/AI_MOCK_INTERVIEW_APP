"use client";
import Image from "next/image";
import { Interview } from "./page";
import { useRouter } from "next/navigation";

function Show({ interviews }: { interviews: Interview[] }) {
  const router = useRouter();

  const handleClick = (interviewId: string) => {
    // Navigate to a dynamic route with the interview ID
    router.push(`/interviews/${interviewId}`);
  };
  return (
    <div className="mt-14 flex flex-col items-center gap-5  border-dashed border-4 rounded-2xl bg-gray-100 p-10">
      <Image
        src={"/interview.jpg"}
        alt="empty-state"
        width={250}
        height={100}
      />
      <h2 className="mt-2 text-lg text-gray-500">Your Recent Interviews</h2>
      <div className="max-w-4xl mx-auto mt-6">
        {interviews?.length === 0 && (
          <p className="text-gray-500">No interviews found.</p>
        )}

        <ul className="space-y-6">
          {interviews?.map((interview: Interview) => (
            <li
              key={interview._id}
              className="border p-4 rounded shadow-md bg-white"
              onClick={() => handleClick(interview._id)}
            >
              {interview?.resumeUrl ? (
                <>
                  <p>open your resume </p>
                  {interview?.resumeUrl}
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold">
                    {interview.jobTitle}
                  </h2>
                  <p className="text-gray-700 mt-1">
                    {interview.jobDescription}
                  </p>
                </>
              )}

              <p className="text-gray-400 text-sm mt-1">
                {new Date(interview._creationTime).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Show;
