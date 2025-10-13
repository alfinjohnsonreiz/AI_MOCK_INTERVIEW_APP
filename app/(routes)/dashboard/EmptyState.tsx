import Image from "next/image";
import React from "react";
import CreateInterviewDialog from "../_components/CreateInterviewDialog";

function EmptyState() {
  return (
    <div className="mt-14 flex flex-col items-center gap-5  border-dashed border-4 rounded-2xl bg-gray-100 p-10">
      <Image
        src={"/interview.jpg"}
        alt="empty-state"
        width={250}
        height={100}
      />
      <h2 className="mt-2 text-lg text-gray-500">
        You do not have any interview created
      </h2>
      <CreateInterviewDialog />
    </div>
  );
}

export default EmptyState;
