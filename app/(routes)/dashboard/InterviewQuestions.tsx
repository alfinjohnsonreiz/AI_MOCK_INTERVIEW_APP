function InterviewQuestions({
  data,
}: {
  data: { question: string; answer: string }[];
}) {
  return (
    <div className="mt-4">
      <h3 className="font-semibold text-md mb-2">
        Interview Questions & Answers:
      </h3>
      <ul className="space-y-3">
        {data.map((qa, index) => (
          <li key={index} className="p-3 border rounded bg-gray-50">
            <p className="mb-1">
              <strong>Q:</strong> {qa.question}
            </p>
            <p>
              <strong>A:</strong> {qa.answer}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InterviewQuestions;
