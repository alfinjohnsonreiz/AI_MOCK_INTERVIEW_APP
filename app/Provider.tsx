"use client";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import React, { useContext, useEffect, useState } from "react";
import { UserDetialContext } from "./context/UserDetailContext";

function Provider({ children }: any) {
  // Clerk’s useUser() hook to detect the currently authenticated user.
  const { user, isLoaded } = useUser();

  const CreateUserMutation = useMutation(api.user.CreateNewUser);

  const [userDetail, setUserDetail] = useState<any>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      callCreateUser();
    }
  }, [user]);

  const callCreateUser = async () => {
    try {
      console.log("Provider.ts user is", user?.id);
      const result = await CreateUserMutation({
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        imageUrl: user?.imageUrl ?? "",
        name: user?.fullName ?? "",
      });
      console.log("Result from Provider.ts", result);
      setUserDetail(result);
    } catch (error) {
      console.log("Eror in provider", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <UserDetialContext.Provider
        value={{
          userId: user?.id,
          userDetail: userDetail,
          setUserDetail,
        }}
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
