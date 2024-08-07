import prismaDB from "@/lib/prismaDB";

export const findTwoFactorTokenByToken = async (token: string) => {
    try{
        return await prismaDB.twoFactorConfirmamationToken.findUnique({
            where: {
                token: token
            }
        })
    }
    catch (error) {
        console.log("Error in findTwoFactorTokenByToken: ", error);
        return null
    }
}

export const findTwoFactorTokenByEmail = async (email: string) => {
    try{
        return await prismaDB.twoFactorConfirmamationToken.findUnique({
            where: {
                email: email
            }
        })
    }
    catch (error) {
        console.log("Error in findTwoFactorTokenByEmail: ", error);
        return null
    }
}

export const findTwoFactorConfirmationByUserID = async (userId: string) => {
    try{
        return await prismaDB.twoFactorConfirmation.findUnique({
            where: {
                userId : userId
            }
        })
    }
    catch (error) {
        console.log("Error in findTwoFactorConfirmationByUserID: ", error);
        return null
    }
}