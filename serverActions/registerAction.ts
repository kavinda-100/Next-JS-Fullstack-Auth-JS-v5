"use server"

import {z, ZodError} from "zod";
import {ZodSignUpValidation} from "@/zod/FormValidation";
import {AuthActionReturnType} from "@/types";
import {ZodCustomErrorMessages} from "@/zod";
import bcryptjs from "bcryptjs";
import prismaDB from "@/lib/prismaDB";
import {findUserByEmail} from "@/lib/findUser";

export const RegisterAction = async (data: z.infer<typeof ZodSignUpValidation>) : Promise<AuthActionReturnType> => {
    try{

        const validateFields = ZodSignUpValidation.safeParse(data);

        if(!validateFields.success) {
            return {
                success: ZodCustomErrorMessages(validateFields.error.errors),
                error: undefined
            }
        }
        // extract the fields
        const {email, password, name} = validateFields.data
        // hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);
        //check if the email is already in use
        const existingUser = await findUserByEmail(email);
        // if the user already exists
        if(existingUser) {
            return {
                success: undefined,
                error: "Email already in use"
            }
        }
        // create the user
        await prismaDB.user.create({
            data: {
                email: email,
                name: name,
                password: hashedPassword
            }
        })

        //TODO: // send email verification
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