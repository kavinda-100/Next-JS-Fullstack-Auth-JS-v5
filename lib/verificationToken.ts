import prismaDB from "./prismaDB";

export async function getVerificationTokenByEmail(email: string) {
    try {
        return await prismaDB.verificationToken.findFirst({
            where: {
                email: email,
            }
        })
    }
    catch (error) {
        console.error("getVerificationTokenByEmail ",error)
        return null
    }
}

export async function getVerificationTokenByToken(token: string) {
    try {
        return await prismaDB.verificationToken.findFirst({
            where: {
                token
            }
        })
    }
    catch (error) {
        console.error("getVerificationTokenByToken ",error)
        return null
    }
}