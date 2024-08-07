"use client"

import React from "react";
import {useSession} from "next-auth/react";
import z from 'zod';
import { useForm} from "react-hook-form";
import { zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {settingAction} from "@/serverActions/settingdAction";
import {toast} from "sonner";
import {Form, FormControl, FormMessage, FormLabel, FormItem, FormField, FormDescription} from "@/components/ui/form"
import {
    Select,
    SelectItem,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch} from "@/components/ui/switch";
import {ZodSettingsSchema} from "@/zod/ZodSettingsSchema";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import {useUserSession} from "@/hooks/useUserSession";
import { IoSettingsOutline } from "react-icons/io5";
import {UserRole} from "@prisma/client";


const Page = () => {
    const {update} = useSession()
    const {user} = useUserSession()
    if(!user) {
        window.location.reload()
    }
    console.log("OAuth ", user?.isOAuthAccount)
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | undefined>("");
    const [success, setSuccess] = React.useState<string | undefined>("");

    const formHook = useForm<z.infer<typeof ZodSettingsSchema>>({
        resolver: zodResolver(ZodSettingsSchema),
        defaultValues: {
            name: user?.name || undefined,
            email: user?.email || undefined,
            password: undefined,
            confirmPassword: undefined,
            role: user?.role || undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined
        }
    });


    const onSubmit = async (values: z.infer<typeof ZodSettingsSchema>) => {
        setIsSubmitting(true);
        await settingAction(values)
            .then((res) => {
                if(res.success) {
                    update()
                    setSuccess(res.success)
                };
                if(res.message) {
                    setError(res.message);
                }
            })
            .catch((error) => {
                return toast.error(error.message)
            })
            .finally(() => {
                setIsSubmitting(false);
            })
    }

    return (
        <Card className="w-full shadow-md overflow-hidden overflow-y-scroll">
           <CardHeader>
                <div className="flex space-x-4 items-center justify-center">
                    <IoSettingsOutline className="w-6 h-6"/>
                    <p className="font-bold font-sans text-lg">Settings</p>
                </div>
           </CardHeader>
            <CardContent>
                <Form {...formHook}>
                    <form onSubmit={formHook.handleSubmit(onSubmit)}
                          className="space-y-6">
                        <div className="space-y-4">
                            <FormField
                                control={formHook.control}
                                name={"name"}
                                render={({field, }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="email">Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type={"text"}
                                                placeholder={"John Doe"}
                                                disabled={isSubmitting}
                                                className="border shadow-sm"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {
                                !user?.isOAuthAccount && (
                                    <FormField
                                        control={formHook.control}
                                        name={"email"}
                                        render={({field, }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="email">Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type={"email"}
                                                        placeholder={"example@gmail.com"}
                                                        disabled={isSubmitting}
                                                        className="border shadow-sm"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )
                            }

                            <FormField
                                control={formHook.control}
                                name={"role"}
                                render={({field, }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="email">Role</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={isSubmitting}>
                                            <FormControl>
                                                <SelectTrigger className="border shadow-sm">
                                                    <SelectValue placeholder="Select a Role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                                                <SelectItem value={UserRole.USER}>User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {
                                !user?.isOAuthAccount && (
                                    <>
                                        <FormField
                                            control={formHook.control}
                                            name={"password"}
                                            render={({field, }) => (
                                                <FormItem>
                                                    <FormLabel htmlFor="email">Password</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type={"password"}
                                                            placeholder={"********"}
                                                            disabled={isSubmitting}
                                                            className="border shadow-sm"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={formHook.control}
                                            name={"confirmPassword"}
                                            render={({field, }) => (
                                                <FormItem>
                                                    <FormLabel htmlFor="email">Confirm Password</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type={"password"}
                                                            placeholder={"********"}
                                                            disabled={isSubmitting}
                                                            className="border shadow-sm"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={formHook.control}
                                            name={"isTwoFactorEnabled"}
                                            render={({field, }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                                                    <div className="space-x-5">
                                                        <FormLabel htmlFor="email">TwoFactor Authentication</FormLabel>
                                                        <FormDescription>
                                                            Enable TwoFactor Authentication For Your Account
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )
                            }
                        </div>

                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button type={"submit"} disabled={isSubmitting}>{
                            isSubmitting ? "Updating..." : "Update"
                        }</Button>

                    </form>
                </Form>
            </CardContent>

        </Card>
    );
};

export default Page;