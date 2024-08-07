"use client"

import { useUserSession } from "@/hooks/useUserSession"

const Page = () => {
    const {user, status} = useUserSession()

    if(status === "loading") return <div>loading...</div>
    if(!user){
       //refresh the page
        window.location.reload()
        console.log("user not found!. has to refresh")
    }

    return (
        <div className="flex flex-col gap-5">
            <p className="text-balck text-pretty">
                {
                   user?.name
                }
            </p>
            <p className="text-balck text-pretty">
                {
                   user?.email
                }
            </p>
            <p className="text-balck text-pretty">
                {
                   user?.role
                }
            </p>

        </div>
    );
};

export default Page;