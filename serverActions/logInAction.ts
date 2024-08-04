"use server"

import {z, ZodError} from "zod";
import {ZodLoginValidation} from "@/zod/FormValidation";
import {AuthActionReturnType} from "@/types";
import {ZodCustomErrorMessages} from "@/zod";
import {signIn} from "@/auth";
import {DEFAULT_LOGIN_REDIRECT} from "@/routesHandeler";
import {AuthError} from "next-auth";

export const LogInAction = async (data: z.infer<typeof ZodLoginValidation>) : Promise<AuthActionReturnType> => {
    try{
        //validate the fields
        const validateFields = ZodLoginValidation.safeParse(data);
        //if the fields are not valid
        if(!validateFields.success) {
            return {
                success: undefined,
                error: ZodCustomErrorMessages(validateFields.error.errors)
            }
        }
        //if the fields are valid,
        //extract the email and password
        const {email, password} = validateFields.data;
        //sign in the user
        await signIn("credentials", {
            email: email,
            password: password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        })
        //return success
        return {
            success: "Email Sent",
            error: undefined
        }
    }
    catch (e : any) {
        //if the error is an AuthError that return from signIn function
        if(e instanceof AuthError) {
            switch(e.type){
                case "CredentialsSignin": {
                    return {
                        success: undefined,
                        error: "Invalid credentials"
                    }
                }
                default:{
                    return {
                        success: undefined,
                        error: "something went wrong when sign in please try again"
                    }
                }
            }
        }
        //if the error is a general error
        return {
            success: undefined,
            error: e.message ? e.message : "something went wrong",
        }
    }
}