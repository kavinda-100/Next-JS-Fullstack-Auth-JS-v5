"use server"

import z from "zod";
import {ZodSignUpValidation} from "@/zod/FormValidation";
import {ZodCustomErrorMessages} from "@/zod";
import bcryptjs from "bcryptjs";
import prismaDB from "@/lib/prismaDB";
import {findUserByEmail} from "@/lib/findUser";

export const RegisterAction = async (data: z.infer<typeof ZodSignUpValidation>)  => {
    try{
        const validateFields = ZodSignUpValidation.safeParse(data);
        if(validateFields.success) {
            // extract the fields
            const {email, password, name} = validateFields.data
            // hash the password
            const hashedPassword = await bcryptjs.hash(password, 10);
            //check if the email is already in use
            const existingUser = await findUserByEmail(email);
            // if the user already exists
            if(existingUser) {
                return {message: "Email already in use"}
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
            return {success: "Email Sent"}

        }
        else return {message: ZodCustomErrorMessages(validateFields.error.errors)}
    }
    catch (e : any) {
        return e.message ? e.message : "something went wrong"
    }
}