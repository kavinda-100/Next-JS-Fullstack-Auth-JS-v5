"use client"

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import RoleGate from "@/components/auth/RoleGate";
import {UserRole} from "@prisma/client";
import FormSuccess from "@/components/FormSuccess";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {AdminServerAction} from "@/serverActions/AdminServerAction";

const Page = () => {

    // This function is used to test the API route
    const ApiRouteClick = async () => {
        try{
            const response = await fetch("/api/admin", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if(response.ok) {
                toast.success("You are allowed to access this API route");
            }
            else{
                toast.warning("You are not allowed to access this API route");
            }
        }
        catch (error) {
            toast.warning("API Route access failed");
        }
    }

    // This function is used to test the server action
    const SeverActionClick = () => {
        AdminServerAction()
            .then((response) => {
                if(response.success){
                    toast.success(response.message);
                }
                else{
                    toast.error(response.message);
                }
            })
            .catch((error) => {
                toast.error("Server Action access failed");
            });
    }

    return (
        <Card className="w-full shadow-md">
            <CardHeader>
                <p className="text-xl lg:text-2xl font-sans font-semibold text-center">🔑 Admin</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <p className="text-lg font-sans font-semibold text-center">Welcome to the admin dashboard</p>
                    <FormSuccess message="You are Alow to see this content." />
                    <div className="flex justify-between items-center rounded-lg border p-3 shadow-md">
                        <p className="text-sm font-medium text-pretty">
                            Admin-only API Route
                        </p>
                        <Button onClick={ApiRouteClick}>
                            Click to test
                        </Button>
                    </div>
                    <div className="flex justify-between items-center rounded-lg border p-3 shadow-md">
                        <p className="text-sm font-medium text-pretty">
                            Admin-only server action
                        </p>
                        <Button onClick={SeverActionClick}>
                            Click to test
                        </Button>
                    </div>
                </RoleGate>
            </CardContent>

        </Card>
    );
};

export default Page;