"use server"

import prismaDB from "@/lib/prismaDB";
import { findUserByEmail} from "@/lib/prismaUtils/findUser";
import { findEmailVerificationTokenByToken} from "@/lib/prismaUtils/findEmailVerificationTokens";
import {conditionalError} from "@/lib/utils";
import {AuthActionReturnType} from "@/types";

export const newEmailVerification = async (token: string): Promise<AuthActionReturnType> => {
    try{
        //get the verification token from the database
        const existingToken = await findEmailVerificationTokenByToken(token);
        //if the token does not exist, return message
        if (!existingToken) {
            return { message: "Token does not exit" };
        }
        //check if the token has expired
        const isTokenExpired = new Date(existingToken.expiresAt) < new Date();
        //if the token has expired, return message
        if (isTokenExpired) {
            return { message: "Token has expired" };
        }
        //find the user by the email address
        const user = await findUserByEmail(existingToken.email);
        //if the user does not exist, return message
        if (!user) {
            return { message: "User does not exist" };
        }
        //update the user's emailVerified field to new Date()
        await prismaDB.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                email: existingToken.email,
            },
        });
        //delete the verification token from the database
        await prismaDB.verificationToken.delete({
            where: { id: existingToken.id },
        });
        //return message
        return { success: "Email verified" };

    }
    catch (error: any) {
        console.log(error);
        return conditionalError(error);
    }
}