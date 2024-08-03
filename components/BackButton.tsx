"use client";

import React from 'react';
import {Button} from "@/components/ui/button";
import Link from "next/link";

type BackButtonProps = {
    label: string;
    href: string;

}
const BackButton = ({ label, href} : BackButtonProps) => {
    return (
        <Button variant={"link"} size={"sm"} asChild className="w-full">
            <Link href={href} className="text-center hover:underline">{label}</Link>
        </Button>
    );
};

export default BackButton;