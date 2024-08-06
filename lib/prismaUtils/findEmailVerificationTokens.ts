import prismaDB from "../prismaDB";

export async function findEmailVerificationTokenByEmail(email: string) {
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

export async function findEmailVerificationTokenByToken(token: string) {
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