"use server"

import {z, ZodError} from "zod";
import {ZodSignUpValidation} from "@/zod/FormValidation";
import {AuthActionReturnType} from "@/types";
import {ZodCustomErrorMessages} from "@/zod";

export const RegisterAction = async (data: z.infer<typeof ZodSignUpValidation>) : Promise<AuthActionReturnType> => {
    try{

        const validateFields = ZodSignUpValidation.safeParse(data);

        if(!validateFields.success) {
            new ZodError(validateFields.error.errors);
        }

        console.log(validateFields)
        return {
            success: "Email Sent",
            error: undefined
        }
    }
    catch (e : any | ZodError) {
        if(e instanceof ZodError) {
            return {
                error: ZodCustomErrorMessages(e.errors)
            }
        }
        return {
            error: e.message ? e.message : "something went wrong",
        }
    }
}