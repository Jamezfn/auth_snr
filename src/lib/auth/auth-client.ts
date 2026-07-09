import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
import { inferAdditionalFields, twoFactorClient, adminClient, organizationClient } from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client"
import { ac, admin, user } from "@/components/auth/permisssions";

export const authClient = createAuthClient({
	plugins: [inferAdditionalFields<typeof auth>(),
		passkeyClient(),
		adminClient({
			ac,
			roles: {
				admin,
				user
			}
		}),
		twoFactorClient({
			onTwoFactorRedirect: () => {
				window.location.href = "/auth/2fa"
			}
		}),
		organizationClient()
	]
});