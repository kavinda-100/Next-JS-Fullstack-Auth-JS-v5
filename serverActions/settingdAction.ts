"use server"

import prismaDB from "@/lib/prismaDB";
import z from 'zod';
import {ZodSettingsSchema} from '@/zod/ZodSettingsSchema';
import {findUserByEmail, findUserById} from "@/lib/prismaUtils/findUser";
import {useUserSessionFromServer} from "@/hooks/useUserSessionFromServer";
import {AuthActionReturnType} from "@/types";
import {conditionalError} from "@/lib/utils";
import {ZodCustomErrorMessages} from "@/zod";
import {generateEmailVerificationToken} from "@/lib/tokens";
import {sendVerificationEmail} from "@/lib/emailsUtils/email.utils";
import bcryptjs from "bcryptjs";

export const settingAction = async (data: z.infer<typeof ZodSettingsSchema>): Promise<AuthActionReturnType> =>  {
    try{
        //validate data
        const validatedData = ZodSettingsSchema.safeParse(data);
        if(validatedData.success) {
            const extractedData = validatedData.data;
            //get current user session
            const user = await useUserSessionFromServer();
            //if not found user
            if (!user) {
                return {message: "User not found"};
            }
            //find user by id
            const currentUser = await findUserById(user?.id || "");
            //if not found user
            if (!currentUser) {
                return {message: "Unauthorized"};
            }
            //is user OAuth user
            if(user?.isOAuthAccount){
                /**
                 * remove password, confirmPassword, isTwoFactorEnabled, email from extractedData
                 * because OAuth user can't change these settings
                 */
                extractedData.password = undefined
                extractedData.confirmPassword = undefined
                extractedData.isTwoFactorEnabled = undefined
                extractedData.email = undefined
            }
            //if extractedData.email is not empty and not equal to user.email
            if (extractedData.email && extractedData.email !== user?.email) {
                //find user by email
                const existingUser = await findUserByEmail(extractedData.email);
                //if found user with the same email
                if (existingUser && existingUser.id !== currentUser.id) {
                    return {message: "Email already in use"};
                }
                //email verification token
                const verificationToken = await generateEmailVerificationToken(extractedData.email);
                if(!verificationToken) return {message: "Failed to generate email verification token"};
                //send email verification
                const isEmailSent = await sendVerificationEmail(extractedData.email, verificationToken?.token, currentUser.name || "user");
                if(!isEmailSent) return {message: "Failed to send email verification"};
                if(isEmailSent) return {success: "Email verification sent"};

            }
            //update the password
            if(extractedData.password && extractedData.confirmPassword && currentUser.password){
                //if extractedData.password is not equal to extractedData.confirmPassword
                if(extractedData.password !== extractedData.confirmPassword){
                    return {message: "Passwords do not match"};
                }
                //update user password
                extractedData.password = await bcryptjs.hash(extractedData.password, 10);
            }
            //remove confirmPassword from extractedData
            const { confirmPassword, ...dataWithOutConfirmPassword} = extractedData;
            //update user
            await prismaDB.user.update({
                where: {id: currentUser.id},
                data: {...dataWithOutConfirmPassword}
            });
            //return a success message
            return {success: "Settings updated"};
        }
        else{
            return {message: ZodCustomErrorMessages(validatedData.error.errors)};
        }

    }
    catch (error) {
        return conditionalError(error);
    }
}