import React from 'react';
import {useUserSessionFromServer} from "@/hooks/useUserSessionFromServer";
import UserInfo from "@/components/UserInfo";

const Page = async () => {
    //get the user session from the server component
    const user = await useUserSessionFromServer()
    return (
       <UserInfo label={"💻 server component "} user={user}/>
    );
};

export default Page;