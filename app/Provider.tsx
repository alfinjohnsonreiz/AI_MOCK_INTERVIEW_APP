"use client";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import React, { useContext, useEffect, useState } from "react";
import { UserDetialContext } from "./context/UserDetailContext";
import { createContext } from "vm";

function Provider({ children }: any) {
  // Clerk’s useUser() hook to detect the currently authenticated user.
  const { user } = useUser();

  const CreateUserMutation = useMutation(api.user.CreateNewUser);

  const [userDetail, setUserDetail] = useState<any>();

  useEffect(() => {
    user && callCreateUser();
  }, [user]);

  const callCreateUser = async () => {
    if (user) {
      console.log("Provider.ts user is", user.id);
      const result = await CreateUserMutation({
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        imageUrl: user?.imageUrl ?? "",
        name: user?.fullName ?? "",
      });
      console.log("Result from Provider.ts", result);
      setUserDetail(result);
    }
  };
  return (
    <div>
      <UserDetialContext.Provider
        value={{ userId: user?.id, userDetail, setUserDetail }}
      >
        {children}
      </UserDetialContext.Provider>
    </div>
  );
}

export default Provider;

export const useUserDetailContext = () => {
  //! useContext()
  return useContext(UserDetialContext);
};
