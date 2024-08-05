"use server"

import z from "zod";
import {ZodLoginValidation} from "@/zod/FormValidation";
import {ZodCustomErrorMessages} from "@/zod";
import {signIn} from "@/auth";
import {AuthError} from "next-auth";
import {generateVerificationToken} from "@/lib/tokens";
import {findUserByEmail} from "@/lib/findUser";
import {sendVerificationEmail} from "@/lib/email.utils";
import {conditionalError} from "@/lib/utils";
import {AuthActionReturnTypeWithBoolean} from "@/types";

export const LogInAction = async (data: z.infer<typeof ZodLoginValidation>): Promise<AuthActionReturnTypeWithBoolean> => {
    try{
        //validate the fields
        const validateFields = ZodLoginValidation.safeParse(data);
        //if the fields are valid,
        if(validateFields.success) {
            //extract the email and password
            const {email, password} = validateFields.data;
            // get the user by email from the database.
            const existingUser = await findUserByEmail(email);
            //if the user does not exist or, the user does not have the email or password
            if(!existingUser || !existingUser.email || !existingUser.password) {
                return {message: "User Does not exist"}
            }
            //if the user has not verified the email
            if(!existingUser.emailVerified) {
                //generate a new verification token
                const verificationToken = await generateVerificationToken(email);
                //if the token is not generated
                if(!verificationToken) return {message: "Failed to generate verification token"}
                //send the email
                const result = await sendVerificationEmail(
                    verificationToken.email,
                    verificationToken.token,
                    existingUser?.name || "user"
                );
                //if the email is not sent
                if(!result) return {message: "Failed to send email"}
                //return success
                return {success: "Confirmation Email Sent"}
            }

            //sign in the user
            const result = await signIn("credentials", {
                email: email,
                password: password,
                redirect: false // prevent automatic redirect
            })
            //if the result has an error
            if(result instanceof AuthError){
                // console.log("result", result.type)
                switch(result.type){
                    case "CredentialsSignin": {
                        return {message: "Invalid credentials"}
                    }
                    case "AccessDenied": {
                        return {message: "Access denied! verify your email first"}
                    }
                    default:{
                        return {message: "something went wrong when sign in please try again"}
                    }
                }
            }
            //return success
            return {success: true}
        }
        else {
            return {message: ZodCustomErrorMessages(validateFields.error.errors)}
        }
    }
    catch (e : any) {
        return conditionalError(e);

    }
}