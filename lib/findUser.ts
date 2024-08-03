import prismaDB from "./prismaDB";

export const findUserByEmail = async (email: string) => {
    try {
        return await prismaDB.user.findUnique({
            where: {
                email: email
            }
        })
    }
    catch (e) {
        return null
    }
}

export const findUserById = async (id: string) => {
    try {
        return await prismaDB.user.findUnique({
            where: {
                id: id
            }
        })
    }
    catch (e) {
        return null
    }
}