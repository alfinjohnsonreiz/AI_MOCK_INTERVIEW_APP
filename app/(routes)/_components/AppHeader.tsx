import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

const MenuOptions = [
  {
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    name: "Upgrade",
    path: "/upgrade",
  },
  {
    name: "How it works?",
    path: "/how-it-works",
  },
];
function AppHeader() {
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <Image src={"/logo.svg"} alt="nothing" width={50} height={50} />
        <h1 className="text-base font-bold md:text-2xl">AI Mock Interview</h1>
      </div>
      <div>
        <ul className="flex gap-5">
          {MenuOptions.map((option, index) => (
            <li
              className="text-lg hover:scale-105 transition-all cursor-pointer"
              key={index}
            >
              {option.name}
            </li>
          ))}
        </ul>
      </div>
      <UserButton /> {/* custom button*/}
    </nav>
  );
}

export default AppHeader;
