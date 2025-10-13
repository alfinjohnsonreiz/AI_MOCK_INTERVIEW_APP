"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

function Interview() {
  const { interviewId } = useParams();

  return (
    <div>
      <div className="flex items-center justify-center mt-24 ">
        <Image
          src={"/interview2.jpg"}
          alt="Interview Started"
          width={400}
          height={200}
        />
        <div className="flex-col gap-14 ">
          <div>
            <h1 className="font-bold text-3xl"> Ready to start Interview ?</h1>
            <p className="pt-1  text-gray-500">
              The Interview will last 30 minutes . Are you Ready to begin ?
            </p>
          </div>
          <div className="pt-10">
            <Link href={"/interview/" + interviewId + "/start"}>
              <Button>
                Start Interview <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <hr />
      <div className="flex flex-col items-center justify-center mt-2 bg-gray-50">
        <h2 className="font-semibold text-2xl">
          Want to send interview link to someone
        </h2>
        <div className="flex gap-5 mt-2">
          <Input placeholder="Enter email addres" />
          <Button>
            <Send />{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Interview;
