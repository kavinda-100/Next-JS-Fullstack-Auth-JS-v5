"use server"

import {useUserSessionFromServer} from "@/hooks/useUserSessionFromServer";
import {UserRole} from "@prisma/client";

export const AdminServerAction = async () => {
    const user = await useUserSessionFromServer()

    if(user?.role === UserRole.ADMIN) {
        return {
            success: true,
            message: "You are allowed to access this server action"
        };
    }
    else{
        return {
            success: false,
            message: "You are not allowed to access this server action"
        }
    }
}