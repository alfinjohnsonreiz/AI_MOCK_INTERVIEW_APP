import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeUpload from "./ResumeUpload";
import JobDescription from "./JobDescription";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserDetailContext } from "@/app/Provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function CreateInterviewDialog() {
  const router = useRouter();
  const { userDetail, setUserDetail, userId } = useUserDetailContext();

  const [formData, setFormData] = useState<any>();

  const [file, setFile] = useState<File | null>();

  const [loading, setLoading] = useState(false);

  const saveInterviewDB = useMutation(api.Interview.SaveInterviewQuestions);
  const onHandleInputChange = (field: string, value: string | null) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    console.log("The handle changed", field, value);
  };

  const onSubmit = async () => {
    setLoading(true);
    const NewformData = new FormData();
    if (file) {
      NewformData.append("file", file);
    }
    NewformData?.append("jobTitle", formData?.jobTitle);
    NewformData?.append("jobDescription", formData?.jobDescription);
    console.log("from form data", formData?.jobDescription);
    try {
      const result = await axios.post(
        "api/generate-interview-question",
        NewformData
      );
      console.log("The questions", result.data?.questions);
      console.log("The Resume url", result.data?.resumeUrl);
      console.log("The Job Title", formData?.jobTitle);
      console.log("The Job Description", formData?.jobDescription);

      // Save to Database
      console.log("user ", userId);
      //@ts-ignore warning ignoring
      const responseId = await saveInterviewDB({
        questions: result.data?.questions,
        resumeUrl: result.data?.resumeUrl ?? "",
        uid: userDetail?._id,
        jobTitle: formData?.jobTitle ?? "",
        jobDescription: formData?.jobDescription ?? "",
      });
      console.log(responseId);
      toast.success("Interview Generated");
      router.push("/interview/" + responseId);
    } catch (error) {
      console.log(error);
      toast.error("Error occured");
    } finally {
      setLoading(false);
      setFormData(null);
    }
  };
  return (
    <Dialog>
      <DialogTrigger className="rounded-md text-sm  h-9 px-4 py-2 has-[>svg]:px-3 bg-primary text-primary-foreground hover:bg-primary/90 ">
        + Create Interview
      </DialogTrigger>
      <DialogContent className="min-w-3xl">
        <DialogHeader>
          <DialogTitle>Please Submit following details</DialogTitle>
          <DialogDescription>
            <Tabs defaultValue="upload-resume" className="w-full mt-5">
              <TabsList>
                <TabsTrigger value="upload-resume">Upload Resume</TabsTrigger>
                <TabsTrigger value="job-description">
                  Job Description
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upload-resume">
                <ResumeUpload setFiles={(file: File) => setFile(file)} />
              </TabsContent>
              <TabsContent value="job-description">
                <JobDescription
                  onHandleInputChange={onHandleInputChange}
                  formData={formData}
                />
              </TabsContent>
            </Tabs>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <DialogClose>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateInterviewDialog;
