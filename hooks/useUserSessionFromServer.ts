import {auth} from "@/auth";

export const useUserSessionFromServer = async () => {
    const session = await auth()
    return session?.user
};