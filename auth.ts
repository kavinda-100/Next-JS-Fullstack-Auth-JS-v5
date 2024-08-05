import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prismaDB from "./lib/prismaDB";

export const { handlers, auth, signIn, signOut } = NextAuth({
    callbacks:{
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
            console.log("session", session)
            console.log("session-token", token)
            return session
        },
        async jwt({token}){
            return token
        }
    },
    adapter: PrismaAdapter(prismaDB),
    session: { strategy: "jwt" },
    ...authConfig,
})