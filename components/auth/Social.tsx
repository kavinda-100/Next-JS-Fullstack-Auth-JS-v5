"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {DEFAULT_LOGIN_REDIRECT} from "@/routesHandeler";

const Social =  () => {

    const OnClick = async (provider : "google" | "github") => {
        try{
            await signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT })
            console.log(`Sign in success with ${provider}`)
        }
        catch (error){
            console.error(`Sign in failed with ${provider}`, error)
        }
    }


  return (
    <div className="flex w-full items-center justify-between gap-x-2">
      <Button
        size={"lg"}
        className="w-full"
        variant={"outline"}
        onClick={() => OnClick("google")}
      >
        <FcGoogle className="w-5 h-5" />
      </Button>
      <Button
        size={"lg"}
        className="w-full"
        variant={"outline"}
        onClick={() => OnClick("github")}
      >
        <FaGithub className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Social;
