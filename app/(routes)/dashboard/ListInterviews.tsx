// ListInterviews.tsx
import { Interview } from "./page";
import InterviewQuestions from "./InterviewQuestions";

function ListInterviews({ interviews }: { interviews: Interview[] }) {
  console.log("The interviews from here", interviews);

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-6">All Interviews Attended</h1>

      {interviews?.length === 0 && (
        <p className="text-gray-500">No interviews found.</p>
      )}

      <ul className="space-y-6">
        {interviews?.map((interview: Interview) => (
          <li
            key={interview._id}
            className="border p-4 rounded shadow-md bg-white"
          >
            <h2 className="text-lg font-semibold">{interview.jobTitle}</h2>
            <p className="text-gray-700 mt-1">{interview.jobDescription}</p>
            <p className="text-gray-400 text-sm mt-1">
              {new Date(interview._creationTime).toLocaleString()}
            </p>

            {interview.interviewQuestions && (
              <InterviewQuestions data={interview.interviewQuestions} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListInterviews;
