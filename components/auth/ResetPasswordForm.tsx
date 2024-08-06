"use client";

import React from "react";
import z from "zod";
import {useRouter, useSearchParams} from "next/navigation";
import CardWrapper from "@/components/CardWrapper";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ZodResetPassword} from "@/zod/FormValidation";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import { resetPassword} from "@/serverActions/resetPassword";
import {DEFAULT_LOGIN_REDIRECT} from "@/routesHandeler";

const ResetPasswordForm = () => {
    // search params
    const searchParams = useSearchParams();
    // get the reset password token from URL
    const token = searchParams.get("token");
    // router
    const router = useRouter()
    // navigate to
    const navigateTo = (path: string) => {
        router.push(path);
    }
    // react transition
    const [isPending, setIsPending] = React.useState(false);
    // form state
    const [error, setError] = React.useState<string | undefined>("");
    const [success, setSuccess] = React.useState<string | undefined>("");

    /**
     * zodResolver is a function that takes a Zod schema and returns a resolver function that can be used with react-hook-form.
     */
    const formHook = useForm<z.infer<typeof ZodResetPassword>>({
        resolver: zodResolver(ZodResetPassword)
    });

    const onSubmit = async (data: z.infer<typeof ZodResetPassword>) => {
        setError("");
        setSuccess("");
        setIsPending(true);
        try {
            if(!token) {
                setError("token is missing")
                return
            }
            const result = await resetPassword(data, token);
            // console.log(result)
            if (result?.message) {
                setError(result.message);
            }
            else if (result?.success) {
                setSuccess(result?.success);
                setTimeout(() => {
                    navigateTo(DEFAULT_LOGIN_REDIRECT);
                }, 2000);
            }

        }
        catch (e: any) {
            setError(e.message ? e.message : "something went wrong")
        }
        finally {
            setIsPending(false);
        }
    };

    return (
        <CardWrapper
            headerLabel="Reset Your Password"
            backButtonLabel="Back to LogIn"
            backButtonHref="/auth/login"
            showSocialMedia={false}
        >
            <Form {...formHook}>
                <form onSubmit={formHook.handleSubmit(onSubmit)}
                      className="space-y-6">
                    <div className="space-y-4">
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
                                            placeholder={"*******"}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="space-y-4">
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
                                            placeholder={"*******"}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button className="w-full" type={"submit"} disabled={isPending}>Reset Password</Button>

                </form>
            </Form>
        </CardWrapper>
    );
};

export default ResetPasswordForm;