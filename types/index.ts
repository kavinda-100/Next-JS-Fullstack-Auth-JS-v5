

export type AuthActionReturnType = {
    success?: string | undefined;
    message?: string | undefined;
}

export type AuthActionReturnTypeWithTwoFactor = {
    success?: string | undefined;
    message?: string | undefined;
    twoFactor?: boolean
}