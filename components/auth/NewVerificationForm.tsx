"use client"

import {useCallback, useEffect, useState} from "react";
import { useSearchParams} from "next/navigation";
import  { BeatLoader} from "react-spinners";
import CardWrapper from "@/components/CardWrapper";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import { newEmailVerification } from "@/serverActions/new-verification";

const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const searchParams = useSearchParams();
    //get the token from the URL
    const token = searchParams.get("token");
    //submit the token to the server
    const submit = useCallback(async () => {
        if (!token) {
            setError("Token does not exist");
            return
        }
        //call the newEmailVerification function
         await newEmailVerification(token)
             .then((response) => {
                    if (response?.message) {
                        setError(response.message);
                    }
                    else if (response?.success) {
                        setSuccess(response.success);
                    }
                    else {
                        setError("something went wrong");
                    }
             })
                .catch((error) => {
                    setError(error.message);
                });

    }, [token]);
    //submit the token when the component mounts
    useEffect(() => {
        submit();
    }, [submit]);


    return (
        <CardWrapper
            headerLabel="Confirm your email address"
            backButtonLabel="Back to log in"
            backButtonHref="/auth/login"
            showSocialMedia={false}
        >
            <div className="w-full flex justify-center items-center">
                {!success && !error && (<BeatLoader/>)}
                <div>
                    <FormSuccess message={success} />
                    <FormError message={error} />
                </div>
            </div>

        </CardWrapper>
    );
};

export default NewVerificationForm;