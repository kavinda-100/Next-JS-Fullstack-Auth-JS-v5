"use server"

import { signIn } from "@/auth";
import {DEFAULT_LOGIN_REDIRECT} from "@/routesHandeler";

export default async function OAuthLogIn(provider : "google" | "github") {
    try {
        await signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT })
        console.log(`Sign in success with ${provider}`)
    } catch (error) {
        console.error(`Sign in failed with ${provider}`, error)
    }
}