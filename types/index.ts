

export type AuthActionReturnType = {
    success?: string | undefined;
    message?: string | undefined;
}

export type AuthActionReturnTypeWithBoolean = {
    success?: string | undefined | boolean;
    message?: string | undefined;
}