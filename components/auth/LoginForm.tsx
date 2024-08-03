import React from "react";
import CardWrapper from "@/components/CardWrapper";

const LoginForm = () => {
    return (
        <CardWrapper
            headerLabel="Welcome Back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocialMedia
        >
            LoginForm
        </CardWrapper>
    );
};

export default LoginForm;
