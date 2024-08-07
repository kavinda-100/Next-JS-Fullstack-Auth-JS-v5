"use client"

import React from 'react';
import {useUserSession} from "@/hooks/useUserSession";
import UserInfo from "@/components/UserInfo";

const Page = () => {
    //get the user session from the server component
    const {user} = useUserSession()
    return (
        <UserInfo label={"📱client component "} user={user}/>
    );
};

export default Page;