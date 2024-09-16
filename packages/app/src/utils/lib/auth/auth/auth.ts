import NextAuth, { type NextAuthConfig } from "next-auth";
import authConfig from "./auth.config";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@dragonstart/core/drizzle/schema";

const additionalConfig = {
  providers: [...authConfig.providers],
  secret: process.env.AUTH_SECRET,
  callbacks: authConfig.callbacks,
} satisfies NextAuthConfig;

export const config = {
  // ...authConfig,
  pages: {
    signIn: "/login",
    signOut: "/register",
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...additionalConfig,
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
