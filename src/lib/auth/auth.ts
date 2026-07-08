import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import { nextCookies } from "better-auth/next-js";
import { sendPasswordResetEmail } from "../emails/sendPasswordResetEmail";
import { sendEmailVerificationEmail } from "../emails/email-verification";
import { createAuthMiddleware } from "better-auth/api";
import { sendWelcomeEmail } from "../emails/send-welcome-email";
import { sendDeleteAccountVerificationEmail } from "../emails/delete-verification-email";
import { twoFactor } from "better-auth/plugins/two-factor";

export const auth = betterAuth({
	user: {
		changeEmail: {
			enabled: true,
			sendChangeEmailConfirmation: async ({ user, url, newEmail }) => {
				sendEmailVerificationEmail({
					user: { ...user, email: user.email },
					url,
				})
			}
		},
		deleteUser: {
			enabled: true,
			sendDeleteAccountVerification: async ({ user, url, token }) => {
				await sendDeleteAccountVerificationEmail({ user, url })
			}
		},
		additionalFields: {
			favoriteNumber: {
				type: "number",
				required: true,
			}
		}
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			await sendPasswordResetEmail({ user, url })
		}
	},
	emailVerification: {
		autoSignInAfterVerification: true,
		sendOnSignUp: true,
		sendVerificationEmail: async ({ user, url }) => {
			await sendEmailVerificationEmail({ user, url })
		}
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
			mapProfileToUser: (profile) => {
				return {
					favoriteNumber: Number(profile.public_repos) || 0
				}
			}
		},
		discord: {
			clientId: process.env.DISCORD_CLIENT_ID!,
			clientSecret: process.env.DISCORD_CLIENT_SECRET!,
			mapProfileToUser: () => {
				return {
					favoriteNumber: 0
				}
			}
		},
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5
		}
	},
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	hooks: {
		after: createAuthMiddleware(async ctx => {
			if (ctx.path.startsWith("/sign-up")) {
				const user = ctx.context.newSession?.user ?? {
					name: ctx.body.name,
					email: ctx.body.email
				}
				if (user != null) {
					await sendWelcomeEmail({ user: user })
				}
			}
		})
	},
	plugins: [nextCookies(), twoFactor()],
});