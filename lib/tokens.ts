import { v4 as uuid } from "uuid";
import prismaDB from "@/lib/prismaDB";
import {getVerificationTokenByEmail} from "@/lib/verificationToken";

export const generateVerificationToken = async (email : string) => {
    try {
        const token = uuid();
        const expiresAt = new Date(new Date().getTime() + 3600 * 1000); // 1 hour
        // Check if there is an existing token for the email
        const existingToken = await getVerificationTokenByEmail(email);
        // If there is an existing token, delete it
        if (existingToken) {
            await prismaDB.verificationToken.delete({
                where: {
                    id: existingToken.id
                }
            });
        }
        // Create a new token
        return await prismaDB.verificationToken.create({
            data: {
                email,
                token,
                expiresAt
            }
        });
    }
    catch (error) {
        console.log("Error in generateVerificationToken: ", error);
        return null;
    }
}