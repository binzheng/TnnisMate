import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Edge-compatible auth config for middleware
 * This config does NOT include the database adapter since it's not compatible with Edge runtime
 * For full config with adapter, see src/server/auth/config.ts
 */
export default {
	session: {
		strategy: "jwt",
	},
	providers: [
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			// Note: authorize logic is in src/server/auth/config.ts
			// This is a minimal config for Edge runtime middleware
			authorize: async () => {
				// This will never be called in middleware context
				// The actual authorization happens in src/server/auth/config.ts
				return null;
			},
		}),
	],
	pages: {
		signIn: "/login",
	},
} satisfies NextAuthConfig;
