import NextAuth, {type DefaultSession} from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prismaDB from "@/lib/prismaDB";
import {findUserById} from "@/lib/prismaUtils/findUser";
import { findTwoFactorConfirmationByUserID} from "@/lib/prismaUtils/findTwoFactorTokens";
import {UserRole} from "@prisma/client";
import {findAccountByUserId} from "./lib/prismaUtils/findAccount";
// import { JWT } from "@auth/core/jwt"

//extend the ser type
export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole
    isTwoFactorEnabled: boolean
    isOAuth: boolean
}

//extend the session to add user and role
declare module "next-auth" {
    interface Session{
        user: ExtendedUser
    }
}

//extend the jwt to add a role
declare module "@auth/core/jwt" {
    interface JWT{
        role?: UserRole
        isTwoFactorEnabled?: boolean
        isOAuth?: boolean
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    events: {
        async linkAccount({user}) {
            try{
                await prismaDB.user.update({
                    where: {id: user.id},
                    data: {
                        emailVerified: new Date()
                    }
                })
            }
            catch (e){
                console.log("linkAccount", e)
            }
        }
    },
    callbacks:{
        async signIn({user, account}){
            // allow OAuth sign-in without email verification
            if(account?.provider !== "credentials") return true
            // console.log("user", user)
            // get user by id
            const existingUser = await findUserById(user?.id || "")
            /**
             * blocking user not exit or user exist but not verified there email
             * in this case we can return false to block the user from sign-in
             * */
            if(!existingUser || !existingUser?.emailVerified) {
                return false
            }
            // check twoFactorConfirmation
            if(existingUser.isTwoFactorEnabled){
                // check if user has twoFactorConfirmation token in the database
                const twoFactorConfirmation = await findTwoFactorConfirmationByUserID(existingUser.id)
                if(!twoFactorConfirmation){
                    // if not found, return false to block the user from sign-in
                    return false
                }
                //delete the twoFactorConfirmation from the database to next sign-in
                await prismaDB.twoFactorConfirmation.delete({
                    where: {id: twoFactorConfirmation.id}
                })
            }
            //if user exists and verifies
            return true
        },
        async session({session, token}){
            //check if session has user and token has sub
            if(session.user && token.sub){
                /**
                 * Add the user id to the session which in token.sub
                 * by doing that we can access the user id in the session which mean we can access
                 * the user id in both sever and client side/component
                 * because by default session not include the user id
                 * */
                session.user.id = token.sub
            }
            if(token.role && session.user){
                /**
                 * Add the user role to the session which in token.role
                 * by doing that we can access the user role in the session which mean we can access
                 * the user role in both sever and client side/component
                 * because by default session not include the user role
                 * we have to get it first from the token by calling to database
                 * (it's done in the jwt callback below)
                 * */
                session.user.role = token.role
            }
            if(session.user){
                /**
                 * does the same thing for isTwoFactorEnabled field.
                 * but only look for session because isTwoFactorEnabled is a boolean field
                 * it can be false.
                 * */
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
                session.user.name = token.name as string
                session.user.email = token.email as string
                session.user.isOAuth = token.isOAuth as boolean
            }
            // console.log("session", session)
            // console.log("session-token", token)
            return session
        },
        async jwt({token, account}){
            //check if token has user id(sub) if not it means user has log out.
            if(!token.sub) return token
            //find user by id
            const user = await findUserById(token.sub)
            //if user didn't found return token
            if(!user) return token

            //get the user account.
            const Account = await findAccountByUserId(user.id)
            //add user role to token
            token.isOAuth = !!Account || account?.provider === "oauth"
            token.role = user.role
            token.isTwoFactorEnabled = user.isTwoFactorEnabled as boolean
            token.name = user.name
            token.email = user.email
            // return token
            return token
        }
    },
    adapter: PrismaAdapter(prismaDB),
    session: { strategy: "jwt" },
    ...authConfig,
})