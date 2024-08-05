/**
 * This contains all the public routes of the application
 * these routes do not require authentication
 * @type {string[]}
 * */
export const publicRoutes: string[] = [
    "/"
]

/**
 * This file contains all the public routes of the application
 * these routes use for authentication
 * these routes redirect user to setting page after login
 * @type {string[]}
 * */

export const authRoutes: string[] = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
]

/**
 * This prefix for authentication routes
 *  that are start with this prefix are used for API authentication purposes
 * @type {string}
 * */
export const apiAuthPrefix: string = "/api/auth"

/**
 * default redirect path after login
 * @type {string}
 * */
export const DEFAULT_LOGIN_REDIRECT: string = "/settings"

