"use client";

import React from "react";
import z from "zod";
import {useRouter} from "next/navigation";
import CardWrapper from "@/components/CardWrapper";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ZodResetResetPasswordSendEmail} from "@/zod/FormValidation";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import  {sendResetPasswordEmail} from "@/serverActions/resetPassword";
import {DEFAULT_LOGIN_REDIRECT} from "@/routesHandeler";

const ResetForm = () => {
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
    const formHook = useForm<z.infer<typeof ZodResetResetPasswordSendEmail>>({
        resolver: zodResolver(ZodResetResetPasswordSendEmail)
    });

    const onSubmit = async (data: z.infer<typeof ZodResetResetPasswordSendEmail>) => {
        setError("");
        setSuccess("");
        setIsPending(true);
        try {
            const result = await sendResetPasswordEmail(data)
            console.log(result)
            if (result?.message) {
                setError(result.message);
            }
            else if (result?.success) {
                setSuccess(result?.success);
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
            headerLabel="Frogot Your Password?"
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
                            name={"email"}
                            render={({field, }) => (
                                <FormItem>
                                    <FormLabel htmlFor="email">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type={"email"}
                                            placeholder={"example@gmail.com"}
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
                    <Button className="w-full" type={"submit"} disabled={isPending}>Send Email</Button>

                </form>
            </Form>
        </CardWrapper>
    );
};

export default ResetForm;
