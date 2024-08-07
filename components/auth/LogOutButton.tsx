"use client"
import React from 'react';
import { signOut } from "next-auth/react";

type LogOutButtonProps = {
    children?: React.ReactNode;
}

const LogOutButton = ({children}: LogOutButtonProps) => {
    const handleLogOut = ()=>{
        signOut()
    }
    return (
        <div onClick={handleLogOut} className="cursor-pointer">
            {children}
        </div>
    );
};

export default LogOutButton;