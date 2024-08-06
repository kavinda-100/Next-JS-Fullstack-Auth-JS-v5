import prismaDB from "@/lib/prismaDB";

export const findPasswordResetTokenByToken = async (token: string) => {
    try{

        return await prismaDB.passwordResetToken.findUnique({
            where: {
                token: token
            }
        });
    }
    catch (e){
        console.log("Error in getPasswordResetTokenByToken: ", e)
        return null
    }
}
export const findPasswordResetTokenByEmail = async (email: string) => {
    try{

        return await prismaDB.passwordResetToken.findUnique({
            where: {
                email: email
            }
        });
    }
    catch (e){
        console.log("Error in getPasswordResetTokenByToken: ", e)
        return null
    }
}