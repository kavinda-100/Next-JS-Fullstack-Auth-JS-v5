import NextAuth from "next-auth";
import authConfig from "@/auth.config"
import {DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes} from "@/routesHandeler"
import {NextResponse} from "next/server";

const { auth: middleware  } = NextAuth(authConfig)

export default  middleware((req )=> {
    // This is the same as the `auth` middleware
    // get whether the user is logged in
    const isLoggedIn = !!req.auth
    // get the URL
    const {nextUrl} = req
    // check if the URL is an api auth route
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    // check if the URL is a public route
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    // check if the URL is an auth route
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    if(isApiAuthRoute) {
        // all allow api auth routes
        return
    }

    if(isAuthRoute){
        // if the user is logged in
        if(isLoggedIn){
            // redirect to the default redirect path after login
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        // allow auth routes if the user is not logged in
        return
    }

    if(!isLoggedIn && !isPublicRoute){
        // redirect to the login page if the user is not logged in
        return Response.redirect(new URL("/auth/login", nextUrl))
    }

    return

})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',]
}