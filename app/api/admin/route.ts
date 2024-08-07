import {NextResponse} from "next/server";
import {useUserSessionFromServer} from "@/hooks/useUserSessionFromServer";
import {UserRole} from "@prisma/client";

export async function GET(){
    // Get the user session
    const user = await useUserSessionFromServer()
    // Check if the user is not an admin
    if(user?.role !== UserRole.ADMIN) {
       return  new NextResponse(null, {status: 403})
    }
    else{
       return NextResponse.json({message: "You are allowed to access this API"}, {status: 200})
    }
}