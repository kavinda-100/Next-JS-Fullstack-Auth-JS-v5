import CardWrapper from "@/components/CardWrapper";
import {ExclamationTriangleIcon} from "@radix-ui/react-icons";

const ErrorCard = () => {
    return (
        <CardWrapper
            headerLabel="Oops! something went wrong."
            backButtonLabel="Back to LogIn"
            backButtonHref="/auth/login"
            showSocialMedia={false}>
            <div className="w-full flex justify-center items-center">
                <ExclamationTriangleIcon className="w-7 h-7 text-destructive" />
            </div>
        </CardWrapper>
    );
};

export default ErrorCard;