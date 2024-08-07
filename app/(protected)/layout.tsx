import React from 'react';
import NavBar from "@/components/NavBar";

export default function Layout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <div className="h-full flex flex-col gap-y-10 items-center justify-center">
            <NavBar />
            {children}
        </div>
    );
};
