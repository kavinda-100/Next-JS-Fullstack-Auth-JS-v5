import prismaDB from "@/lib/prismaDB";

export const findAccountByUserId = async (userId: string) => {
    try {
        await prismaDB.account.findFirst({
            where: {
                userId
            }
        });
    }
    catch (e) {
        console.log("findAccountByUserId", e);
        return null;
    }
}