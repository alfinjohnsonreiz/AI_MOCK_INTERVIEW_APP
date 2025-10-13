"use client"; //here we use useUser,useState by default by convex

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import Provider from "./Provider";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <Provider>{children}</Provider>
    </ConvexProvider>
  );
}
