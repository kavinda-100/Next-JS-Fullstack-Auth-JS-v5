import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import {ZodLoginValidation} from "@/zod/FormValidation";
import {findUserByEmail} from "@/lib/findUser";
import bcryptjs from "bcryptjs";

// Notice this is only an object, not a full Auth.js instance
export default {
    providers: [
        Credentials({
            name: "credentials",
            async authorize(credentials) {
                // Validate the fields
                const validatedFields = ZodLoginValidation.safeParse(credentials)
                // If the fields are invalid, throw an error
                if (validatedFields.success) {
                    // If the fields are valid, extract the email and password
                    const {email, password} = validatedFields.data
                    // Find the user by email
                    const user = await findUserByEmail(email)
                    /**
                    * If the user is not found, and if a user doesn't have a password return null
                    * because user might be register using Google or GitHub or other providers,
                    * and then they try to log in using email and password which doesn't exist in credentials provider,
                    * so we don't want to return error, we just want to return null
                    */
                    if(!user || !user.password) return null
                    // Compare the password
                    const isPasswordValid = await bcryptjs.compare(password, user.password)
                    // If the password is invalid, return null
                    if (isPasswordValid) return user
                }
                // if any other case,
                return null
            }
        })
    ],
} satisfies NextAuthConfig