import React from 'react';
import {ExtendedUser} from "@/auth";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

type UserInfoProps = {
    user?: ExtendedUser
    label: string
}

const UserInfo = ({user, label} :UserInfoProps) => {
    return (
        <Card className="w-full shadow-md">
            <CardHeader>
                <h3 className="text-pretty font-bold text-center">{label}</h3>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-balck text-pretty font-semibold">ID:</p>
                    <p className="font-normal text-sm truncate max-w-[300px] font-mono p-1 bg-slate-100 rounded-md">{user?.id}</p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-balck text-pretty font-semibold">Name:</p>
                    <p className="font-normal text-sm truncate max-w-[200px] font-mono p-1 bg-slate-100 rounded-md">{user?.name}</p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-balck text-pretty font-semibold">Email:</p>
                    <p className="font-normal text-sm truncate max-w-[300px] font-mono p-1 bg-slate-100 rounded-md">{user?.email}</p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-balck text-pretty font-semibold">Role:</p>
                    <p className="font-normal text-sm truncate max-w-[200px] font-mono p-1 bg-slate-100 rounded-md">{user?.role}</p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-balck text-pretty font-semibold">Two Factor Authentication:</p>
                    <Badge variant={
                        user?.isOAuthAccount ? "success" : user?.isTwoFactorEnabled ? "success" : "destructive"
                    }>
                        {user?.isTwoFactorEnabled ? "Enabled" : user?.isOAuthAccount ? "Enabled" : "Disabled"}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserInfo;