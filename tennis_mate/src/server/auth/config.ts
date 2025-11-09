import { PrismaAdapter } from "@auth/prisma-adapter";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import { verifyPassword } from "~/server/auth/password";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			// ...other properties
			// role: UserRole;
		} & DefaultSession["user"];
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
	session: {
		strategy: "jwt", // Credentials providerはJWT strategyのみサポート
	},
	providers: [
		DiscordProvider,
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			authorize: async (creds) => {
				const email = (creds as any)?.email as string | undefined;
				const password = (creds as any)?.password as string | undefined;
				if (!email || !password) return null;
				const user = await db.user.findUnique({ where: { email } });
				if (!user) return null;
				const ok = verifyPassword(password, user.passwordHash ?? null);
				if (!ok) return null;
				return {
					id: user.id,
					name: user.name ?? user.email ?? "user",
					email: user.email ?? undefined,
				};
			},
		}),
		/**
		 * ...add more providers here.
		 *
		 * Most other providers require a bit more work than the Discord provider. For example, the
		 * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
		 * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
		 *
		 * @see https://next-auth.js.org/providers/github
		 */
	],
	adapter: PrismaAdapter(db),
	pages: {
		signIn: "/login",
	},
	callbacks: {
		jwt: ({ token, user }) => {
			// 初回サインイン時にuserオブジェクトが渡される
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		session: ({ session, token }): typeof session => {
			if (token.id && typeof token.id === "string") {
				session.user.id = token.id;
			}
			return session;
		},
	},
} satisfies NextAuthConfig;
