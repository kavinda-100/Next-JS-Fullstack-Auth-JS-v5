import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prismaDB from "./lib/prismaDB";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prismaDB),
    session: { strategy: "jwt" },
    ...authConfig,
})