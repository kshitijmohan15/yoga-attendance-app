import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { prisma } from "../../../server/db/client";
import { randomBytes, randomUUID } from "crypto";

export const authOptions: NextAuthOptions = {
	// Include user.id on session
	callbacks: {
		session({ session, token }) {
			if (session.user) {
				session.user.id = token.sub!;
			}

			return session;
		},
	},
	// Configure one or more authentication providers
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		// ...add more providers here
	],
	session: {
		strategy: "jwt",
		generateSessionToken: () => {
			return randomUUID?.() ?? randomBytes(32).toString("hex");
		},
	},
	jwt: {
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
};

export default NextAuth(authOptions);
