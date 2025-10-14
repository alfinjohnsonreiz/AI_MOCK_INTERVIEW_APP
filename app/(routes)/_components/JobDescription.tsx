import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function JobDescription({ onHandleInputChange, formData }: any) {
  return (
    <div className="border rounded-2xl p-10">
      <div>
        <label>Job Title</label>.
        <Input
          placeholder="Ex. Full Stack Developer"
          onChange={(e) => onHandleInputChange("jobTitle", e.target.value)}
          value={formData?.jobTitle || ""}
        />
      </div>
      <div className="mt-6">
        <label>Job Description</label>.
        <Textarea
          value={formData?.jobDescription || ""}
          onChange={(e) =>
            onHandleInputChange("jobDescription", e.target.value)
          }
          placeholder="write or paste job description.."
          className="h-[200px]"
        />
      </div>
    </div>
  );
}

export default JobDescription;
