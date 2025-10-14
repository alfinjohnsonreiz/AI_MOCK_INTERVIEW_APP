"use client"; // optional, if you want client interactivity

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src={"/error404.jpg"} />
      <Link href="/" className="mt-6 text-blue-500 underline">
        Go back home
      </Link>
    </div>
  );
}
