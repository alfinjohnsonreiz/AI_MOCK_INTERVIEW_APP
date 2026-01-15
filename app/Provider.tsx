"use client";
import React, { useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserDetialContext } from "./context/UserDetailContext";

function Provider({ children }: any) {
  // Clerk’s useUser() hook to detect the currently authenticated user.
  const { user, isLoaded } = useUser();

  const CreateUserMutation = useMutation(api.user.CreateNewUser);

  const [userDetail, setUserDetail] = useState<any>();

  const [loading, setLoading] = useState(true);

 useEffect(() => {
    if (!isLoaded) return; // wait for Clerk to initialize

    if (user) {
      const callCreateUser = async () => {
        try {
          const result = await CreateUserMutation({
            email: user.primaryEmailAddress?.emailAddress ?? "",
            imageUrl: user.imageUrl ?? "",
            name: user.fullName ?? "",
          });
          setUserDetail(result);
        } catch (error) {
          console.error("Error in Provider:", error);
        } finally {
          setLoading(false);
        }
      };

      callCreateUser();
    } else {
      // No user logged in, stop loading
      setLoading(false);
    }
  }, [user, isLoaded, CreateUserMutation]);

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
