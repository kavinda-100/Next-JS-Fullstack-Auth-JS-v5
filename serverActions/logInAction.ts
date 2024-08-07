"use server"

import z from "zod";
import prismaDB from "@/lib/prismaDB";
import {ZodLoginValidation} from "@/zod/FormValidation";
import {ZodCustomErrorMessages} from "@/zod";
import {signIn} from "@/auth";
import {AuthError} from "next-auth";
import {generateEmailVerificationToken, generateTwoFactorToken} from "@/lib/tokens";
import {findUserByEmail} from "@/lib/prismaUtils/findUser";
import {findTwoFactorConfirmationByUserID, findTwoFactorTokenByEmail} from "@/lib/prismaUtils/findTwoFactorTokens";
import {sendVerificationEmail, sendTwoFactorConfirmationEmail} from "@/lib/emailsUtils/email.utils";
import {conditionalError} from "@/lib/utils";
import {AuthActionReturnType, AuthActionReturnTypeWithTwoFactor} from "@/types";

export const LogInAction = async (data: z.infer<typeof ZodLoginValidation>): Promise<AuthActionReturnTypeWithTwoFactor> => {
    try{
        //TODO: for validation
        //validate the fields
        const validateFields = ZodLoginValidation.safeParse(data);
        //if the fields are valid,
        if(validateFields.success) {
            //extract the email and password
            const {email, password, OTPCode} = validateFields.data;
            // get the user by email from the database.
            const existingUser = await findUserByEmail(email);
            //if the user does not exist or, the user does not have the email or password
            if(!existingUser || !existingUser.email || !existingUser.password) {
                return {message: "User Does not exist"}
            }

            //TODO: for email verification
            //if the user has not verified the email
            if(!existingUser.emailVerified) {
                //generate a new verification token
                const verificationToken = await generateEmailVerificationToken(email);
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

            //TODO: for two factor authentication
            if(existingUser.isTwoFactorEnabled && existingUser.email){
                //if the OTP code is provided
                if(OTPCode){
                    //find the two-factor token by email
                    const twoFactorToken = await findTwoFactorTokenByEmail(email);
                    //if the token is not found
                    if(!twoFactorToken) return {message: "Invalid two-factor token"}
                    //if the token is different from the provided OTP code
                    if(twoFactorToken.token !== OTPCode) return {message: "Invalid OTP code"}
                    // check the code has expired or not
                    const isExpired = new Date() > new Date(twoFactorToken.expiresAt)
                    //if the code has expired
                    if(isExpired) return {message: "OTP code has expired"}
                    //delete the two-factor token
                    await prismaDB.twoFactorConfirmamationToken.delete({
                        where: {
                            id: twoFactorToken.id
                        }
                    })
                    // check the exising TwoFactorConfirmation
                    const exitingConfirmation = await findTwoFactorConfirmationByUserID(existingUser.id)
                    //if the existing confirmation is found, delete it
                    if(exitingConfirmation) {
                        await prismaDB.twoFactorConfirmation.delete({
                            where: {
                                id: exitingConfirmation.id
                            }
                        })
                    }
                    // create the TwoFactorConfirmation
                    await prismaDB.twoFactorConfirmation.create({
                        data: {
                            userId: existingUser.id,
                            token: OTPCode,
                            expiresAt: new Date(new Date().getTime() + 3600 * 1000)
                        }
                    })
                }
                //if the OTP code is not provided.
                else {
                    //generate a new two-factor token
                    const twoFactorToken = await generateTwoFactorToken(existingUser.email);
                    //if the token is not generated
                    if (!twoFactorToken) return {message: "Failed to generate two factor token"}
                    //send the email
                    const result = await sendTwoFactorConfirmationEmail(
                        twoFactorToken.email,
                        twoFactorToken.token,
                        existingUser?.name || "user",
                    );
                    //if the email is not sent
                    if (!result) return {message: "Failed to send email"}
                    //return success
                    return {twoFactor: true}
                }
            }

            //TODO: for sign in if all above is passed
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
            return {success: "Logged in successfully"}
        }
        else {
            return {message: ZodCustomErrorMessages(validateFields.error.errors)}
        }
    }
    catch (e : any) {
        return conditionalError(e);

    }
}