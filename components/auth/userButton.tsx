"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar"
import { FaUser} from "react-icons/fa";
import {ExitIcon} from "@radix-ui/react-icons"
import {useUserSession} from "@/hooks/useUserSession";
import LogOutButton from "./LogOutButton";

const UserButton = () => {
    const {user} = useUserSession()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback><FaUser /></AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-40" align={"end"}>
                <LogOutButton>
                    <DropdownMenuItem>
                        <ExitIcon className="w-4 h-4 mr-2" />
                        Log out
                    </DropdownMenuItem>
                </LogOutButton>
            </DropdownMenuContent>

        </DropdownMenu>
    );
};

export default UserButton;