
import {useSession} from "next-auth/react";

export const useUserSession = () => {
    const session = useSession()

    const user = session?.data?.user
    const status = session.status
    return {user, status}
};
