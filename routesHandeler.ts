/**
 * This contains all the public routes of the application
 * these routes do not require authentication
 * @type {string[]}
 * */
export const publicRoutes = [
    "/"
    ]

/**
 * This file contains all the public routes of the application
 * these routes use for authentication
 * these routes redirect user to setting page after login
 * @type {string[]}
 * */

export const authRoutes = [
    "/auth/login",
    "/auth/register",

]

/**
 * This prefix for authentication routes
 *  that are start with this prefix are used for API authentication purposes
 * @type {string}
 * */
export const apiAuthPrefix = "api/auth"

/**
 * default redirect path after login
 * @type {string}
 * */
export const DEFAULT_LOGIN_REDIRECT = "/settings"

/**
 * This file contains all the private routes of the application
 * these routes only accessible after login user
 * @type {string[]}
 * */
export const protectedRoutes = [
    "/settings",
]
