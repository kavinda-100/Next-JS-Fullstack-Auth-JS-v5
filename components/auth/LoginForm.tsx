"use client";

import React from "react";
import CardWrapper from "@/components/CardWrapper";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";
import {ZodLoginValidation} from "@/zod/FormValidation";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import {LogInAction} from "@/serverActions/logInAction";

const LoginForm = () => {
    // react transition
    const [isPending, startTransition] = React.useTransition();
    // form state
    const [error, setError] = React.useState<string | undefined>("");
    const [success, setSuccess] = React.useState<string | undefined>("");

    /**
     * zodResolver is a function that takes a Zod schema and returns a resolver function that can be used with react-hook-form.
     */
    const formHook = useForm<z.infer<typeof ZodLoginValidation>>({
        resolver: zodResolver(ZodLoginValidation)
    });

    const onSubmit = (data: z.infer<typeof ZodLoginValidation>) => {
        startTransition(() => {
            LogInAction(data)
                .then((m) => {
                    setSuccess(m.success);
                    setError(m.error);
                })
                .catch((e) => {
                    setError(e.error);
                    setSuccess(undefined);
                });
        })
    };

    return (
        <CardWrapper
            headerLabel="Welcome Back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocialMedia
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
                    <Button className="w-full" type={"submit"} disabled={isPending}>LogIn</Button>

                </form>
            </Form>
        </CardWrapper>
    );
};

export default LoginForm;
