import NextAuth, {type DefaultSession} from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prismaDB from "@/lib/prismaDB";
import {findUserById} from "@/lib/findUser";
import {UserRole} from "@prisma/client";
// import { JWT } from "@auth/core/jwt"

//extend the ser type
export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole
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
            // console.log("session", session)
            // console.log("session-token", token)
            return session
        },
        async jwt({token}){
            //check if token has user id(sub) if not it means user has log out.
            if(!token.sub) return token
            //find user by id
            const user = await findUserById(token.sub)
            //if user didn't found return token
            if(!user) return token
            //add user role to token
            token.role = user.role
            // return token
            return token
        }
    },
    adapter: PrismaAdapter(prismaDB),
    session: { strategy: "jwt" },
    ...authConfig,
})