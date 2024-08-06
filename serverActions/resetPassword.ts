"use server"

import z from "zod"
import {ZodResetResetPasswordSendEmail, ZodResetPassword} from "@/zod/FormValidation";
import prismaDB from "@/lib/prismaDB";
import {findUserByEmail} from "@/lib/prismaUtils/findUser";
import {conditionalError} from "@/lib/utils";
import {AuthActionReturnType} from "@/types";
import {ZodCustomErrorMessages} from "@/zod";
import { sendPasswordResetEmail} from "@/lib/email.utils";
import { generatePasswordResetToken} from "@/lib/tokens";
import {findPasswordResetTokenByToken} from "@/lib/prismaUtils/findPasswordResetTokens";
import bcryptjs from "bcryptjs";

export const sendResetPasswordEmail = async (data: z.infer<typeof ZodResetResetPasswordSendEmail>): Promise<AuthActionReturnType> => {
    try{
        // validate the fields
        const validatedFields = ZodResetResetPasswordSendEmail.safeParse(data)
        // if success
        if(validatedFields.success){
            const {email} = validatedFields.data
            // get the user
            const user = await findUserByEmail(email)
            // if user not found
            if(!user){
                return {message : "user not found"}
            }
            // generate token
            const passwordResetToken = await generatePasswordResetToken(email)
            //if token not generated
            if(!passwordResetToken) return {message : "Token not generated"}
            // send email
            const isEmailSent = await sendPasswordResetEmail(
                passwordResetToken.email,
                passwordResetToken?.token,
                user?.name || "User")

            // if email is not sent
            if(!isEmailSent){
                return {message : "Email not sent. Please try again"}
            }
            // return success
            return {success : "Reset Email Sent"}

        }
        // if fail
        else{
            return {message : ZodCustomErrorMessages(validatedFields.error.errors)}
        }
    }
    catch (e: any) {
        return conditionalError(e)
    }
}


export const resetPassword = async (data: z.infer<typeof ZodResetPassword>, token : string | null): Promise<AuthActionReturnType> => {
    try{
        if(!token) return {message : "Token is Missing"}
        // validate the fields
        const validatedFields = ZodResetPassword.safeParse(data)
        // if success
        if(validatedFields.success){
            const {password} = validatedFields.data
            // get the token
            const passwordResetToken = await findPasswordResetTokenByToken(token)
            // if token not found
            if(!passwordResetToken){
                return {message : "Token not found"}
            }
            // is token expired
            const isTokenExpired = new Date() > new Date(passwordResetToken.expiresAt)
            // if the token is expired
            if(isTokenExpired){
                return {message : "Token is expired"}
            }
            // find the user
            const user = await findUserByEmail(passwordResetToken.email)
            // if user not found
            if(!user){
                return {message : "Email does not exit!"}
            }
            // hash the password
            const hashedPassword = await bcryptjs.hash(password, 10)
            // update the password
            await prismaDB.user.update({
                where: {
                    id: user.id
                },
                data: {
                    password: hashedPassword
                }
            })
            // delete the token
            await prismaDB.passwordResetToken.delete({
                where: {
                    id: passwordResetToken.id
                }
            })

            // return success
            return {success : "Password Reset Successfully"}

        }
        // if fail
        else{
            return {message : ZodCustomErrorMessages(validatedFields.error.errors)}
        }

    }
    catch (e: any) {
        return conditionalError(e)
    }
}